import axios from "axios";
import { URL } from "../../url";

export const getChatHistory = (token, userId) => {
  return axios
    .get(`${URL}/api/chat/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getContactList = (token, userId) => {
  return axios
    .get(`${URL}/api/get/all/contacts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
export const searchForContact = (token, userId, email) => {
  return axios
    .post(
      `${URL}/api/search/user/${userId}`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const addToContact = (token, userId, contactId) => {
  return axios
    .post(
      `${URL}/api/contact/add/${userId}`,
      { contactId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getAllMessages = (token, chatId, userId) => {
  return axios
    .get(`${URL}/api/chat/all/${chatId}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getChatId = (token, userId, reciver) => {
  return axios
    .get(`${URL}/api/chat/getChatId/${userId}/${reciver}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const readMessage = (token, chatId, userId) => {
  return axios
    .get(`${URL}/api/chat/read/${userId}/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
