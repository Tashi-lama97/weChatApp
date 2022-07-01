import React from "react";
import Login from "../auth/Login";
import Signup from "../auth/Signup";

const Main = () => {
  return (
    <div className=" justify-center  items-center  flex  flex-col mainHeight ">
      <div className="flex justify-center items-center  heading text-5xl">
        <i className="fas fa-comment-alt iconMain"></i>
        <h3 className="pl-3 headingMain">WeMessage</h3>
      </div>
      <div className="flex  mainContent">
        <div className="flex-1 flex wrapper borderRight">
          <Login />
        </div>
        <div className="flex-1 flex wrapper  borderLeft">
          <Signup />
        </div>
      </div>
    </div>
  );
};

export default Main;
