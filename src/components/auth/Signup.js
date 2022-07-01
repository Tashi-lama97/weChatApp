import React, { useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { trySignUp } from "./helper/apicalls";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;

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
  const submitform = (e) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      NotificationManager.warning(
        "Please fill all the fields",
        "Blank Fields",
        10000,
        () => {},
        true
      );
    } else {
      setIndicators({ ...indicators, loading: true, success: "", error: "" });
      trySignUp(user).then((data) => {
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
          console.log(data);
          setIndicators({
            ...indicators,
            loading: false,
            error: "",
            success: true,
          });
          setUser({ ...user, name: "", email: "", password: "" });
          NotificationManager.success(
            "Please login with your email id and password",
            "Successfully Registered"
          );
        }
      });
    }
  };
  return (
    <div className="flex flex-col flex-1  formContainer formHeight ">
      <div className="flex  justify-center items-center">
        <h4 className=" font-bold text-3xl py-5 px-3 sectionHeading">
          Sign-up
        </h4>
      </div>
      <form className=" flex flex-col justify-center items-center  ">
        <input
          type="text"
          className="inputBackground mb-3 border-0 h-10 rounded  px-3  font-roboto text-md outline-none "
          placeholder="Name"
          value={name}
          onChange={changeHandler("name")}
        />
        <input
          type="text"
          className=" inputBackground mb-3 border-0 h-10 rounded  px-3  font-roboto text-md outline-none "
          placeholder="Email"
          value={email}
          onChange={changeHandler("email")}
        />
        <input
          type="password"
          className="inputBackground mb-3 border-0 h-10 rounded  px-3  font-roboto text-md outline-none "
          placeholder="Password"
          value={password}
          onChange={changeHandler("password")}
        />
        <button
          onClick={submitform}
          className="py-2 px-5 bg-blue-500  text-white font-bold rounded"
        >
          {loading ? "Please Wait" : "Register"}
        </button>
      </form>
      <NotificationContainer />
    </div>
  );
};

export default Signup;
