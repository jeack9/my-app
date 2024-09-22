import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light col-2">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/account" className="nav-link" activeclassname="active">
            계정관리
          </NavLink>
        </li>
        <li>
          <NavLink to="/notices" className="nav-link" activeclassname="active">
            공지사항
          </NavLink>
        </li>
        <li>
          <NavLink to="/qna" className="nav-link" activeclassname="active">
            QnA
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
