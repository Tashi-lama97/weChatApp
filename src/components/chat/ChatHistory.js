import React, { useEffect, useState, useContext } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";
import { getChatHistory, readMessage } from "./helper/apicalls";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { SocketContext } from "./helper/socket";
import { cloneDeep } from "lodash";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const ChatHistory = ({ setMessgeInfo }) => {
  const socket = useContext(SocketContext);
  const { token, user } = isAuthenticated();
  const [lastChatId, setLastChatId] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const forceUpdate = useForceUpdate();

  const [historyIndicators, setHistoryIndicators] = useState({
    historyLoading: "",
    historySuccess: "",
    historyError: "",
  });

  const { historyLoading, historySuccess, historyError } = historyIndicators;

  const onClickHandler = (chat) => {
    //Reciver Info
    const reciverId = chat.reciver == user._id ? chat.sender : chat.reciver;
    const reciverName =
      chat.reciver == user._id
        ? chat.senderInfo[0].name
        : chat.reciverInfo[0].name;

    //Chat Leaving
    if (lastChatId) {
      socket.emit("leaveChat", { chatId: lastChatId }, (error) => {
        if (error) {
          NotificationManager.error(error, "Error", 10000);
        }
      });
    }
    //Chat Joining
    socket.emit(
      "join",
      {
        chat_id: chat._id.chatId,
      },
      (error) => {
        if (error) {
          NotificationManager.error(error, "Error", 10000);
        }
      }
    );

    readMessage(token, chat._id.chatId, user._id).then((data) => {
      if (data.error) {
        console.log("error reading message");
      }
    });

    //read Chat locally
    let data = chatHistory;
    let index = data.findIndex((d) => d._id.chatId === chat._id.chatId);
    if (data[index]) {
      data[index].unread = false;
      setChatHistory(data);
      forceUpdate();
    }

    //setting up states
    setLastChatId(chat._id.chatId);
    setMessgeInfo(reciverId, reciverName, chat._id.chatId);
  };

  useEffect(() => {
    setHistoryIndicators({
      ...historyIndicators,
      historyLoading: true,
      historySuccess: "",
      historyError: "",
    });
    getChatHistory(token, user._id).then((data) => {
      if (data.error) {
        setHistoryIndicators({
          ...historyIndicators,
          historyLoading: false,
          historySuccess: false,
          historyError: data.error,
        });
        NotificationManager.error(data.error, "Error", 10000);
      } else {
        setHistoryIndicators({
          ...historyIndicators,
          historyLoading: false,
          historySuccess: true,
          historyError: false,
        });

        setChatHistory(data);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("updateChatHistory", (chatUpdate) => {
      let data = cloneDeep(chatHistory);

      let index = data.findIndex((d) => d._id.chatId === chatUpdate.chatId);
      if (data[index]) {
        data[index].message = chatUpdate.message;
        data[index].date = new Date().toISOString();
        data[index].unread = true;

        data[index].reciverInfo =
          chatHistory[index].reciver === chatUpdate.reciver
            ? chatHistory[index].reciverInfo
            : chatHistory[index].senderInfo;

        data[index].senderInfo =
          chatHistory[index].sender === chatUpdate.sender
            ? chatHistory[index].senderInfo
            : chatHistory[index].reciverInfo;

        data[index].reciver = chatUpdate.reciver;
        data[index].sender = chatUpdate.sender;

        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setChatHistory(data);
        forceUpdate();
      }
    });
  }, [chatHistory]);

  return (
    <>
      <div className="title flex bg-gray-100 flex-col">
        <h3 className="titleText">Recent</h3>
        <h3 className="titleText">Chats</h3>
      </div>
      <div className="chatHistoryWrapper ">
        <SimpleBar style={{ maxHeight: 420 }}>
          {historyLoading ? (
            <div className="chatHistoryMessageWrapper animate-pulse">
              <div className="userIcon">
                <div className="rounded-full bg-blue-400 h-12 w-12"></div>
              </div>
              <div className="userData space-y-2">
                <div className="h-4 bg-blue-400 rounded"></div>
                <div className="h-4 bg-blue-400 rounded w-5/6"></div>
              </div>
            </div>
          ) : chatHistory.length !== 0 && typeof chatHistory == "object" ? (
            chatHistory.map((chat, index) => {
              return (
                <div
                  onClick={() => {
                    onClickHandler(chat);
                  }}
                  className={
                    chat.sender !== user._id && chat.unread === true
                      ? "chatHistoryMessageWrapper unReadChat"
                      : "chatHistoryMessageWrapper "
                  }
                  key={chat._id.chatId}
                >
                  <div className="userIcon">
                    <img src={USERPIC} alt="demoPic" className="userPic" />
                  </div>
                  <div className="userData">
                    <h3 className="chatName">
                      {chat.reciver == user._id
                        ? chat.senderInfo[0].name
                        : chat.reciverInfo[0].name}
                    </h3>
                    <h6 className="chatLastMessage">{chat.message}</h6>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="chatHistoryMessageWrapper">
              <h3>No chats</h3>
            </div>
          )}
        </SimpleBar>
      </div>
      <NotificationContainer />
    </>
  );
};

export default ChatHistory;
