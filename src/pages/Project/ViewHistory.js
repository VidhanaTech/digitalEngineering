import React, { useState, useEffect } from "react";
import "./AddProject.css";
import {
  Col,
  Row,
  Card,
  Button,
  Accordion,
} from "@themesberg/react-bootstrap";
import axios from "../../common/http-common";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { faPen} from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { connect } from "react-redux";

const ViewHistory = (state) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentWeekData, setcurrentWeekData] = useState([]);
  const [currentWeekPara, setcurrentWeekPara] = useState({
    currentWeek: "",
    currentMonth: "",
    currentYear: "",
  });
  const [lastWeekData, setlastWeekData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [projectName, setProjectName] = useState("");
  function changeDateFormat(pdate) {
    const date = new Date(pdate);
    const formattedDate = date.toLocaleDateString();
    if (formattedDate !== "Invalid Date" && formattedDate !== "1/1/1970")
      return formattedDate;
    else return true;
  }

  function getStartDateOfWeek(weekNumber, pyear) {
    if (weekNumber) {
      const startDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7);
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
  const columns = [
    {
      name: "Head Count",
      selector: (param) => param.HeadCount,
      sortable: true,
    },
    {
      name: "WSR EFFECTIVE DATE",
      selector: (param) => changeDateFormat(param.Date),
      sortable: true,
    },
    {
      name: "START DATE",
      selector: (param) => getStartDateOfWeek(param.Week, param.Year),
      sortable: true,
    },
    {
      name: "END DATE",
      selector: (param) => getEndDateOfWeek(param.Week, param.Year),
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (param) => (
        <>
          {param.RagStatusId == 1 ? (
            <div className="dashboard-bar cancel_bar"></div>
          ) : param.RagStatusId == 2 ? (
            <div className="dashboard-bar active_bar"></div>
          ) : (
            <div className="dashboard-bar complete_bar"></div>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "UPDATE DATE",
      selector: (param) => changeDateFormat(param.ModifiedAt),
      sortable: true,
    },
    {
      name: "UPDATED BY",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true,
    },
    {
      name: "Edit",
      selector: (param) => (
        <a
          title="Edit Project Status"
          style={{ padding: "3%" }}
          onClick={() => {
            navigate(Routes.EditProjectStatus, {
              state: {
                project: param,
                week: {
                  currentWeek: param.Week,
                  currentMonth: param.Month,
                  currentYear: param.Year,
                },
              },
            });
          }}
        >
          <FontAwesomeIcon icon={faPen} size="lg" color="#1475DF" />
        </a>
      ),
    },
  ];
  function getEndDateOfWeek(weekNumber, pyear) {
    if (weekNumber) {
      const endDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7 + 6);
      const month = String(endDate.getMonth() + 1).padStart(2, "0");
      const day = String(endDate.getDate()).padStart(2, "0");
      const year = endDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }

  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (currentDate - firstDayOfYear) / (24 * 60 * 60 * 1000);
    const currentWeek = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    let lastWeek,
      lastWeekyear = "";
    currentWeekPara.currentWeek = currentWeek;
    currentWeekPara.currentMonth = currentDate.getMonth();
    currentWeekPara.currentYear = currentDate.getFullYear();
    setcurrentWeekPara(currentWeekPara);
    if (currentWeek == 1) {
      lastWeek = 52;
      lastWeekyear = currentDate.getFullYear() - 1;
    } else {
      lastWeek = currentWeek - 1;
      lastWeekyear = currentDate.getFullYear();
    }
    //Current Week Status
    let cparam = {
      id: location?.state?.project?.id,
      userId: null,
      Week: currentWeek,
      Year: currentDate.getFullYear(),
    };
    axios
      .post("/project/projectweekHistory", cparam)
      .then((res) => {
        setcurrentWeekData(res.data.project);
      })
      .catch((err) => {
      });

    //Last Week Status
    let lparam = {
      id: location?.state?.project?.id,
      userId: null,
      Week: lastWeek,
      Year: lastWeekyear,
    };
    axios
      .post("/project/projectweekHistory", lparam)
      .then((res) => {
        setlastWeekData(res.data.project);
      })
      .catch((err) => {
      });

    let param = {
      id: location?.state?.project?.id,
      userId: null,
      Week: null,
      Year: null,
      projectWeek: currentWeek,
    };
    axios
      .post("/project/projectweekHistory", param)
      .then((res) => {
        setTableData(res.data.project);
      })
      .catch((err) => {
      });

    axios
      .get("/project/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          setProjectName(res.data.project[0].Name);
        }
      })
      .catch((err) => {
      });
  }, []);
  return (
    <>
          <div className="flex flex-col gap-4 md:justify-between md:flex-row">
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
        <span
          className="cursor_pointer"
          onClick={() => {
            navigate(Routes.SearchProjectSummary, {
              state: {
                project: location?.state?.project,
                week: currentWeekPara,
              },
            });
          }}
        >
          Project Management
        </span>
        <span className="maincontent__breadcrumb--active">
          / View Project History
        </span>
      </div>
        <button
          className="maincontent__btn maincontent__btn--primaryblue w-fit"
          style={{ float: "right" }}
          onClick={() => {
            navigate(Routes.EditProjectStatus, {
              state: {
                project: location?.state?.project,
                week: currentWeekPara,
              },
            });
          }}
        >
          Week Status
        </button>
      </div>
      <div className="mt-2 maincontent__card">
        <div className="maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ display: "inline-block" }}
          >
            {" "}
            CURRENT WEEK STATUS{" "}
          </h2>
          <h2
            className="maincontent__card--header-title"
            style={{
              display: "inline-block",
              float: "right",
              padding: "6px 14px 0 0",
            }}
          >
            {projectName.toUpperCase()}
          </h2>
        </div>
      </div>
      <Card>
        <Row className="mb-2">
          <Col md={12}>
            <DataTable
              title=""
              columns={columns}
              data={currentWeekData}
              pagination
              highlightOnHover
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationPerPage={5}
            />
          </Col>
        </Row>
      </Card>
      <Accordion defaultActiveKey="0" style={{ marginTop: "10px" }}>
        <Accordion.Item eventKey="1">
          <Accordion.Header className="accordionheader"
            style={{
              backgroundColor: "#1658a0",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            LAST WEEK STATUS
          </Accordion.Header>
          <Accordion.Body className="accordionnew" style={{ visibility: "visible", color: "#1658a0" }}>
            <Card>
              <Row className="mb-2">
                <Col md={12}>
                  <DataTable
                    title=""
                    columns={columns}
                    data={lastWeekData}
                    pagination
                    highlightOnHover
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={5}
                  />
                </Col>
              </Row>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="0" style={{ marginTop: "10px" }}>
        <Accordion.Item eventKey="1">
          <Accordion.Header className="accordionheader"
            style={{
              backgroundColor: "#1658a0",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            ARCHIVAL
          </Accordion.Header>
          <Accordion.Body className="accordionnew" style={{ visibility: "visible", color: "#1658a0" }}>
            <Card>
              <Row className="rdt_Pagination">
                <Col md={12}>
                  <DataTable
                    title=""
                    columns={columns}
                    data={tableData}
                    pagination
                    highlightOnHover
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={5}
                  />
                </Col>
              </Row>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Row className="">
        <Col md={4}></Col>
        <Col md={4}></Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button
          className="maincontent__btn maincontent__btn--primaryblue"
            style={{ marginRight: "4px" }}
            onClick={() => {
              navigate(Routes.SearchProjectSummary);
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ViewHistory);