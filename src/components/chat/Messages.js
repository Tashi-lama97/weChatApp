import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";

const Messages = ({ messages, loading }) => {
  const { token, user } = isAuthenticated();

  const [messagesData, setMessagesData] = useState(messages);

  useEffect(() => {
    setMessagesData(messages);
  }, [messages]);

  return (
    <div className="messagesSection">
      {loading ? (
        <div className="chatLoading">
          <i className="fas fa-yin-yang animate-spin"></i>
        </div>
      ) : messagesData.length !== 0 ? (
        messagesData.map((chat, index) => {
          return chat.sender === user._id ? (
            <div className="messageWrapper sender" key={index}>
              <h3 className="message">{chat.message}</h3>
            </div>
          ) : (
            <div className="messageWrapper reciver" key={index}>
              <h3 className="message">{chat.message}</h3>
            </div>
          );
        })
      ) : (
        <div className="messageWrapper">
          <h3 className="noMessages">No messages available</h3>
        </div>
      )}
    </div>
  );
};

export default Messages;
