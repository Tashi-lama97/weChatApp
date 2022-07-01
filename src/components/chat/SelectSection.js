import React from "react";

const SelectSection = ({ changeSection, section }) => {
  return (
    <div className="flex justify-center item-center sectionSelectorWrapper">
      <div
        onClick={() => changeSection("recent")}
        className={
          section === "recent"
            ? "flex-1 flex justify-center item-center  sectionTabs active"
            : "flex-1 flex justify-center item-center  sectionTabs"
        }
      >
        Recent
      </div>
      <div
        onClick={() => changeSection("contact")}
        className={
          section === "contact"
            ? "flex-1 flex justify-center item-center  sectionTabs active"
            : "flex-1 flex justify-center item-center  sectionTabs"
        }
      >
        Contacts
      </div>
      <div
        onClick={() => changeSection("addContact")}
        className={
          section === "addContact"
            ? "flex-1 flex justify-center item-center  sectionTabs active"
            : "flex-1 flex justify-center item-center  sectionTabs"
        }
      >
        Add Contact
      </div>
    </div>
  );
};

export default React.memo(SelectSection);
