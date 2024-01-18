import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartBar,
  faUsers,
  faFilter,
  faAdjust,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
// import Card from "@themesberg/react-bootstrap/lib/Card";
import PieChart from "./PieChart";



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

  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserName] = useState(
    getUserId.user.FirstName + getUserId.user.LastName
  );

  function formatMillions(number) {
    if (number < 1000000) {
      return number.toLocaleString(); // Regular comma-separated format
    } else {
      const millions = (number / 1000000).toFixed(1);
      return millions;
    }
  }

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };
  
  // const [showSettings, setShowSettings] = useState(
  //   localStorageIsSettingsVisible
  // );
  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible());

  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };
  const engagements = [
    { id: 2, label: "MC", value: 20, color: "rgb(5 3 70)" },
    { id: 2, label: "MS", value: 15, color: "rgb(5 3 70)" },
  ];
  const ragData = [
    { id: 1, label: "R", value: 60, color: "green", color: "rgb(255 0 0)" },
    { id: 2, label: "A", value: 30, color: "red", color: "rgb(203, 156, 1)" },
    { id: 3, label: "G", value: 10, color: "#cfad05", color: "rgb(7 108 30)" },
  ];

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


  const columns = [
    {
      name: "Client",
      selector: (param) => param.client,
      sortable: true,
    },
    {
      name: "Project Name",
      selector: (param) => param.project_name,
      sortable: true,
    },
    {
      name: "Country",
      selector: (param) => param.country,
      sortable: "true",
    },
    {
      name: "Capability",
      selector: (param) => param.capability,
      sortable: true,
    },
    {
      name: "Industry",
      selector: (param) => param.industry,
      sortable: "true",
      sortFunction: (a, b) =>  {
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
        {/* <div className="flex flex-col dashboard-body lg:flex-row lg:justify-between md:gap-4"> */}
        <Row className="justify-content-md-center" height="300px">
          <Col
            xs={3}
            className="mb-4 d-none d-sm-block"
            style={{ height: "300px" }}
          >
            <Card style={{ height: "300px" }}>
              <Card.Body className="pb-0">
                <Row className="userProfileSet">
                  <Card.Img
                    className="w-2/4"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAACNCAMAAAC9gAmXAAAAYFBMVEX///8AAAAEBARZWVno6Oj5+flSUlLExMRPT0/Y2NiQkJDu7u7z8/M+Pj78/Py2trbe3t41NTXMzMxlZWUlJSWEhISlpaV2dnZGRkawsLAfHx+Xl5cvLy++vr6KiooXFxfNuXHFAAAEM0lEQVR4nO2a15aqMBSGCYL03lHx/d/yJAGFNEUnYWats78rJ+LkJ9ktxbIAAAAAAAAAAAAAAAAA4P8j/W0BPLFTlmF1IlRhWTrx70lxveZcoC3FufHc35HS2UiG3R0uKB7OS+f3uvf9qqp8v6/vS9t5OHTGhuvcbR0OgfNsdYIhrOcvrsNhWoKe9phMgTglbjAl9Ns+OEAJ9uqQ2suYRYpHoozOmB0eICenXpRkWJg83pDWjI5PkZsWUyYID80lIr2+iH7RBQ8OKkqzYm7URPe8c04N/WZSTEt66DiDcbzL1EwXz2Gbo4483JoTQ0em4bR0i1OjuuP0NAZHJ7VK7mWxGcchE4fDmLFtOpSGbId603bkU8s9E2N95gQchdkg3JrzrEKYptjfiqGffVYOmaxCuxIS9HBnHdtaSZJmxdY9Hf6VgTAYEDtlvcmT5nCPeSYiNq4/SZDclDOv7V6RzRcVuOG6TV6plZOcpVvMgP/phW0qpUMjOBGOykhzRnexCSdc1OsUajjjinDOuuqtv4irZmxT3CvUcG5lZUhzSCZxZeTanEShJuFCsjXiOKRzcDxxaD5Qkwme9jM60Wo+UEMshzOmn+BiR574cma/GmvCrq9vqjwcUIUI5p4VakQbCfDv9U1VI/XRRqGmEZ5Ma1nrl8R4FCS5JleokeTsUPT7r3EKaTRNT0hcbdroJCmXcSQvBGv6EpwCRlmRIk8NsuoqH/VVXbjXWvpmk0TMJHvQqfWpCVVZ2K3QNo2Tj5Xck3up5X0F7tNXfMVnTlWQ82kZpoWTQg0uyNOBETOkihUoVnPSp0b9Ym7rL1L8Vh1vq4PUYD151rZtllMtitXwMWr4fKGqgPWqkdpN1F5R7625PfJ6dG2lGyka7UbiUykxmHkHMukyL89zL+vmpF4Q8+EnTKNPSePNbaR5gM0N89+juPbWGG8ksdhVJfCZhvMunbFYzFPR6aUYbCRsxtaZp4Qcjss+YV3HTJjNFYA6c/i2viHmGRcvlCz2g4rtZIXC7sUPwEZSr14S++/EUDblldbajy5g1rjWSYos2fCsGZTsKOiri+c1AyUl22371KDbI+zoXTNs1lNpNO6aJ8IYzWo0r6e2a01ZvadiGU/da811HZ7vH5pnlNK9Dl/3KMK3ErbQuKB9j2Ldv9lnwjP4ScvI/s1jb+v2gRgi52Zkb+ux7/c6WYo0Zvb9aAQrctV+loqebnkbODgj+8Wn+9v+We4k2Rs5NnubKxXo30snkEH/xIYJtrkTvPIrNaWpGw439LrKErTYRk/vWvRh9DN5drec3n2A0XNNbDvFztkiD5k+893vWQa9aeV5V+C9nPCY+0LzPQp+nbkOCv3mkHsUM0OB1PNF2ovj7phY2/s3Mub7N0de6/pLd5MWQX/m3tbMH7rTBgAAAAAAAAAAAAAAAADAg393yyycUA7o+AAAAABJRU5ErkJggg=="
                  />

                  <span
                    style={{
                      fontSize: "large",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {logUserName}
                  </span>
                  <br />
                  {/* Developer */}
                </Row>
              </Card.Body>
              <Card.Body style={{ padding: "0px" }}>
                <Row
                  style={{
                    // border: "1px solid #d9d9d9",
                    // borderRadius: "3px",
                    // padding: "11px",
                    textAlign: "center",
                    margin: "0px",
                  }}
                >
                  <Col className="dashfistcard">
                    <span>765</span>
                    <br />
                    Project
                  </Col>
                  <Col
                    className="dashfistcard"
                    style={{
                      borderLeft: "1px solid #d9d9d9",
                      borderRight: "1px solid #d9d9d9",
                    }}
                  >
                    <span>765</span>
                    <br />
                    Value Adds
                  </Col>
                  <Col className="dashfistcard">
                    <span>76</span>
                    <br />
                    Client
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col
            xs={3}
            className="mb-4 d-none d-sm-block"
            style={{ height: "300px" }}
          >
            <Card style={{ height: "140px" }}>
              <Card.Body>
                <Row>
                  <Col>
                    <span
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      345
                    </span>
                    <p>Project</p>
                  </Col>
                  <Col
                    style={{
                      backgroundColor: "#ddf0ed",
                      margin: "-18px -12px -4px 12px",
                      borderRadius: "0% 0% 0% 91%",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        fontSize: "35",
                        color: "rgb(114 191 178)",
                        margin: "30% 45%",
                      }}
                      icon={faChartBar}
                      className="me-2"
                    />{" "}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card style={{ marginTop: "15px", height: "145px" }}>
              <Card.Body>
                <Row>
                  <Col>
                    <span
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      34
                    </span>{" "}
                    <p>Users</p>
                  </Col>
                  <Col
                    style={{
                      backgroundColor: "rgb(222 231 249)",
                      margin: "-18px -12px -4px 12px",
                      borderRadius: "0% 0% 0% 91%",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        fontSize: "35",
                        color: "rgb(119 156 230)",
                        margin: "30% 45%",
                      }}
                      icon={faUsers}
                      className="me-2"
                    />{" "}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col
            xs={3}
            className="mb-4 d-none d-sm-block"
            style={{ height: "300px" }}
          >
            <Card className="piechart" style={{ height: "300px" }}>
              <PieChart data={ragData} title={"Current Status"} />
            </Card>
          </Col>
          <Col xs={3} className="mb-4 d-none d-sm-block" height="300px">
            <Card
              className="barchart"
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BarChart data={engagements} title={"Engagement"} />
    
            </Card>
          </Col>
        </Row>
       {/* </div> */}
            {/* {loading ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : ( */}
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
                  />
                </div>
              </div>
            {/* )} */}

       </div>
    </>
  )}
