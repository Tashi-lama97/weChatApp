import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/helper/apicalls";
import SimpleBar from "simplebar-react";
import USERPIC from "./images/account.png";
import { searchForContact, addToContact, getChatId } from "./helper/apicalls";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const AddContact = ({ changeSection, section }) => {
  const { token, user } = isAuthenticated();
  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [indicators, setIndicators] = useState({
    success: "",
    loading: "",
    error: "",
  });
  const { loading, success, error } = indicators;

  const [newIndicators, setNewIndicators] = useState({
    nloading: "",
    nsuccess: "",
    nerror: "",
  });

  const { nloading, nerror, nsuccess } = newIndicators;

  useEffect(() => {
    if (searchVal.trim() !== "") {
      setIndicators({ ...indicators, loading: true, success: "", error: "" });
      searchForContact(token, user._id, searchVal).then((data) => {
        if (data.error) {
          setIndicators({
            ...indicators,
            loading: false,
            success: false,
            error: data.error,
          });
        } else {
          setIndicators({
            ...indicators,
            loading: false,
            success: true,
            error: "",
          });
          setSearchResult(data);
        }
      });
    }
  }, [searchVal]);

  const addContactToList = (contactId) => {
    if (!nsuccess) {
      setNewIndicators({
        ...newIndicators,
        nloading: true,
        nsuccess: "",
        nerror: "",
      });
      addToContact(token, user._id, contactId).then((data) => {
        if (data.error) {
          setNewIndicators({
            ...newIndicators,
            nloading: false,
            nsuccess: false,
            nerror: data.error,
          });
          NotificationManager.error(data.error, "Error", 5000);
        } else {
          setNewIndicators({
            ...newIndicators,
            nloading: false,
            nsuccess: true,
            nerror: "",
          });
          NotificationManager.success("User Successfuly Added", "Alert", 5000);
        }
      });
    }
  };

  return (
    <>
      <div className="title flex bg-gray-100 flex-col">
        <h3 className="titleText">Add</h3>
        <h3 className="titleText">Contact</h3>
      </div>
      <div className="searchBar">
        <input
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          type="text"
          placeholder="Search"
          className="searchBarInput"
          value={searchVal}
        />
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
          ) : Object.keys(searchResult).length !== 0 ? (
            <div className="chatHistoryMessageWrapper">
              <div className="userIcon">
                <img src={USERPIC} alt="demoPic" className="userPic" />
              </div>
              <div className="userData">
                <h3 className="chatName">{searchResult.user_name}</h3>
              </div>
              <div
                className="addIcon"
                onClick={() => {
                  addContactToList(searchResult.user_id);
                }}
              >
                {nloading ? (
                  <i className="fas fa-yin-yang animate-spin"></i>
                ) : nsuccess ? (
                  <i className="fas fa-check-circle"></i>
                ) : (
                  <i className="fas fa-plus"></i>
                )}
              </div>
            </div>
          ) : searchVal.trim() === "" ? (
            ""
          ) : (
            <div className="chatHistoryMessageWrapper">
              <h3>No user found with given email</h3>
            </div>
          )}
        </SimpleBar>
      </div>
      <NotificationContainer />
    </>
  );
};

export default React.memo(AddContact);
