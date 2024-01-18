import React, { useEffect, useState } from "react";
import "./Defaulters.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import apiClient from "../../common/http-common";
import Select from "react-select";
import DataTable from "react-data-table-component";
import reset from "../../assets/img/brand/reseticon.svg";
import {
  Col,
  Row,
  Accordion,
  Card,
  Button,
  Form,
} from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import {
  faFileExcel,
  faPenToSquare,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import excelicon from "../../assets/img/brand/excelicon.svg";
import ClientNameIcon from "../../assets/img/icons/wsr/icon-client-name.svg";
import ProjectNameIcon from "../../assets/img/icons/wsr/icon-project-name.svg";
import ChooseWeekIcon from "../../assets/img/icons/wsr/icon-choose-week.svg";
import WSRSubmittedStatusIcon from "../../assets/img/icons/wsr/icon-wsr-submitted-status.svg";
import Papa from "papaparse";
import { ddmmyyyyFormat } from "../../common/Helper";
import { connect } from "react-redux";

const Defaulters = (state) => {
  const [disabled, setdisabled] = useState(false);
  const [week, setWeek] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [newFilter, setNewFilter] = useState([]);
  const [clientTypeList, setClientTypeList] = useState([
    { value: null, label: "All" },
  ]);
  const [projectTypeList, setProjectTypeList] = useState([
    { value: null, label: "All" },
  ]);
  const [selectVal, setSelectVal] = useState({
    clientId: { value: null, label: "All" },
    projectId: { value: null, label: "All" },
    week: { value: null, label: "All" },
    wsrStatus: { value: null, label: "All" },
  });
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  function resetFields() {
    setWeek("");
    selectVal.clientId = { value: null, label: "All" };
    selectVal.projectId = { value: null, label: "All" };
    selectVal.wsrStatus = { value: null, label: "All" };
    let type = "reset";
    searchFields(type);
  }

  const [loading, setLoading] = useState(true);

  const columns = [
    {
      name: "CLIENT",
      selector: (param) => (
        <span title={param.ClientName}>{param.ClientName}</span>
      ),
      sortable: true,
    },
    {
      name: "PROJECT",
      selector: (param) => (
        <span title={param.ProjectName}>{param.ProjectName}</span>
      ),
      sortable: true,
    },
    {
      name: "MANAGER",
      selector: (param) => (
        <span title={param.ManagerName}>{param.ManagerName}</span>
      ),
      sortable: true,
    },
    {
      name: "ENGAGEMENT",
      selector: (param) => (
        <span title={param.EngagementLeadName}>{param.EngagementLeadName}</span>
      ),
      sortable: true,
    },
    {
      name: "WSR EFFECTIVE",
      selector: (param) => ddmmyyyyFormat(param.WsrDate),
      sortable: true,
    },
    {
      name: "STATUS",
      sortable:true,
      sortFunction:(a,b) => a.WsrStatus.localeCompare(b.WsrStatus),
      cell: (param) => (
        <>
          {param.WsrStatus === "Submitted" ? (
            <div class="maincontent__table--status maincontent__table--status-updated">
              Updated
            </div>
          ) : (
            <div class="maincontent__table--status maincontent__table--status-notupdated">
              Not Updated
            </div>
          )}
        </>
      ),
    },
    {
      name: "SUBMITTED",
      selector: (param) => ddmmyyyyFormat(param.SubmittedTime),
      sortable: true,
    },
  ];

  const submittedStatusList = [
    { value: null, label: "All" },
    { value: "Submitted", label: "Submitted" },
    { value: "Not Submitted", label: "Not Submitted" },
  ];

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);
    if (searchValue === "") {
      setFilteredData(newFilter);
    } else {
      const filterData = filteredData.filter((item) => {
        return (
          item.ClientName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.ProjectName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.ManagerName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.EngagementLeadName.toLowerCase().includes(
            searchValue.toLowerCase()
          )
        );
      });

      setFilteredData(filterData);
    }
  };

  function handleExport(data) {
    const headers = [
      { label: "CLIENT NAME", key: "ClientName" },
      { label: "PROJECT NAME", key: "ProjectName" },
      { label: "PROJECT MANAGER", key: "ManagerName" },
      { label: "ENGAGEMENT LEADER", key: "EngagementLeadName" },
      { label: "SUBMITTED TIME", key: "SubmittedTime" },
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
    saveAs(blob, "WSR Details.csv");
  }

  useEffect(() => {
    let data = {
      id: null,
      clientId: null,
      EngagementTypeId: null,
      domainId: null,
      towerId: null,
      organizationId: null,
      capabilityId: null,
      projectStatusId: null,
      userId: null,
    };
    apiClient
      .post("/project/searchall", data)
      .then((response) => {
        var arr = [{ value: null, label: "All" }];
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name });
          });
        }
        setProjectTypeList(arr);
      })
      .catch((err) => {});

    getDropDownValues();
    searchFields();
  }, []);
  useEffect(() => {
    searchFields();
  }, [selectVal]);
  const getDropDownValues = () => {
    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0",
      })
      .then((response) => {
        if (response?.data?.client?.length > 0) {
          let arr = [{ value: null, label: "All" }];
          response.data.client.map((user) => {
            arr.push({ value: user.Id, label: user.Name });
          });
          setClientTypeList(arr);
        }
      });
  };

  const searchFields = (type) => {
    setdisabled(true);
    let weekVal = null;
    let yearVal = null;
    if (week && type !== "reset") {
      let value = week.split("-");
      yearVal = value[0];
      weekVal =
        value[1].charAt(value[1].length - 2) +
        "" +
        value[1].charAt(value[1].length - 1);
    }

    var request = {
      week: weekVal,
      status: selectVal.wsrStatus.value,
      clientId: selectVal.clientId.value,
      projectId: selectVal.projectId.value,
      userId: "1",
    };
    apiClient.post("/project/wsr", request).then((response) => {
      setFilteredData(response.data.project);
      setNewFilter(response.data.project);
      setdisabled(false);
      setLoading(false);
    });
  };
  return (
    <>
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
        <span>WSR Submitted Status</span>
      </div>
      <Accordion activeKey={isAccordionOpen ? "1" : "0"} className="mt-4">
        <Accordion.Item eventKey="1">
          <Accordion.Header
            onClick={toggleAccordion}
            style={{
              backgroundColor: "#1658a0",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            SEARCH
          </Accordion.Header>
          <Accordion.Body style={{ visibility: "visible", color: "#1658a0" }}>
            <img
              className="resetIconDX"
              style={{ color: "#1658a0", cursor: "pointer" }}
              title="Reset"
              src={reset}
              onClick={() => resetFields()}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
              <Form.Group id="client">
                <Form.Label>Client Name</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={ClientNameIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    id="basic-Select-single"
                    labelKey="name"
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, clientId: e });
                      searchFields();
                    }}
                    options={clientTypeList}
                    value={selectVal.clientId}
                  />
                </div>
              </Form.Group>
              <Form.Group id="project">
                <Form.Label>Project Name</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={ProjectNameIcon}
                        alt="project name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    id="basic-Select-single"
                    labelKey="name"
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, projectId: e });
                      searchFields();
                    }}
                    options={projectTypeList}
                    value={selectVal.projectId}
                  />
                </div>
              </Form.Group>
              <Form.Group id="project">
                <Form.Label>Choose Week</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={ChooseWeekIcon}
                        alt="choose week"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Form.Control
                    required
                    type="week"
                    value={week}
                    placeholder="mm/dd/yyyy"
                    onChange={(e) => {
                      setWeek(e.target.value);
                      searchFields();
                    }}
                  />
                </div>
              </Form.Group>
              <Form.Group id="capability">
                <Form.Label>WSR Submitted Status</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={WSRSubmittedStatusIcon}
                        alt="WSR Submitted status"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    options={submittedStatusList}
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, wsrStatus: e });
                      searchFields();
                    }}
                    value={selectVal.wsrStatus}
                  />
                </div>
              </Form.Group>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-4 maincontent__card">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Project Details</h2>
        </div>
        <div className="maincontent__card--content">
          <div className="flex justify-end gap-2">
            <div className="search-containerKMArti kmarticle-seactform">
              <input
                type="search"
                placeholder="Search by client, project, manager, engagement"
                className="searchArtiInput w-full"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Link className="flexVerandHorCenter">
              <img
                src={excelicon}
                style={{ width: "35px" }}
                onClick={() => handleExport(filteredData)}
                className="maincontent__faIcon maincontent__faIcon--redcolor"
              ></img>
            </Link>
          </div>
          {loading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <DataTable
              title=""
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationPerPage={5}
              className="mt-4 wsr_datatable"
            />
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(Defaulters);
