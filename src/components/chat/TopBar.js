import React from "react";
import USERPIC from "./images/account.png";

const TopBar = ({ name }) => {
  return (
    <div className="topBarSection shadow-lg">
      <div className="topbarImageWrapper">
        <img src={USERPIC} alt="demoPic" className="topBarImage" />
      </div>
      <div className="tapBarName">{name}</div>
    </div>
  );
};

export default React.memo(TopBar);
