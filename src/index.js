import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Router from "./Router";
import "./index.css";
import "react-notifications/lib/notifications.css";
import "simplebar/dist/simplebar.min.css";
import "./custom.css";

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
