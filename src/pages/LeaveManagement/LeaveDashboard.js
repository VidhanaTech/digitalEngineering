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
import excelicon from "../../assets/img/brand/excelicon.svg";
import { Link } from "react-router-dom";
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
const LeaveDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const columns = [
    {
      name: "Employee ID",
    //   selector: (param) => param.team,
      sortable: true,
    //   filter: (
    //     <input
    //       type="text"
    //       placeholder="Search"
    //       value={searchValue}
    //       onChange={handleSearch}
    //     />
    //   ),
    },
    {
      name: "Employee Name",
    //   selector: (param) => param.ProjectName,
      sortable: true,
    },
    {
      name: "Leave Type",
    //   selector: (param) => param.ClientName,
      sortable: "true",
    },
    {
      name: "Leave From",
    //   selector: (param) => param.totalpublished,
      sortable: "true",
    },
    {
      name: "Leave To",
    //   selector: (param) => param.current_submitted,
      sortable: "true",
    },
    {
      name: "Applied Date",
    //   selector: (param) => param.current_published,
      sortable: "true",
    },
    {
        name: "Leave Details",
      //   selector: (param) => param.current_published,
        sortable: "true",
      },
      {
        name: "Approve",
      //   selector: (param) => param.current_published,
        sortable: "true",
      },
      {
        name: "Reject",
      //   selector: (param) => param.current_published,
        sortable: "true",
      },
  ];

  const [selectedOption, setSelectedOption] = useState("1");
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setIsCustomSelected(selectedOption === "4");
  };

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
        <span className="maincontent__breadcrumb--active">
          {" "}
          / Leave Dashboard
        </span>
      </div>

      <div className="w-full lg:col-span-2 md:col-span-3 maincontent__card maincontent__card--kmDashboard-contribution newContri">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">
            LEAVE DASHBOARD
            </h2>
          </div>

          <div className="w-full maincontent__card--content">
            <div className="maincontent__card--tableheader">
              <div className="maincontent__card--tableheader-right">
                <div className="search-containerKMArti kmarticle-seactform">
                  <input
                    type="search"
                    placeholder="Search by Employee Name, ID, Leave Type"
                    className="searchArtiInput w-full"
                    // value={searchValue}
                    // onChange={handleSearch}
                  />
                </div>
                <Link className="flexVerandHorCenter">
                  <img
                    src={excelicon}
                    style={{ width: "35px" }}
                    // onClick={() => handleExport(filteredData)}
                    className="maincontent__faIcon maincontent__faIcon--redcolor"
                  ></img>
                </Link>
              </div>
            </div>
            <div align="center">
              {/* {isLoading ? (
                <div class="circle__loader"></div>
              ) : ( */}
                <DataTable
                  title=""
                  columns={columns}
                //   data={filteredData}
                  pagination
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  paginationPerPage={5}
                  highlightOnHover
                  className="mt-4 kmdash_cont_table"
                  defaultSortField="team" // Set the default sorting by "ProjectName" column
                  defaultSortAsc={true}
                />
              {/* )} */}
            </div>
          </div>
        </div>

      <div>
        <div className="mt-4 maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ display: "inline-block" }}
          >
            LEAVE ROOSTER
          </h2>
        </div>
        <div className="maincontent__card--content">
          <Form>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Form.Group>
                <Form.Label>Leave Status</Form.Label>
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
                      <FontAwesomeIcon
                        className="input-icon"
                        icon={faCalendarAlt}
                      />
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
                <Form.Label>Date Range</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon
                        className="input-icon"
                        icon={faCalendarAlt}
                      />
                    </span>
                  </div>
                  <Select
                    options={[
                      { value: "1", label: "This Week" },
                      { value: "2", label: "This Month" },
                      { value: "3", label: "Next Month" },
                      { value: "4", label: "Custom" },
                    ]}
                    onChange={(e) => handleSelectChange(e.value)}
                    placeholder="This Week"
                    //   onChange={(e) => setSelectVal({ ...selectVal, clientId: e })}
                    //   onFocus={() => handleInputFocus("clientId")}
                  />
                </div>
              </Form.Group>

              {isCustomSelected && (
                <>

                <Form.Group>
              <Form.Label>From Date</Form.Label>
        
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
              <Form.Label>To Date</Form.Label>
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

                </>
              )}

            </div>
     
          </Form>

          <div className="flex justify-center gap-4 mt-8 lg:justify-end">
            <button className="maincontent__btn maincontent__btn--primaryblue">
              Refresh
            </button>
            {/* <button
              onClick={() => {
                navigate(Routes.KMDashboard);
              }}
              className="maincontent__btn maincontent__btn--primaryblue space_btn"
            >
              Back
            </button> */}
          </div>
        </div>
      </div>


      <div className="w-full maincontent__card--content mt-4">
            <div className="maincontent__card--tableheader">
              <div className="maincontent__card--tableheader-right">
                <div className="search-containerKMArti kmarticle-seactform">
                  <input
                    type="search"
                    placeholder="Search by Employee Name, ID, Leave Type"
                    className="searchArtiInput w-full"
                    // value={searchValue}
                    // onChange={handleSearch}
                  />
                </div>
                <Link className="flexVerandHorCenter">
                  <img
                    src={excelicon}
                    style={{ width: "35px" }}
                    // onClick={() => handleExport(filteredData)}
                    className="maincontent__faIcon maincontent__faIcon--redcolor"
                  ></img>
                </Link>
              </div>
            </div>
            <div align="center">
            <p className="text-left">Approved Leave Requests For This Month: 0 Requests</p>
              {/* {isLoading ? (
                <div class="circle__loader"></div>
              ) : ( */}
                <DataTable
                  title=""
                  columns={columns}
                //   data={filteredData}
                  pagination
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  paginationPerPage={5}
                  highlightOnHover
                  className="mt-4 kmdash_cont_table"
                  defaultSortField="team" // Set the default sorting by "ProjectName" column
                  defaultSortAsc={true}
                />
              {/* )} */}
            </div>
          </div>


    </div>
  );
};

export default LeaveDashboard;
