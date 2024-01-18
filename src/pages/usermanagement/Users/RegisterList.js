import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import DataTable from "react-data-table-component";
import apiClient from "../../../common/http-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import DownloadIcon from "../../../assets/img/new-dashboard/download-icon.svg";
import "react-toggle/style.css";
import { Alert } from "../../../components/Alert";

import { Routes } from "../../../routes";
import Papa from "papaparse";
import { Link } from "react-router-dom";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { connect } from "react-redux";

const RegisterList = (state) => {
  const [UserTabData, setUserTabData] = useState([]);
  const [newUser, setNewUser] = useState([]);
  const [isdisabled, setdisabled] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  function capitalizeFirstLetter(FirstName) {
    if (!FirstName) return "";
    return FirstName.charAt(0).toUpperCase() + FirstName.slice(1);
  }

  const navigate = useNavigate();

  const column = [
    {
      name: " User ID",
      selector: (param) => param.Id,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (param) => capitalizeFirstLetter(param.FirstName),
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (param) => param.LastName,
      sortable: true,
    },
    {
      name: "Email Address",
      selector:(param) => (<span title={param.EmailId}>{param.EmailId}</span>),
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (param) => param.PhoneNo,
      sortable: true,
    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", cursor: "pointer" }}
            icon={faPenToSquare}
            title="approve user"
            onClick={() => {
              navigate(Routes.ApproveUser, { state: { user: param } });
            }}
          />
        </>
      ),
      width: "100px",
    },
  ];
  const [loading, setLoading] = useState(true);

  const getAllUsers = () => {
    setdisabled(true);
    apiClient
      .get("/user/register/list")
      .then((res) => {
        if (Array.isArray(res.data) || Array.isArray(res.data.user)) {
          const arr = [];
          const users = Array.isArray(res.data) ? res.data : res.data.user;
  
          users.forEach((usr) => {
            let obj = {
              FirstName: usr.FirstName,
              LastName: usr.LastName,
              Id: usr.Id,
              EmailId: usr.EmailId,
              PhoneNo: usr.PhoneNo,
              Password: usr.Password,
              IsApproved: usr.IsApproved === "0" ? "Not Approved" : "Approved",
              IsLocked: usr.IsLocked === "0" ? "InActive" : "Active",
              IsActive: usr.IsActive === "1" ? "Active" : "Inactive",
            };
            arr.push(obj);
          });
  
          setUserTabData(arr);
          setNewUser(arr);
          setdisabled(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  };
  
  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);

    if (searchValue === "") {
      setUserTabData(newUser);
    } else {
      const filterData = UserTabData.filter((item) => {
        return (
          item.FirstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.LastName.toLowerCase().includes(searchValue.toLowerCase())
        );
      });

      setUserTabData(filterData);
    }
  };

  function handleExport(data) {
    const headers = [
      { label: "User ID", key: "Id" },
      { label: "First Name", key: "FirstName" },
      { label: "Last Name", key: "LastName" },
      { label: "Email Address", key: "EmailId" },
      { label: "Phone Number", key: "PhoneNo" },
    ];

    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        const value = row[header.key] || "Nil";
        if (value === "start_date" || value === "end_date")
          acc[header.label] = changeStartDateFormat(value);
        else acc[header.label] = value;
        return acc;
      }, {})
    );

    const csvData = Papa.unparse(exportData);

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Register list Details.csv");
  }

  return (
    <div className="fsMain">
      <div className="flex justify-between">
        <div className="maincontent__breadcrumb">
          <img
            className="cursor_pointer"
            src={HomeOutlineIcon}
            alt="home"
            onClick={() => {
              navigate(state.defaultpage);
            }}
          />
          <span className="maincontent__breadcrumb--divider">/</span>
          <span>User Management</span>
          <span className="maincontent__breadcrumb--divider">/</span>
          <span className="maincontent__breadcrumb--active">Registered List</span>
        </div>
      </div>
      <div className="maincontent__card--body">
        <div className="maincontent__card--header ">
          <h2 className="maincontent__card--header-title text-black">Registered Users</h2>
        </div>
        <div
          className="maincontent__card--content "
          style={{ padding: "1rem 2rem 0 2rem" }}
        >
          <div className="secDiv">
            <div
              className="maincontent__card--tableheader-right"
              style={{ margin: "10px 0px 10px 0px" }}
            >
              <div className="relative search-containerKMArti kmarticle-seactform">
            <input
              type="search"
              placeholder="Search by firstname, lastname"
              className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[34px]"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              />
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-[rgba(0,0,0,60%)] rounded-[28px] h-[26px] text-white text-[10px] font-bold"
                  >
                    Search
                  </button>
          </div>
              <Link className="flexVerandHorCenter">
                <img
                  src={DownloadIcon}
                  onClick={() => handleExport(UserTabData)}
                  className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
                ></img>
              </Link>
            </div>
          </div>

          <div  className="maincontent__card--content  rdt_Pagination">
            {loading ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <DataTable
                columns={column}
                data={UserTabData}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="mt-4rt"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(RegisterList);
