import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/helper/ProtectedRoutes";
import Base from "./components/chat/Base";
import Main from "./components/entryPage/Main";
import { socket, SocketContext } from "./components/chat/helper/socket";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <ProtectedRoute path="/user/chat" component={Base} />
        <Base />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
