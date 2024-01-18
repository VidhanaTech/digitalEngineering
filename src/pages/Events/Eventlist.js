import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toggle/style.css";
import DataTable from "react-data-table-component";
import apiClient from "../../common/http-common";
import { Card } from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import Papa from "papaparse";
import { Link } from "react-router-dom";
import DownloadIcon from "../../assets/img/new-dashboard/download-icon.svg";
import { connect } from "react-redux";
import {
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ddmmyyyyFormat, yyyymmdd } from "../../common/Helper";
import { Alert } from "../../components/Alert";
import Swal from "sweetalert2";

const Eventlist = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [logUserId] = useState(state.user.Id);
  const [HideHomeBreadCumb] = useState(haumbstatus);

  const navigate = useNavigate();
  const [unpublishedArticleList, setUnPublishedArticleList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventList();
  }, []);

  function EventList() {
    apiClient
      .post("kmarticle/eventList")
      .then((res) => {
        setUnPublishedArticleList(res.data);
        setOriginalData(res.data);
        setLoading(false);
      })
      .catch(() => {});
  }
  const cancelevent = (Id) => {
    Swal.fire({
      text: "Do you want to cancel this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#1658a0",
      cancelButtonColor: "#1658a0",
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          id: Id,
          userid: logUserId,
        };
        apiClient
          .post("/kmarticle/cancel_event", data)
          .then((res) => {
            Alert("succ", "Event Cancelled");
            EventList();
          })
          .catch(() => {});
      }
    });
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setUnPublishedArticleList(originalData);
    } else {
      filterData(value);
    }
  };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filteredData = originalData.filter(
      (item) =>
        item.Title.toLowerCase().includes(lowerCaseValue) ||
        item.Location.toLowerCase().includes(lowerCaseValue) ||
        item.Description.toLowerCase().includes(lowerCaseValue)
    );
    setUnPublishedArticleList(filteredData);
  };
  function handleExport(data) {
    const headers = [
      { label: "Event Name", key: "Title" },
      { label: "Start Date", key: "Start_Date" },
      { label: "End Date", key: "End_Date" },
      { label: "Start Time", key: "Start_Time" },
      { label: "End Time", key: "End_Time" },
      { label: "Location", key: "Location" },
    ];

    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key]);
        else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );

    const csvData = Papa.unparse(exportData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Event Details.csv");
  }

  function formatTime(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);

    const formattedTime = time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  }

  const columns = [
    {
      name: "Name",
      selector: (param) => (<span title={param.Title}>{param.Title}</span>),
      sortable: true,
    },
    {
      name: "Start Date",
      sortable: true,
      selector: (param) =>
        param.Start_Date ? ddmmyyyyFormat(param.Start_Date) : "",
    },
    {
      name: "End Date",
      sortable: true,
      selector: (param) =>
        param.End_Date ? ddmmyyyyFormat(param.End_Date) : "",
    },
    {
      name: "Start Time",
      sortable: true,
      selector: (param) => formatTime(param.Start_Time),
    },
    {
      name: "End Time",
      sortable: true,
      selector: (param) => formatTime(param.End_Time),
    },
    {
      name: "Location",
      sortable: true,
      selector: (param) => (
        <span title={param.Location}>
          {param.Location.length > 25 ? param.Location.substring(0, 25) + "..." : param.Location}
        </span>
      ),
    },    
    {
      name: "Status",
      sortable: true,
      selector : (param) =>  {
        const dateFor = new Date();
        const currentDate =
          dateFor.getFullYear() +
          "-" +
          (dateFor.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          dateFor.getDate().toString().padStart(2, "0");
        const startDate = yyyymmdd(param.Start_Date);
        const endDate = yyyymmdd(param.End_Date);
        const startTime = param.Start_Time;
        const endTime = param.End_Time;
        const hours = dateFor.getHours().toString().padStart(2, "0");
        const minutes = dateFor.getMinutes().toString().padStart(2, "0");
        const seconds = dateFor.getSeconds().toString().padStart(2, "0");
        const currentTime = hours + ":" + minutes + ":" + seconds;
        if (param.Status === 2) {
          return (
            4
          );
        } else if (currentDate >= endDate && currentTime > endTime) {
          return (
            3
          );
        } else if ((currentDate >= startDate && currentTime >= startTime) && (currentDate <= endDate && startTime <= endTime)) {
          return (
           2
          );
        } else {
          return (
            1
          );
        }
      },
      format: (param) => {
        const dateFor = new Date();
        const currentDate =
          dateFor.getFullYear() +
          "-" +
          (dateFor.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          dateFor.getDate().toString().padStart(2, "0");
        const startDate = yyyymmdd(param.Start_Date);
        const endDate = yyyymmdd(param.End_Date);
        const startTime = param.Start_Time;
        const endTime = param.End_Time;
        const hours = dateFor.getHours().toString().padStart(2, "0");
        const minutes = dateFor.getMinutes().toString().padStart(2, "0");
        const seconds = dateFor.getSeconds().toString().padStart(2, "0");
        const currentTime = hours + ":" + minutes + ":" + seconds;
        if (param.Status === 2) {
          return (
            <p className="maincontent__table--status maincontent__table--status-notupdated">
              Cancel
            </p>
          );
        } else if (currentDate >= endDate && currentTime > endTime) {
          return (
            <p className="maincontent__table--status maincontent__table--status-updated">
              Completed
            </p>
          );
        } else if ((currentDate >= startDate && currentTime >= startTime) && (currentDate <= endDate && startTime <= endTime)) {
          return (
            <p className="maincontent__table--status bg-info scheduled">
              Ongoing
            </p>
          );
        } else {
          return (
            <p className="maincontent__table--status bg-warning">Scheduled</p>
          );
        }
      },
    },
        {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", cursor: "pointer" }}
            title="View Event"
            icon={faEye}
            onClick={() => {
              navigate(Routes.ViewEventRegister, {
                state: {
                  user: param,
                  page: Routes.EventList,
                  fromFirstPage: true,
                },
              });
            }}
          />{" "}
          {param.Status !== 2 ? (
            <>
              <FontAwesomeIcon
                style={{ color: "#1658a0", cursor: "pointer" }}
                title="Edit Event"
                icon={faEdit}
                onClick={() => {
                  navigate(Routes.EditEvent, {
                    state: { user: param, page: "edit-event" },
                  });
                }}
              />{" "}
              <FontAwesomeIcon
                style={{ color: "#1658a0", cursor: "pointer" }}
                title="Cancel Event"
                icon={faTrash}
                onClick={() => cancelevent(param.Id)}
              />
            </>
          ) : null}
        </>
      ),
      width: "100px",
    },
  ];

  return (
    <div className="fsMain">
      <div className="flex justify-between my-2">
        {HideHomeBreadCumb && (
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
            <span>Events</span>
          </div>
        )}

        <div className="flex justify-end gap-2 items-center">
          <button
            type="button"
            onClick={() => navigate(Routes.AddEvent)}
            className="maincontent__btn maincontent__btn--primaryblue"
          >
            Add Event{" "}
          </button>
          <div className="relative search-containerKMArti kmarticle-seactform">
            <input
              type="search"
              placeholder="Search by Event Name"
              className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[34px]"
              value={searchValue}
              onChange={handleSearch}
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
              onClick={() => handleExport(unpublishedArticleList)}
              className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
              ></img>
          </Link>
        </div>
      </div>

      <div className="maincontent__card--body">
        
        <div className="maincontent__card--content">
          <Card.Body align="center">
            {loading ? (
              <div class="circle__loader"></div>
            ) : (
              <DataTable
                columns={columns}
                data={unpublishedArticleList}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="EventTable"
              />
            )}
          </Card.Body>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(Eventlist);
