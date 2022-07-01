import axios from "axios";
import { URL } from "../../url";

//Sign Up
export const trySignUp = (user) => {
  return axios
    .post(`${URL}/api/signup`, user)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

//Login
export const tryLogIn = (user) => {
  return axios
    .post(`${URL}/api/login`, user)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

//Setting up jwt in localstorage
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

//To authenticate user
export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

//logout
export const tryLogOut = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    return axios
      .get("/api/logout")
      .then((response) => console.log("signout success"))
      .catch((err) => console.log(err));
  }
};
