import React from "react";
import { Image } from "@themesberg/react-bootstrap";

import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import portray360 from "../assets/img/new-dashboard/5Elements-logo.png";

export default (props) => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={portray360}
        height={40}
      />
    </div>
  );
};
