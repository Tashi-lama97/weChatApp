import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";
import { getChatId, getContactList } from "./helper/apicalls";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { v4 as uuidv4 } from "uuid";

const Contacts = ({ changeSection, section, setMessgeInfo }) => {
  const { token, user } = isAuthenticated();
  const [contacts, setContacts] = useState([]);
  const [contactId, setContactId] = useState("");
  const [indicators, setIndicators] = useState({
    success: "",
    loading: "",
    error: "",
  });

  const { loading, success, error } = indicators;

  const onClickHandler = (contact) => {
    getChatId(token, user._id, contact.contactDetails[0]._id).then((data) => {
      if (data) {
        if (data.error) {
          console.log(error);
        } else if (data) {
          setMessgeInfo(
            contact.contactDetails[0]._id,
            contact.contactDetails[0].name,
            data.chatId
          );
        }
      } else {
        const Id = uuidv4();
        setMessgeInfo(
          contact.contactDetails[0]._id,
          contact.contactDetails[0].name,
          Id
        );
      }
    });
  };

  useEffect(() => {
    setIndicators({ ...indicators, loading: true, success: "", error: "" });
    getContactList(token, user._id).then((data) => {
      if (data.error) {
        setIndicators({
          ...indicators,
          loading: false,
          success: "",
          error: data.error,
        });
        NotificationManager.error(data.error, "Error", 10000);
      } else {
        setIndicators({
          ...indicators,
          loading: false,
          success: true,
          error: "",
        });
        setContacts(data);
      }
    });
  }, []);

  return (
    <>
      <div className="title flex bg-gray-100 flex-col">
        <h3 className="titleText contactTitle">Contacts</h3>
      </div>
      <div className="chatHistoryWrapper ">
        <SimpleBar style={{ maxHeight: 420 }}>
          {loading ? (
            <div className="chatHistoryMessageWrapper animate-pulse">
              <div className="userIcon">
                <div className="rounded-full bg-blue-400 h-12 w-12"></div>
              </div>
              <div className="userData space-y-2">
                <div className="h-4 bg-blue-400 rounded"></div>
                <div className="h-4 bg-blue-400 rounded w-5/6"></div>
              </div>
            </div>
          ) : contacts.length !== 0 && typeof contacts == "object" ? (
            contacts.map((contact, index) => {
              return (
                <div
                  onClick={() => {
                    if (contact.contactDetails[0]._id !== contactId) {
                      setContactId(contact.contactDetails[0]._id);
                      onClickHandler(contact);
                    }
                  }}
                  className="chatHistoryMessageWrapper"
                  key={contact.contactDetails[0]._id}
                >
                  <div className="userIcon">
                    <img src={USERPIC} alt="demoPic" className="userPic" />
                  </div>
                  <div className="userData">
                    <h3 className="chatName">
                      {contact.contactDetails[0].name}
                    </h3>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="chatHistoryMessageWrapper">
              <h3>No Contacts</h3>
            </div>
          )}
        </SimpleBar>
      </div>
      <NotificationContainer />
    </>
  );
};

export default React.memo(Contacts);
