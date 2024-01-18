import React, { useState, useEffect } from "react";
import { Form, Accordion } from "@themesberg/react-bootstrap";
import Select from "react-select";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../common/http-common";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import DownloadIcon from "../../assets/img/new-dashboard/download-icon.svg";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import reset from "../../assets/img/brand/reseticon.svg";
import { Alert } from "../../components/Alert";
import {
  faPenToSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Routes } from "../../routes";
import { DataTableStyle } from "../../components/DataTableStyle";
import { ddmmyyyyFormat } from "../../common/Helper";
import ClientIcon from "../../assets/img/icons/project-management/icon-client.svg";
import DomainIcon from "../../assets/img/icons/project-management/icon-domain.svg";
import EngagementTypeIcon from "../../assets/img/icons/project-management/icon-engagement-type.svg";
import IndustryIcon from "../../assets/img/icons/project-management/icon-industry.svg";
import LocationIcon from "../../assets/img/icons/project-management/icon-location.svg";
import ProjectIcon from "../../assets/img/icons/project-management/icon-project.svg";
import { connect } from "react-redux";

const SearchProjectSummary = (state) => {
  const [tableData, setTableData] = useState([]);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  const [currentWeekPara, setcurrentWeekPara] = useState({
    currentWeek: "",
    currentMonth: "",
    currentYear: "",
  });

  const [loading, setLoading] = useState(true);

  let [filteredData, setFilteredData] = useState(tableData);
  const [selectVal, setSelectVal] = useState({
    client: { value: null, label: "All" },
    domain: { value: null, label: "All" },
    industry: { value: null, label: "All" },
    location: { value: null, label: "All" },
    capability: { value: null, label: "All" },
    project: { value: null, label: "All" },
    engagementType: { value: null, label: "All" },
  });
  const [clientLookup, setClientLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [industryLookup, setIndustryLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [domainLookup, setDomainLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [engagementLookup, setEngagementTypeLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [locationLookup, setLocationLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [isdisabled, setdisabled] = useState(false);
  const [capabilityLookup, setCapabilityLookup] = useState([
    { value: null, label: "All" },
  ]);
  const [ProjectLookup, setProjectLookup] = useState([
    { value: null, label: "All" },
  ]);

  const navigate = useNavigate();

  const columns = [
    {
      name: "Project",
      selector: (param) => <span title={param.Name}>{param.Name}</span>,
      sortable: true,
      sortFunction: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      name: "Client",
      selector: (param) => (
        <span title={param.ClientName}>{param.ClientName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.ClientName.localeCompare(b.ClientName),
    },
    {
      name: "Engagement",
      selector: (param) => (
        <span title={param.EngagmentTypeName}>{param.EngagmentTypeName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) =>
        a.EngagmentTypeName.localeCompare(b.EngagmentTypeName),
    },
    {
      name: "Manager",
      selector: (param) => (
        <span title={param.ManagerName}>{param.ManagerName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.ManagerName.localeCompare(b.ManagerName),
    },
    {
      name: "Start Date",
      width: "150px",
      selector: (param) => ddmmyyyyFormat(param.start_date),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (param) => ddmmyyyyFormat(param.end_date),
      sortable: true,
    },
    {
      name: "Action",
      cell: (param) => (
        <>
          <a
            style={{ padding: "3%" }}
            title="View Project"
            onClick={() => {
              navigate(Routes.ViewProject, {
                state: { project: param, page: "view" },
              });
            }}
          >
            <FontAwesomeIcon icon={faEye} size="lg" color="#1475DF" />
          </a>
          <a
            title="Edit Project"
            style={{ padding: "3%" }}
            onClick={() => {
              navigate(Routes.EditProject, {
                state: { project: param, page: "edit" },
              });
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1475DF" />
          </a>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];
  useEffect(() => {
    setdisabled(true);
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
      week: currentWeek,
      year: currentDate.getFullYear(),
    };
    axios
      .post("/project/search", data)
      .then((response) => {
        setTableData(response.data.project);
        setFilteredData(response.data.project);
        setLoading(false);
        setdisabled(false);
      })
      .catch((err) => {
        setdisabled(false);
        if (err.response && err.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
    axios.post("/client/search").then((response) => {
      if (response.data.client.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.client.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setClientLookup(arr);
        });
      }
    });
    axios.get("/lookup/Domain/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setDomainLookup(arr);
        });
      }
    });
    axios.get("/lookup/Industry/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setIndustryLookup(arr);
        });
      }
    });
    axios.get("/lookup/PoLocation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setLocationLookup(arr);
        });
      }
    });
    axios.get("/lookup/Capability/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setCapabilityLookup(arr);
        });
      }
    });
    axios
      .post("/project/search", data)
      .then((response) => {
        if (response.data.project.length > 0) {
          const arr = [{ value: null, label: "All" }];
          response.data.project.map((user) => {
            const obj = { value: user.id, label: user.Name };
            arr.push(obj);
          });
          setProjectLookup(arr);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });

    axios.get("/lookup/EngagementType/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [{ value: null, label: "All" }];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setEngagementTypeLookup(arr);
        });
      }
    });
  }, []);

  const searchFields = () => {
    setLoading(true);
    let data = {
      id: selectVal.project.value,
      clientId: selectVal.client.value,
      EngagementTypeId: selectVal.engagementType.value,
      domainId: selectVal.domain.value,
      towerId: selectVal.location.value,
      organizationId: null,
      capabilityId: selectVal.capability.value,
      projectStatusId: null,
      userId: null,
      week: currentWeekPara.currentWeek,
      year: currentWeekPara.currentYear,
    };
    axios
      .post("/project/search", data)
      .then((response) => {
        if (response.data.project === "") {
          setLoading(true);
        } else {
          setLoading(false);
          setTableData(response.data.project);
          if (searchValue) {
            filterData(searchValue, response.data.project);
          } else {
            setFilteredData(response.data.project);
          }
          setdisabled(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setdisabled(false);
        if (err.response && err.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  };

  useEffect(() => {
    searchFields();
  }, [selectVal]);

  const searchReset = () => {
    selectVal.client = { value: null, label: "All" };
    selectVal.domain = { value: null, label: "All" };
    selectVal.industry = { value: null, label: "All" };
    selectVal.location = { value: null, label: "All" };
    selectVal.capability = { value: null, label: "All" };
    selectVal.project = { value: null, label: "All" };
    selectVal.engagementType = { value: null, label: "All" };
    searchFields();
  };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    filteredData = tableData.filter(
      (item) =>
        item.Name.toLowerCase().includes(lowerCaseValue) ||
        item.ClientName.toLowerCase().includes(lowerCaseValue) ||
        item.EngagmentTypeName.toLowerCase().includes(lowerCaseValue) ||
        item.ManagerName.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredData(filteredData);
  };
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };

  function handleExport(data) {
    const headers = [
      { label: "Name", key: "Name" },
      { label: "Client Name", key: "ClientName" },
      { label: "Engagement Type", key: "EngagmentTypeName" },
      { label: "Pronect Manager", key: "ManagerName" },
      { label: "Start Date", key: "start_date" },
      { label: "End Date", key: "end_date" },
    ];

    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (
          acc[header.label] === "start_date" ||
          acc[header.label] === "Start Date" ||
          acc[header.label] === "End Date" ||
          acc[header.label] === "end_date"
        ) {
          acc[header.label] = ddmmyyyyFormat(acc[header.key]);
        } else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );
    const csvData = Papa.unparse(exportData);

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Project Summary.csv");
  }

  return (
    <div>
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
        <span>Project Management</span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">
          Search Project Summary
        </span>
      </div>
      <Accordion activeKey={isAccordionOpen ? "1" : "0"}>
        <Accordion.Item eventKey="1">
          <Accordion.Header
            className="accordionheader"
            onClick={toggleAccordion}
          >
            SEARCH
          </Accordion.Header>
          <Accordion.Body
            className="accordionnew"
            style={{ visibility: "visible", color: "#1658a0" }}
          >
            <div>
              <img
                className="resetIconDX"
                style={{ color: "#1658a0", cursor: "pointer" }}
                title="Reset"
                src={reset}
                onClick={() => searchReset()}
              />
              <Form>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Form.Group>
                      <Form.Label>Client</Form.Label>
                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className=" inputIconCont input-group-text icon-container">
                              <img
                                src={ClientIcon}
                                alt="client"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            className="selectOptions"
                            options={clientLookup}
                            placeholder=""
                            value={selectVal.client}
                            onChange={(e) => {
                              setSelectVal({ ...selectVal, client: e });
                            }}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group>
                      <Form.Label>Domain</Form.Label>
                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="inputIconCont input-group-text icon-container">
                              <img
                                src={DomainIcon}
                                alt="domain"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            className="selectOptions"
                            options={domainLookup}
                            placeholder=""
                            value={selectVal.domain}
                            onChange={(e) => {
                              setSelectVal({ ...selectVal, domain: e });
                            }}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group id="industry">
                      <Form.Label>Industry</Form.Label>
                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="inputIconCont input-group-text icon-container">
                              <img
                                src={IndustryIcon}
                                alt="industry"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            className="selectOptions"
                            options={industryLookup}
                            placeholder=""
                            value={selectVal.industry}
                            onChange={(e) => {
                              setSelectVal({ ...selectVal, industry: e });
                            }}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group id="location">
                      <Form.Label>Location</Form.Label>
                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="inputIconCont input-group-text icon-container">
                              <img
                                src={LocationIcon}
                                alt="location"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            className="selectOptions"
                            options={locationLookup}
                            placeholder=""
                            value={selectVal.location}
                            onChange={(e) => {
                              setSelectVal({ ...selectVal, location: e });
                            }}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div className="hidden">
                    <Form.Group id="capability">
                      <Form.Label>Capability</Form.Label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img
                              src={ClientIcon}
                              alt="client"
                              className="input-icon"
                            />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={capabilityLookup}
                          placeholder=""
                          value={selectVal.capability}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, capability: e });
                          }}
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group id="capability">
                      <Form.Label>Project</Form.Label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img
                              src={ProjectIcon}
                              alt="project"
                              className="input-icon"
                            />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={ProjectLookup}
                          placeholder=""
                          value={selectVal.project}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, project: e });
                          }}
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group id="capability">
                      <Form.Label>Engagement Type</Form.Label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="inputIconCont input-group-text icon-container">
                            <img
                              src={EngagementTypeIcon}
                              alt="engagment type"
                              className="input-icon"
                            />
                          </span>
                        </div>
                        <Select
                          className="selectOptions"
                          options={engagementLookup}
                          placeholder=""
                          value={selectVal.engagementType}
                          onChange={(e) => {
                            setSelectVal({ ...selectVal, engagementType: e });
                          }}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mt-2 maincontent__card--body ">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title text-black">
            Project details
          </h2>
        </div>

        <div className="maincontent__card--content">
          <div className="maincontent__card--tableheader">
            <div className="maincontent__card--tableheader-right">
              <div className="relative search-containerKMArti kmarticle-seactform">
                <input
                  type="search"
                  placeholder="Search by project, client, manager, engagement"
                  value={searchValue}
                  onChange={handleSearch}
                  className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[38px]"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-[rgba(0,0,0,60%)] rounded-[28px] h-[30px] text-white text-[10px] font-bold"
                >
                  Search
                </button>
              </div>
              <Link className="flexVerandHorCenter">
                <img
                  src={DownloadIcon}
                  onClick={() => handleExport(filteredData)}
                  className="p-2 bg-[rgba(0,0,0,60%)] rounded-md w-auto"
                ></img>
              </Link>
              <button
                className="maincontent__btn maincontent__btn--primaryblue"
                onClick={() => {
                  navigate(Routes.AddProject);
                }}
              >
                +Add Project
              </button>
            </div>
          </div>
          {loading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <DataTable
              title=""
              columns={columns}
              data={filteredData}
              customStyles={DataTableStyle}
              pagination
              highlightOnHover
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationPerPage={5}
              className="mt-4 project_DataTable"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(SearchProjectSummary);
