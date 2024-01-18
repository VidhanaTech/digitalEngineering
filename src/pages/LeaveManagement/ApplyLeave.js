import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Accordion,
  Table,
  Form,
} from "@themesberg/react-bootstrap";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import StartDateIcon from "../../assets/img/icons/project-management/icon-start-date.svg";
import EndDateIcon from "../../assets/img/icons/project-management/icon-end-date.svg";
import FileImgIcon from "../../components/FileImgIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faFileEdit,
  faDesktopAlt,
  faLayerGroup,
  faCalendarAlt,
  faCalendarDays,
  faFlag,
  faPlus,
  faMinus,
  faTeletype,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import apiClient from "../../common/http-common";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Routes } from "../../routes";
import { ddmmyyyyFormat, yyyymmdd } from "../../common/Helper";
const ApplyLeave = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function getStartDateOfWeek(weekNumber, pyear) {
    if (weekNumber) {
      const startDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7);
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }

  function getStartDateOf(weekNumber, pyear) {
    if (weekNumber) {
      const startDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7);
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      return `${year}-${month}-${day}`;
    }
  }

  function changeStartDateFormat(pdate) {
    let dates = new Date(pdate);
    let date = dates.toLocaleString("default", { day: "2-digit" });
    const month = dates.toLocaleString("default", { month: "2-digit" });
    const year = dates.getFullYear();
    const formattedDate = `${year}-${month}-${date}`;
    if (formattedDate !== "Invalid Date" && formattedDate !== "1970-01-01")
      return formattedDate;
    else return true;
  }

  return (
    <div>
      <div className="maincontent__breadcrumb">
        <img
          className="cursor_pointer"
          src={HomeOutlineIcon}
          alt="home"
          onClick={() => {
            navigate(Routes.DashboardOverview);
          }}
        />
        <span className="maincontent__breadcrumb--divider">/</span>
        <span
          className="cursor_pointer"
          onClick={() => {
            navigate(Routes.KMDashboard);
          }}
        >
          Leave Management{" "}
        </span>
        <span className="maincontent__breadcrumb--active"> / Apply Leave</span>
      </div>

      <div className="mt-4 maincontent__card--header">
        <h2
          className="maincontent__card--header-title"
          style={{ display: "inline-block" }}
        >
          APPLY LEAVE
        </h2>
      </div>
      <div className="maincontent__card--content">
        <Form>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Form.Group>
              <Form.Label>Leave Type</Form.Label>
              <div className="input-group">
              {/* <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={ClientNameIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div> */}
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCalendarAlt} />
                  </span>
                </div>
              <Select
                options={[
                  { value: "1", label: "Personal Leave" },
                  { value: "2", label: "Vacation Leave" },
                  { value: "3", label: "Sick Leave" },
                ]}
                placeholder=""
                //   onChange={(e) => setSelectVal({ ...selectVal, clientId: e })}
                //   onFocus={() => handleInputFocus("clientId")}
              />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>From *</Form.Label>
        
              <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={StartDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>

                <Form.Control
                className="leaveFormFields"
                  type="date"
                  style={{ fontSize: "16px", color: "black",borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px", }}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>To *</Form.Label>
              <div className="input-group">
              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <img
                      src={EndDateIcon}
                      alt="client name"
                      className="input-icon"
                    />
                  </span>
                </div>

                <Form.Control
                 className="leaveFormFields"
                  type="date"
                  style={{ fontSize: "16px", color: "black",borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px"}}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Number of Days</Form.Label>
              <div className="input-group">

              <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                  <FontAwesomeIcon  className="input-icon" icon={faCalendarDays} />
                  </span>
                </div>

                <Form.Control
                 className="leaveFormFields"
                  type="number"
                  style={{ fontSize: "16px", color: "black",borderTopLeftRadius:"0px", borderBottomLeftRadius:"0px" }}
                  required
                  placeholder="0"
                />
              </div>
            </Form.Group>
          </div>

          <Form.Group className=" leaveCmt">
            <Form.Label>Reason/Additional Comments</Form.Label>
            <div>
              <textarea rows="3" className="leaveCmtTextArea" type="text" placeholder="Leave Comments">
              </textarea>
            </div>
          </Form.Group>

        </Form>

        <div className="flex justify-center gap-4 mt-8 lg:justify-end">
          <button className="maincontent__btn maincontent__btn--primaryblue">
            Submit
          </button>
          <button
                  onClick={() => {
                    navigate(Routes.KMDashboard);
                  }}
                  className="maincontent__btn maincontent__btn--primaryblue space_btn"
                >
                  Back
                </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
