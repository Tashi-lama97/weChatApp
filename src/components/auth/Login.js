import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { authenticate, isAuthenticated, tryLogIn } from "./helper/apicalls";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;

  const [indicators, setIndicators] = useState({
    success: "",
    loading: "",
    error: "",
  });
  const { loading, error, success } = indicators;

  const changeHandler = (field) => (e) => {
    e.preventDefault();
    setUser({ ...user, [field]: e.target.value });
  };

  const performRedirect = () => {
    if (success) {
      return <Redirect to="/user/chat" />;
    }
    if (isAuthenticated()) {
      return <Redirect to="/user/chat" />;
    }
  };

  const submitData = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      NotificationManager.warning(
        "Please fill all the fields",
        "Blank Fields",
        10000,
        () => {},
        true
      );
    } else {
      setIndicators({ ...indicators, loading: true, success: "", error: "" });
      tryLogIn(user).then((data) => {
        console.log(data);
        if (data.error) {
          setIndicators({ ...indicators, loading: false, error: data.error });
          if (typeof data.error === "object") {
            data.error.errors.map((err) => {
              NotificationManager.error(err.msg, "Error", 10000);
            });
          } else {
            NotificationManager.error(data.error, "Error", 10000);
          }
        } else {
          authenticate(data, () => {
            setIndicators({ ...indicators, success: true });
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 formContainer formHeight ">
      {performRedirect()}
      <div className="flex  justify-center items-center">
        <h4 className=" font-bold text-3xl py-5 px-3 sectionHeading ">Login</h4>
      </div>
      <form className="  flex flex-col justify-center items-center mt-7 ">
        <input
          type="text"
          className="mb-3 border-0 h-10 rounded  px-3  font-roboto text-md outline-none inputBackground "
          placeholder="Email"
          value={email}
          onChange={changeHandler("email")}
        />
        <input
          type="password"
          className=" mb-3 border-0 h-10 rounded  px-3  font-roboto text-md outline-none inputBackground "
          placeholder="Password"
          value={password}
          onChange={changeHandler("password")}
        />
        <button
          className="py-2 px-5 bg-blue-500 text-white font-bold rounded"
          onClick={submitData}
        >
          Login
        </button>
      </form>
      <NotificationContainer />
    </div>
  );
};

export default Login;
