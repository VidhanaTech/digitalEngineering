import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Row,
  Form,
  Button,
  Accordion,
  Card,
} from "@themesberg/react-bootstrap";
import BarLineChart from "../../components/BarLineChart";
import MultiBarLineChart from "../../components/MultiBarLineChart";
import StackedBarChart from "../../components/StackedBarChart";
import DataTable from "react-data-table-component";
import BarChart from "./BarChart";
import axios from "../../common/http-common";
import DashboardCard from "./DashboardCard";
import DashboardInfoBlock from "./DashboardInfoBlock";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import reset from "../../assets/img/brand/reseticon.svg";
import {
  faAdjust,
  faSort,
  faFilter,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

export default () => {
  const navigate = useNavigate();
  const [overallFilter, setOverallFilter] = useState({
    organizationid: { value: null, label: "All" },
    countryid: { value: null, label: "All" },
    capability: { value: null, label: "All" },
    industryid: { value: null, label: "All" },
    clientid: { value: null, label: "All" },
    projecttypeid: { value: null, label: "All" },
    statusid: { value: null, label: "All" },
    projectend: { value: null, label: "All" },
  });

  const [loading, setLoading] = useState(true);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  function formatMillions(number) {
    if (number < 1000000) {
      return number.toLocaleString(); // Regular comma-separated format
    } else {
      const millions = (number / 1000000).toFixed(1);
      return millions;
    }
  }

  const [organizationData, setOrganizationData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [capabilityData, setCapabilityData] = useState([]);
  const [industryData, setindustryData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [projectTypeData, setProjectTypeData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);
  const [totalProject, setTotalProject] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const [watchListInfo, setWatchListInfo] = useState([
    { label: "Open Risks", value: 0 },
    { label: "Open Issues", value: 0 },
    { label: "Red Flags", value: 0 },
  ]);
  const [knowledgeMgmtInfo] = useState([
    { label: "Case Studies", value: 0 },
    { label: "KM Articles", value: 0 },
    { label: "Accelerators", value: 0 },
  ]);

  const [clientSatisfactionInfo, setClientSatisfactionInfo] = useState([
    { label: "Client Relationship", value: 225 },
    { label: "Delivery Performance", value: 221 },
    { label: "Blue Flags", value: 0 },
  ]);
  const [engagements, setEngagements] = useState([
    { id: 2, label: "MC", value: 0, value1: 0, value2: 0 },
    { id: 2, label: "MS", value: 0, value1: 0, value2: 0 },
  ]);

  const [finance, setFinance] = useState([
    { label: "Q1", value: 6000000, value1: 4000000, color: "rgb(5 3 70)" },
    { label: "Q2", value: 8000000, value1: 6000000, color: "rgb(5 3 70)" },
    { label: "Q3", value: 3000000, value1: 7000000, color: "rgb(5 3 70)" },
    { label: "Q4", value: 9000000, value1: 4000000, color: "rgb(5 3 70)" },
  ]);

  const [operations, setOperations] = useState([
    { label: "Q1", value: 600, value1: 400, value2: 600, color: "rgb(5 3 70)" },
    { label: "Q2", value: 800, value1: 600, value2: 400, color: "rgb(5 3 70)" },
    { label: "Q3", value: 700, value1: 300, value2: 600, color: "rgb(5 3 70)" },
    { label: "Q4", value: 900, value1: 400, value2: 700, color: "rgb(5 3 70)" },
  ]);

  const formattedOperations = finance.map((finance) => ({
    ...finance,
    value: formatMillions(finance.value),
    value1: formatMillions(finance.value1),
  }));

  const ragData = [
    { id: 1, label: "R", value: 60, color: "green", color: "rgb(255 0 0)" },
    { id: 2, label: "A", value: 30, color: "red", color: "rgb(203, 156, 1)" },
    { id: 3, label: "G", value: 10, color: "#cfad05", color: "rgb(7 108 30)" },
  ];

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };
  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );
  const columns = [
    {
      name: "Client",
      selector: (param) => param.client,
      sortable: true,
      // sortFunction:(a,b)=>a.client.localeCompare(b.client)

    },
    {
      name: "Project Name",
      selector: (param) => param.project_name,
      sortable: true,
      // sortFunction:(a,b)=> a.project_name.localeCompare(b.project_name)

    },
    {
      name: "Country",
      selector: (param) => param.country,
      sortable: "true",
      // // sortFunction:(a,b)=>{
      //   const countryA = a.country||"";
      //   const countryB = b.country||"";
      //   return
      // }

    },
    {
      name: "Capability",
      selector: (param) => param.capability,
      sortable: true, 
      // sortFunction:(a,b)=>{
      //   const capabilityA = a.capability ||"";
      //   const capabilityB = b.capability || "";
      //   return capabilityA.localeCompare(capabilityB);
      // }
    },
    {
      name: "Industry",
      selector: (param) => param.industry,
      sortable: "true",
      sortFunction:(a,b)=>  {
        const IndustryA = a.industry || ""; // Use an empty string if null
      const IndustryB = b.industry || ""; // Use an empty string if null
      return IndustryA.localeCompare(IndustryB);
    },
    },
    // {
    //   name: "Project Type",
    //   selector: (param) => param.project_type,
    //   sortable: true
    // },

    // {
    //   name: "HC",
    //   selector: (param) => param.hc,
    //   sortable: "true"
    // },

    // {
    //   name: "Status",
    //   selector: (param) => getStatusBar(param.status),
    //   sortable: "true"
    // }
    {
      name: "Delivery",
      selector: (param) => getDeliveryStatusBar(param.status),
      sortable: "true",
    },
    {
      name: "Finance",
      selector: (param) => getFinanceStatusBar(param.status),
      sortable: "true",
    },
    {
      name: "Operations",
      selector: (param) => getOperationStatusBar(param.status),
      sortable: "true",
    },
  ];

  const getDeliveryStatusBar = (status) => {
    return (
      <>
        {status == "Active" ? (
          <div className="dashboard-bar active_bar"></div>
        ) : status == "Completed" ? (
          <div className="dashboard-bar complete_bar"></div>
        ) : status == "Cancelled" ? (
          <div className="dashboard-bar cancel_bar"></div>
        ) : (
          <div className="dashboard-bar cancel_bar"></div>
        )}
      </>
    );
  };

  const getFinanceStatusBar = (status) => {
    return (
      <>
        {status == "Active" ? (
          <div className="dashboard-bar active_bar"></div>
        ) : status == "Completed" ? (
          <div className="dashboard-bar cancel_bar"></div>
        ) : status == "Cancelled" ? (
          <div className="dashboard-bar complete_bar"></div>
        ) : (
          <div className="dashboard-bar cancel_bar"></div>
        )}
      </>
    );
  };

  const getOperationStatusBar = (status) => {
    return (
      <>
        {status == "Active" ? (
          <div className="dashboard-bar cancel_bar"></div>
        ) : status == "Completed" ? (
          <div className="dashboard-bar complete_bar"></div>
        ) : status == "Cancelled" ? (
          <div className="dashboard-bar active_bar"></div>
        ) : (
          <div className="dashboard-bar active_bar"></div>
        )}
      </>
    );
  };

  const [projectList, setProjectList] = useState([]);

  useEffect(async () => {
    await axios
      .post("/dashboard/getfilter")
      .then((res) => {
        let org_arr = [{ value: "", label: "All" }];
        if (res.data.organization.length > 0) {
          res.data.organization.map((row) => {
            org_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setOrganizationData(org_arr);

        let cap_arr = [{ value: "", label: "All" }];
        if (res.data.capability.length > 0) {
          res.data.capability.map((row) => {
            cap_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setCapabilityData(cap_arr);

        let coun_arr = [{ value: "", label: "All" }];
        if (res.data.country.length > 0) {
          res.data.country.map((row) => {
            coun_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setCountryData(coun_arr);

        let inds_arr = [{ value: "", label: "All" }];
        if (res.data.industry.length > 0) {
          res.data.industry.map((row) => {
            inds_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setindustryData(inds_arr);

        let cli_arr = [{ value: "", label: "All" }];
        if (res.data.client.length > 0) {
          res.data.client.map((row) => {
            cli_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setClientData(cli_arr);

        let pty_arr = [{ value: "", label: "All" }];
        if (res.data.projectType.length > 0) {
          res.data.projectType.map((row) => {
            pty_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setProjectTypeData(pty_arr);

        let sts_arr = [{ value: "", label: "All" }];
        if (res.data.projectStatus.length > 0) {
          res.data.projectStatus.map((row) => {
            sts_arr.push({ value: row.Id, label: row.Name });
          });
        }
        setProjectStatusData(sts_arr);
      })
      .catch((err) => {
        console.log(err);
      });
    getdashboardOverview();
  }, [overallFilter]);

  const getdashboardOverview = async () => {
    setisDisabled(true);
    let data = {
      organizationid: overallFilter.organizationid.value
        ? overallFilter.organizationid.value
        : null,
      countryid: overallFilter.countryid.value
        ? overallFilter.countryid.value
        : null,
      capability: overallFilter.capability.value
        ? overallFilter.capability.value
        : null,
      industryid: overallFilter.industryid.value
        ? overallFilter.industryid.value
        : null,
      clientid: overallFilter.clientid.value
        ? overallFilter.clientid.value
        : null,
      projecttypeid: overallFilter.projecttypeid.value
        ? overallFilter.projecttypeid.value
        : null,
      statusid: overallFilter.statusid.value
        ? overallFilter.statusid.value
        : null,
      projectend: overallFilter.projectend.value
        ? overallFilter.projectend.value
        : null,
    };
    await axios
      .post("/dashboard", data)
      .then((res) => {
        setProjectList(res.data.result);
        setFilteredData(res.data.result);
        setTotalProject(res.data.result.length);
        setEngagements([
          {
            id: 2,
            label: "MC",
            value: res.data.mc_count[0].red,
            value1: res.data.mc_count[0].yellow,
            value2: res.data.mc_count[0].red,
            color: "rgb(5 3 70)",
          },
          {
            id: 2,
            label: "MS",
            value: res.data.ms_count[0].red,
            value1: res.data.ms_count[0].yellow,
            value2: res.data.ms_count[0].green,
            color: "rgb(5 3 70)",
          },
        ]);
        setLoading(false);
        watchListInfo[0].value = res.data.openrisk;
        watchListInfo[1].value = res.data.openissue;
        watchListInfo[2].value = res.data.red_flag;

        knowledgeMgmtInfo[0].value = res.data.articleCount;
        knowledgeMgmtInfo[1].value = res.data.caseStudyCount;
        knowledgeMgmtInfo[2].value = res.data.knowledgeCount;

        clientSatisfactionInfo[2].value = res.data.blue_flag;
        const watchList = [...watchListInfo];
        watchList[2].value = rvalue;
        setWatchListInfo(watchList);
        const clientList = [...clientSatisfactionInfo];
        clientList[2].value = bvalue;
        setClientSatisfactionInfo(clientList);
        setisDisabled(false);
      })
      .catch((err) => {
        setisDisabled(false);
      });
    // setTimeout(() => {
    //   setIsAccordionOpen(false);
    // }, 10000);
  };

  const [filteredData, setFilteredData] = useState(projectList);
  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filter = projectList.filter((item) =>
      item.client.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredData(filter);
  };

  const searchReset = () => {
    overallFilter.organizationid = { value: null, label: "All" };
    overallFilter.countryid = { value: null, label: "All" };
    overallFilter.capability = { value: null, label: "All" };
    overallFilter.industryid = { value: null, label: "All" };
    overallFilter.clientid = { value: null, label: "All" };
    overallFilter.projecttypeid = { value: null, label: "All" };
    overallFilter.statusid = { value: null, label: "All" };
    overallFilter.projectend = { value: null, label: "All" };
    getdashboardOverview();
  };

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };
  return (
    <>
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
        <span>Portray 360 Dashboard</span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Summary</span>
      </div>
      <div className="mt-4 dashboard">
        <Accordion activeKey={isAccordionOpen ? "1" : "0"} className="mt-4">
          <Accordion.Item eventKey="1">
            <Accordion.Header onClick={toggleAccordion}>
              EXPLORE
            </Accordion.Header>
            <Accordion.Body className="visible text-blue-60">
              <img
                className="resetIconDX"
                style={{ color: "#1658a0", cursor: "pointer" }}
                title="Reset"
                src={reset}
                onClick={searchReset}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {/* <Form.Group>
                  <Form.Label>Organization</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, organizationid: e })
                    }}
                    options={organizationData}
                    value={overallFilter.organizationid}
                  />
                </Form.Group> */}
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, countryid: e });
                      getdashboardOverview();
                    }}
                    options={countryData}
                    value={overallFilter.countryid}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Capability</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, capability: e });
                      getdashboardOverview();
                    }}
                    options={capabilityData}
                    value={overallFilter.capability}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Industry</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, industryid: e });
                      getdashboardOverview();
                    }}
                    options={industryData}
                    value={overallFilter.industryid}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Client</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, clientid: e });
                      getdashboardOverview();
                    }}
                    options={clientData}
                    value={overallFilter.clientid}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Project Type</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, projecttypeid: e });
                      getdashboardOverview();
                    }}
                    options={projectTypeData}
                    value={overallFilter.projecttypeid}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, statusid: e });
                      getdashboardOverview();
                    }}
                    options={projectStatusData}
                    value={overallFilter.statusid}
                  />
                </Form.Group>
                {/* <div className="flex items-end justify-center gap-4 md:justify-start">
                  <Button
                    disabled={isDisabled}
                    onClick={getdashboardOverview}
                    className="maincontent__btn maincontent__btn--primaryblue lg:w-full"
                  >
                    Search
                  </Button>
                  <Button
                    onClick={searchReset}
                    className="maincontent__btn maincontent__btn--primaryblue lg:w-full"
                  >
                    Reset
                  </Button>
                </div> */}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* <div className="dashboard-title">Portray 360 Dashboard</div> */}
        <div className="flex flex-col dashboard-body lg:flex-row lg:justify-between md:gap-4">
          {/* <div className="card lg:w-1/3 dashboard-filter-card">
            <DashboardCard title="EXPLORE">
              <div>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Organization</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, organizationid: e });
                    }}
                    options={organizationData}
                    value={overallFilter.organizationid}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Country</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, countryid: e });
                    }}
                    options={countryData}
                    value={overallFilter.countryid}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Capability</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, capability: e });
                    }}
                    options={capabilityData}
                    value={overallFilter.capability}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Industry</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, industryid: e });
                    }}
                    options={industryData}
                    value={overallFilter.industryid}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Client</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, clientid: e });
                    }}
                    options={clientData}
                    value={overallFilter.clientid}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Project Type</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, projecttypeid: e });
                    }}
                    options={projectTypeData}
                    value={overallFilter.projecttypeid}
                  />
                </Form.Group>
                <Form.Group class="dashboard-filter-dropdown">
                  <Form.Label>Status</Form.Label>
                  <Select
                    labelKey="name"
                    onChange={(e) => {
                      setOverallFilter({ ...overallFilter, statusid: e });
                    }}
                    options={projectStatusData}
                    value={overallFilter.statusid}
                  />
                </Form.Group>
                <div className="flex items-center justify-between md:justify-center md:gap-4 lg:mt-12 lg:flex-col">
                  <Button
                    disabled={isDisabled}
                    onClick={getdashboardOverview}
                    className="maincontent__btn maincontent__btn--primaryblue lg:w-full"
                  >
                    Search
                  </Button>
                  <Button
                    onClick={searchReset}
                    className="maincontent__btn maincontent__btn--primaryblue lg:w-full"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </div> */}

          <div className="grid grid-cols-1 gap-4 mt-4 md:w-full lg:mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card">
                <DashboardCard title="DELIVERY" titleColor="#11e33a">
                  {/* <div className="dashboard-graph-info">
                    <div>
                      <div>
                        Total projects : <span>{totalProject}</span>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        MS : <span>{engagements[0].value}</span>
                      </div>
                      <div>
                        MC : <span>{engagements[1].value}</span>
                      </div>
                    </div>
                  </div> */}

                  <Card.Body style={{ padding: "4px" }}>
                    <Row
                      style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "3px",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      <Col className="dashfistcard">
                        <span>{totalProject}</span>
                        <br />
                        Projects
                      </Col>
                      <Col
                        className="dashfistcard"
                        style={{
                          borderLeft: "1px solid #d9d9d9",
                          borderRight: "1px solid #d9d9d9",
                        }}
                      >
                        <span>{engagements[0].value}</span>
                        <br />
                        MS
                      </Col>
                      <Col className="dashfistcard">
                        <span>{engagements[1].value}</span>
                        <br />
                        MC
                      </Col>
                    </Row>
                  </Card.Body>
                  {loading ? (
                    <div class="circle__loader items-center my-0 mx-auto"></div>
                  ) : (
                    <div className="dashboard-graph-section">
                      <StackedBarChart data={engagements} title={""} />
                    </div>
                  )}
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="FINANCE" titleColor="#dec121">
                  {/* <div className="flex text-xs dashboard-graph-info">
                    <div className="w-3/5">
                      <p className="flex justify-between pr-2 text-xs">
                        <span className="font-normal">YTD Revenue</span>
                        <span>:</span>
                      </p>
                      <p className="flex justify-between pr-2 text-xs">
                        <span className="font-normal">YTD Margin</span>
                        <span>:</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold">389 $</p>
                      <p className="text-xs font-bold ">36%</p>
                    </div>
                  </div> */}

                  <Card.Body style={{ padding: "4px" }}>
                    <Row
                      style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "3px",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      <Col className="dashfistcard">
                        <span>389M $</span>
                        <br />
                        YTD Revenue
                      </Col>
                      <Col
                        className="dashfistcard"
                        style={{
                          borderLeft: "1px solid #d9d9d9",
                          borderRight: "1px solid #d9d9d9",
                        }}
                      >
                        <span>36%</span>
                        <br />
                        YTD Margin
                      </Col>
                      <Col className="dashfistcard">
                        <span>210M $</span>
                        <br />
                        YTD Holdings
                      </Col>
                    </Row>
                  </Card.Body>
                  {loading ? (
                    <div class="circle__loader items-center my-0 mx-auto"></div>
                  ) : (
                    <div className="dashboard-graph-section">
                      <MultiBarLineChart
                        data={formattedOperations}
                        title={"Million $"}
                        // valueFormatter={value => `${value}M`}
                      />
                    </div>
                  )}
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="OPERATIONS" titleColor="#ff0000">
                  {/* <div className="flex text-xs dashboard-graph-info">
                    <div className="w-3/5">
                      <p className="flex justify-between pr-2 text-xs">
                        <span className="font-normal">Total Head Count</span>
                        <span>:</span>
                      </p>
                      <p className="flex justify-between pr-2 text-xs">
                        <span className="font-normal">Utilization</span>
                        <span>:</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold">2525</p>
                      <p className="text-xs font-bold ">94%</p>
                    </div>
                  </div> */}

                  <Card.Body style={{ padding: "4px" }}>
                    <Row
                      style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "3px",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    >
                      <Col className="dashfistcard">
                        <span>3896</span>
                        <br />
                        Head Count
                      </Col>
                      <Col
                        className="dashfistcard"
                        style={{
                          borderLeft: "1px solid #d9d9d9",
                          borderRight: "1px solid #d9d9d9",
                        }}
                      >
                        <span>96%</span>
                        <br />
                        Utilization
                      </Col>
                      <Col className="dashfistcard">
                        <span>21%</span>
                        <br />
                        Holdings
                      </Col>
                    </Row>
                  </Card.Body>
                  {loading ? (
                    <div class="circle__loader items-center my-0 mx-auto"></div>
                  ) : (
                    <div className="dashboard-graph-section">
                      <BarLineChart
                        height="100px"
                        data={operations}
                        title={"Head Count"}
                      />
                    </div>
                  )}
                </DashboardCard>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
              <div className="card">
                <DashboardCard title="WATCH LIST">
                  <DashboardInfoBlock
                    infoList={watchListInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="KNOWLEDGE MANAGEMENT">
                  <DashboardInfoBlock
                    infoList={knowledgeMgmtInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="CLIENT SATISFACTION">
                  <DashboardInfoBlock
                    infoList={clientSatisfactionInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="WATCH LIST">
                  <DashboardInfoBlock
                    infoList={watchListInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div>
              <div className="card">
                <DashboardCard title="KNOWLEDGE MANAGEMENT">
                  <DashboardInfoBlock
                    infoList={knowledgeMgmtInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div>
              {/* <div className="card">
                <DashboardCard title="CLIENT SATISFACTION">
                  <DashboardInfoBlock
                    infoList={clientSatisfactionInfo}
                  ></DashboardInfoBlock>
                </DashboardCard>
              </div> */}
            </div>
            {loading ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <div className="mt-4 maincontent__card">
                {/* <div className="maincontent__card--header">
                  <h2 className="maincontent__card--header-title"></h2>
                </div> */}
                <div className="maincontent__card--content">
                  <DataTable
                    title=""
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={5}
                    highlightOnHover
                    defaultSortAsc={true}

                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
