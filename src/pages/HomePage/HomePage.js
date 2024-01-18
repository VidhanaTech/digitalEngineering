import React, { useState } from "react";
import "./HomePage.css";
import Sidebar from "../../components/Sidebar";
import ViewClient from "../Client/ViewClient/ViewClient";
import DashboardOverview from "../dashboard/DashboardOverview";

const HomePage = () => {
  const [bodyComponent, setBodyComponent] = useState("viewClient");
  return (
    <div className="homediv">
      <div className="left">
        {/* <SideBar setBodyComponent={setBodyComponent} /> */}
        {/* <Sidebar setBodyComponent={setBodyComponent} /> */}
      </div>

      <div className="right">
        {bodyComponent === "dashboard" ? <DashboardOverview /> : <ViewClient />}
        {/* {bodyComponent === "viewClient" && <ViewClient />} */}
      </div>
    </div>
  );
};

export default HomePage;
