import React, { useEffect, useState } from "react";
import { isAuthenticated, tryLogOut } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";

import {
  getChatHistory,
  trySendingMessage,
  getAllMessages,
} from "./helper/apicalls";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import ChatHistory from "./ChatHistory";
import Contacts from "./Contacts";
import AddContact from "./AddContact";
import SelectSection from "./SelectSection";
import TopBar from "./TopBar";
import Messages from "./Messages";
import { socket, SocketContext } from "./helper/socket";

const Base = ({ history }) => {
  const { token, user } = isAuthenticated();

  const [chatView, setChatView] = useState(false);

  const [section, setSection] = useState("recent");

  const [messages, setMessages] = useState([]);

  const [chatData, setChatData] = useState({
    reciverName: "",
    reciver: "",
    chatId: "",
  });
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState({
    sender: "",
    reciver: "",
    chatId: "",
    message: "",
  });

  const logout = () => {
    if (window.confirm("Are you Sure You want to logout.")) {
      tryLogOut(() => {
        history.push("/");
      });
    }
  };

  const setMessgeInfo = (reciverId, reciverName, chatId) => {
    setChatData({
      ...chatData,
      reciver: reciverId,
      chatId: chatId,
      reciverName: reciverName,
    });
    setMessageData({
      ...messageData,
      reciver: reciverId,
      chatId: chatId,
      sender: user._id,
    });
    setChatView(true);
  };

  const changeMessage = (e) => {
    setMessageData({ ...messageData, message: e.target.value });
  };

  const changeSection = (sectionName) => {
    setSection(sectionName);
  };

  const sendingMessage = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", messageData, (error) => {
      if (error) {
        NotificationManager.error(error, "Error", 10000);
        return;
      }
    });
    setMessageData({ ...messageData, message: "" });
  };

  const getLeftSideView = () => {
    switch (section) {
      case "recent":
        return <ChatHistory setMessgeInfo={setMessgeInfo} />;
      case "contact":
        return <Contacts setMessgeInfo={setMessgeInfo} />;
      case "addContact":
        return <AddContact />;
      default:
        return <ChatHistory setMessgeInfo={setMessgeInfo} />;
    }
  };

  useEffect(() => {
    if (chatData.chatId) {
      setLoading(true);
      getAllMessages(token, chatData.chatId, user._id).then((data) => {
        if (data.error) {
          setLoading(false);
          NotificationManager.error(data.error, "Error", 10000);
        } else {
          setMessages(data);
          setLoading(false);
        }
      });
    }
  }, [chatData]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([message, ...messages]);
    });
  }, [messages]);

  return (
    <SocketContext.Provider value={socket}>
      <div className="flex flex-col justify-center items-center chatPage">
        <div className="headerSection flex justify-center items-center">
          <div className="flex-1 flex justify-center pb-4 items-center text-2xl">
            <i className="fas fa-comment-alt iconMain"></i>
            <h3 className="pl-3 headingMain">WeMessage</h3>
          </div>
          <div className="flex-1 flex justify-center pb-4 items-center">
            <button className="logoutButton shadow-xl" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="chatWrapper rounded">
          <div className="chathistory shadow-xl">
            <SelectSection changeSection={changeSection} section={section} />
            {getLeftSideView()}
          </div>

          <div className="chats">
            {chatView ? (
              <>
                <div className="chatTopBar">
                  <TopBar name={chatData.reciverName} />
                </div>
                <div className="chatMessages">
                  <Messages messages={messages} loading={loading} />
                </div>
                <div className="messageInputSection">
                  <div className="messageInputWrapper">
                    <textarea
                      placeholder="Type Message"
                      className="messageInput"
                      value={messageData.message}
                      onChange={changeMessage}
                    ></textarea>
                  </div>
                  <div className="messageSendButtonWrapper">
                    <button
                      className="messageSendButton shadow-xl"
                      onClick={sendingMessage}
                    >
                      <i className="far fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="noChatSelected">
                <div className="iconAndTitleContainer">
                  <div className="emptyBoxIcon">
                    <i className="fas fa-inbox"></i>
                  </div>
                  <div className="noChatSelectedText">No chat Selected</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <NotificationContainer />
      </div>
    </SocketContext.Provider>
  );
};

export default Base;
