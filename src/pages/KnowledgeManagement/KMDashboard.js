import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import axios from "axios";
import ImgIcon from "../../components/ImageIcon";
import ChartCard from "./ChartCard";
import "./KMDashboard.css";
import PostArtifact from "../components/PostArtifact";
import {
  faCertificate,
  faChartSimple,
  faCircleChevronUp,
  faCircleChevronDown,
  faFileExcel,
  faUserGroup,
  faPenToSquare,
  faUserPlus,
  faTrashAlt,
  faMedal,
  faClose,
  faSearch,
  faBookBookmark,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Form, Accordion } from "@themesberg/react-bootstrap";
import KMStackedBarChart2 from "./KMStackedBarChart2";
import LineChart2 from "../components/LineChart2";
import DataTable from "react-data-table-component";
import PieChart from "../components/PieChart";
import PieChart1 from "../components/PieChart1";
import { Link } from "react-router-dom";
import SearchIcon from "../../assets/img/icons/search-icon.svg";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import Papa from "papaparse";
import excelicon from "../../assets/img/brand/excelicon.svg";
import ArticlesIcon from "../../assets/img/icons/articles-icon.svg";
import CaseStudiesIcon from "../../assets/img/icons/case-study-icon.svg";
import BestPracticesIcon from "../../assets/img/icons/best-practices-icon.svg";
import UsersIcon from "../../assets/img/icons/users-icon.svg";
import ActiveUsersIcon from "../../assets/img/icons/active-users-icon.svg";
import ClientIcon from "../../assets/img/icons/client-icon.svg";
import ClientTestimonialIcon from "../../assets/img/icons/testimonial-icon.svg";
import ClientSavingsIcon from "../../assets/img/icons/client-savings-icon.svg";
import AdminIcon from "../../assets/img/icons/admin-icon.svg";
import StarIcon from "../../assets/img/icons/star-icon.svg";
import ClientImplementedRedIcon from "../../assets/img/icons/client-implemented-red-icon.svg";
import ClientRevenueGreenIcon from "../../assets/img/icons/client-revenue-green-icon.svg";
import reset from "../../assets/img/brand/reseticon.svg";
// import Accordion from 'react-bootstrap/Accordion';
const KMDashboard1 = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);

  const [postClientList, setPostClientList] = useState([]);

  const [showDefault, setShowDefault] = useState(false);
  const [ShowDef, setShowDef] = useState(false);
  let [lastmonthArticleCount, setLastMonthArticleCount] = useState(0);
  let [lastUsersCount, setLastUsersCount] = useState(0);
  let [lastCaseStudyCount, setLastCaseStudyCount] = useState(0);
  let [lastBPCount, setLastBPCount] = useState(0);
  let [isLoading, setIsLoading] = useState(true);
  let [isengageLoading, setIsengageLoading] = useState(true);
  let [isClientLoading, setIsClientLoading] = useState(true);
  let [cardValue, setCardValue] = useState({
    totalusers: 0,
    activeusers: 0,
    starproject: "",
    totalarticle: 0,
    casestudies: 0,
    bestpractices: 0,
    starofmonth: "",
    article_percent: 0,
    articale_status: "",
    user_percent: 0,
    user_status: "",
    case_percent: 0,
    casestudies_status: "",
    practice_percent: 0,
    bestpractices_status: "",
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  const [charLimit, setCharLimit] = useState(200);
  const [remainingChar, setRemainingChar] = useState(200);
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const navigate = useNavigate();
  const [logUserId] = useState(state.user.Id);
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState();
  const [type, setType] = useState();
  const [tableData, setTableData] = useState([]);
  let [filteredData, setFilteredData] = useState(tableData);
  const [isdisabled, setDisabled] = useState(false);
  const [categoryList, setCategoryList] = useState([
    { value: null, label: "All" },
  ]);

  const [postcategoryList, setPostCategoryList] = useState([]);
  const [domainList, setDomainList] = useState([{ value: null, label: "All" }]);
  const [regionList, setRegionList] = useState([{ value: null, label: "All" }]);
  const [project, setProject] = useState();
  const [clients, setClients] = useState();
  const [projectList, setProjectList] = useState([
    { value: null, label: "All" },
  ]);
  const [postProjectList, setPostProjectList] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  let [topContributorslist, setTopContributorslist] = useState([]);

  const [clientList, setClientList] = useState([{ value: null, label: "All" }]);
  const currentDate = new Date();
  const newMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const newYear = currentDate.getFullYear().toString();
  let [month, setMonth] = useState(`${newYear}-${newMonth}`);
  const [selectVal, setSelectVal] = useState({
    client: { value: null, label: "All" },
    project: { value: null, label: "All" },
    category: { value: null, label: "All" },
    domain: { value: null, label: "All" },
    region: { value: null, label: "All" },
    month: { value: null, label: "All" },
  });

  const [engagements, setEngagements] = useState([]);
  const [vxcount, setvxcount] = useState([]);
  const [casestudies, setCasestudies] = useState([]);
  const [knowledgewise, setKnowledgewise] = useState([]);
  const [overallContribution, setOverallContribution] = useState([]);
  const [classification, setClassification] = useState([]);

  useEffect(() => {
    isLoading = true;
    //for category dropdown
    apiClient
      .get("/lookup/ArticalCategory/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let carr = [];
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
            carr.push({ value: element.Id, label: element.Name });
          });
        }
        setCategoryList(arr);
        setPostCategoryList(carr);
      })
      .catch(() => {
        Alert("error", "Please Try Again");
      });

    apiClient
      .get("/lookup/domain/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
          });
        }
        setDomainList(arr);
      })
      .catch(() => {
        Alert("error", "Please Try Again");
      });

    apiClient
      .get("/lookup/DeliveryLocation/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
          });
        }
        setRegionList(arr);
      })
      .catch(() => {
        Alert("error", "Please Try Again");
      });

    apiClient
      .post("project/searchall", {})
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let parr = [];
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name });
            parr.push({ value: element.id, label: element.Name });
          });
        }
        setProjectList(arr);
        setPostProjectList(parr);
      })
      .catch(() => {});

    apiClient
      .post("kmarticle/topContributors")
      .then((res) => {
        setTopContributorslist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0",
      })
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let parr = [];
        if (response.data.client.length > 0) {
          response.data.client.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
            parr.push({ value: element.Id, label: element.Name });
          });
        }
        setClientList(arr);
        setPostClientList(parr);
      })
      .catch((error) => {
        Alert("error", "Please Try Again");
      });
    filterDashboard();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      // Reset the table back to the original data
      setFilteredData(tableData);
    } else {
      // Filter the data based on the search value
      filterData(value);
    }
  };

  const resetFilters = () => {
    setIsLoading(true); // Add loading state while resetting
    setIsengageLoading(true);
    setIsClientLoading(true);
    selectVal.client.value = null;
    selectVal.project.value = null;
    selectVal.category.value = null;
    selectVal.domain.value = null;
    selectVal.region.value = null;
    setSelectVal({
      client: { value: null, label: "All" },
      project: { value: null, label: "All" },
      category: { value: null, label: "All" },
      domain: { value: null, label: "All" },
      region: { value: null, label: "All" },
    });
    month = `${newYear}-${newMonth}`;
    setMonth(`${newYear}-${newMonth}`);
    setTimeout(() => {
      filterDashboard();
    }, 2000);
  };

  useEffect(() => {
    if (!isLoading && !isengageLoading && !isClientLoading) {
      resetFilters();
    }
  }, []);

  // useEffect(()=>{
  //   filterDashboard();
  // }, [selectVal])
  const filterDashboard = () => {
    setIsLoading(true);
    setIsengageLoading(true);
    setIsClientLoading(true);
    let lastMonth,
      lastYear = null;
    if (month) {
      const lastMonthDate = new Date(month);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      lastMonth = lastMonthDate.getMonth() + 1;
      lastYear = lastMonthDate.getFullYear();
    }
    let pmonth,
      pyear = null;
    if (month.split("-")[1]) pmonth = month.split("-")[1];
    if (month.split("-")[0]) pyear = month.split("-")[0];
    const data = {
      month: pmonth,
      year: pyear,
      lastMonth: lastMonth,
      lastYear: lastYear,
      projectId: selectVal.project.value,
      ClientId: selectVal.client.value,
      CategoryId: selectVal.category.value,
      domainId: selectVal.domain.value,
      regionId: selectVal.region.value,
    };
    apiClient.post("kmarticle/kmdashboard", data).then((res) => {
      let kmartical = res.data.kmartical[0];
      //Total Article
      let totalarticle = kmartical.totalarticle;
      let totalarticle_precent = kmartical.totalarticle_precent;
      setLastMonthArticleCount(kmartical.totalarticle_precent);
      let articale_status = "";
      if (totalarticle_precent === 0) {
        articale_status = "";
      } else {
        let value =
          ((totalarticle - totalarticle_precent) / totalarticle_precent) * 100;
        if (value < 0) {
          articale_status = " Decrease ";
        } else {
          articale_status = " Increase ";
        }
        totalarticle_precent = Number(Math.abs(value)).toFixed(0);
      }

      //Total Users
      let totalusers = kmartical.totalusers;
      let totalusers_precent = kmartical.totalusers_precent;
      setLastUsersCount(kmartical.totalusers_precent);
      let user_status = "";
      if (totalusers_precent === 0) {
        user_status = "";
      } else {
        let value =
          ((totalusers - totalusers_precent) / totalusers_precent) * 100;
        if (value < 0) {
          user_status = " Decrease ";
        } else {
          user_status = " Increase ";
        }
        totalusers_precent = Number(Math.abs(value)).toFixed(0);
      }

      //Case Studies
      let casestudies = kmartical.casestudies;
      let casestudies_precent = kmartical.casestudies_precent;
      setLastCaseStudyCount(kmartical.casestudies_precent);
      let casestudies_status = "";
      if (casestudies_precent === 0) {
        casestudies_status = "";
      } else {
        let value =
          ((casestudies - casestudies_precent) / casestudies_precent) * 100;
        if (value < 0) {
          casestudies_status = " Decrease ";
        } else {
          casestudies_status = " Increase ";
        }
        casestudies_precent = Number(Math.abs(value)).toFixed(0);
      }

      //Best Practices
      let bestpractices = kmartical.bestpractices;
      let bestpractices_precent = kmartical.bestpractices_precent;
      setLastBPCount(kmartical.bestpractices_precent);
      let bestpractices_status = "";
      if (bestpractices_precent === 0) {
        bestpractices_status = "";
      } else {
        let value =
          ((bestpractices - bestpractices_precent) / bestpractices_precent) *
          100;
        if (value < 0) {
          bestpractices_status = " Decrease ";
        } else {
          bestpractices_status = " Increase ";
        }
        bestpractices_precent = Number(Math.abs(value)).toFixed(0);
      }

      const updatedCardValue = {
        totalusers: totalusers || 0,
        activeusers: kmartical.activeusers || 0,
        totalarticle: totalarticle || 0,
        casestudies: casestudies || 0,
        starproject: kmartical.starproject || "",
        bestpractices: bestpractices || 0,
        starofmonth: kmartical.starofmonth || "",
        article_percent: totalarticle_precent || 0,
        articale_status: articale_status,
        user_percent: totalusers_precent || 0,
        user_status: user_status,
        case_percent: casestudies_precent || 0,
        casestudies_status: casestudies_status,
        practice_percent: bestpractices_precent || 0,
        bestpractices_status: bestpractices_status,
      };
      setCardValue(updatedCardValue);
      setFilteredData(res.data.teamcontribution);
      setTableData(res.data.teamcontribution);
      setIsLoading(false);
    });

    apiClient.post("kmarticle/kmdashboardcasestudies", data).then((res) => {
      if (res.data.engagement.length > 0) {
        let earr = res.data.engagement.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1",
        }));
        setEngagements(earr);
      }

      if (res.data.casestudies.length > 0) {
        let earr = res.data.casestudies.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1",
        }));
        setCasestudies(earr);
      }

      if (res.data.knowledgewise.length > 0) {
        let earr = res.data.knowledgewise.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1",
        }));
        setKnowledgewise(earr);
      }

      if (res.data.vx.length > 0) {
        let earr = res.data.vx.map((row) => ({
          label: row.month,
          value: row.count,
          color: "#9de6a1",
        }));
        setvxcount(earr);
      }
      setIsengageLoading(false);
    });
    apiClient.post("kmarticle/kmdashboardclientcategory", data).then((res) => {
      // if (res.data.clientwise.length > 0) {
      let carr = res.data.clientwise.map((row) => ({
        id: 2,
        label: row.Name,
        value: row.article,
        value1: row.casestudy,
        value2: row.km,
        value3: row.vx,
        color: "rgb(5 3 70)",
      }));
      setOverallContribution(carr);
      // }

      let colarr = ["#b44555", "#9bc55b", "#7c5ea0", "#54b5c5", "#eb954f"];

      // if (res.data.categorywise.length > 0) {
      let clarr = [];
      let no = 0;
      res.data.categorywise.forEach((row) => {
        let color = colarr[no];
        clarr.push({
          label: row.CategoryName,
          value: Math.floor(row.ArticleCount),
          color: color,
        });

        if (no === 4) no = 0;
        else no++;
      });
      setClassification(clarr);
      setIsClientLoading(false);
      // }
    });
  };

  const columns = [
    {
      name: "Author",
      selector: (param) => param.team,
      sortable: true,
      filter: (
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearch}
        />
      ),
    },
    {
      name: "Project",
      selector: (param) => param.ProjectName,
      sortable: true,
    },
    {
      name: "Client",
      selector: (param) => param.ClientName,
      sortable: "true",
    },
    {
      name: "Total",
      selector: (param) => param.totalpublished,
      sortable: "true",
    },
    {
      name: "Submitted",
      selector: (param) => param.current_submitted,
      sortable: "true",
    },
    {
      name: "Published",
      selector: (param) => param.current_published,
      sortable: "true",
    },
  ];

  // const headerCellStyle = {
  //   padding: '0px', // Set the padding to 0 to remove it
  // };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filtereddData = tableData.filter(
      (item) =>
        item.team.toLowerCase().includes(lowerCaseValue) ||
        item.ProjectName.toLowerCase().includes(lowerCaseValue) ||
        item.ClientName.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredData(filtereddData);
  };

  function handleExport(data) {
    // Define your custom headers
    const headers = [
      { label: "Author", key: "team" },
      // { label: "Level", key: "level" },
      { label: "Project Name", key: "ProjectName" },
      { label: "Client Name", key: "ClientName" },
      { label: "Total Published", key: "totalpublished" },
      { label: "No. of Posts submitted", key: "current_submitted" },
      { label: "No. of Posts Published", key: "current_published" },
    ];

    // Prepare the data for export
    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key]);
        else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );
    // Convert the data to CSV format
    const csvData = Papa.unparse(exportData);

    // Create a Blob object and save the file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Article Contribution Summary.csv");
  }
  const removeFile = (i) => {
    let sno = 0;
    let resarr = [];
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row;
    });
    setImage(resarr);
  };

  return (
    <>
      <div className="flex items-center justify-between">
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
            <span
              className="cursor_pointer"
              onClick={() => {
                navigate(state.defaultpage);
              }}
            >
              Dashboard
            </span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">Summary</span>
          </div>
        )}

        <PostArtifact design={true} />
      </div>

      <Accordion activeKey={isAccordionOpen ? "1" : "0"} className="mt-2">
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={toggleAccordion}>Search</Accordion.Header>
          <Accordion.Body style={{ visibility: "visible", color: "#1658a0" }}>
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6"
              style={{ width: "97%" }}
            >
              <Form.Group id="client">
                <Form.Label>Client</Form.Label>
                <Select
                  options={clientList.map((client) => ({
                    value: client.value,
                    label: client.label,
                  }))}
                  placeholder="Select Client"
                  value={selectVal.client}
                  onChange={(e) => {
                    selectVal.client = e;
                    setSelectVal({ ...selectVal, client: e });
                    filterDashboard();
                    // setTimeout(() => {
                    //   setIsAccordionOpen(false);
                    // }, 7000);
                  }}
                />
              </Form.Group>

              <Form.Group id="project">
                <Form.Label>Project</Form.Label>
                <Select
                  options={projectList.map((project) => ({
                    value: project.value,
                    label: project.label,
                  }))}
                  placeholder=""
                  value={selectVal.project}
                  onChange={(e) => {
                    selectVal.project = e;
                    setSelectVal({ ...selectVal, project: e });
                    filterDashboard();
                    // setTimeout(() => {
                    //   setIsAccordionOpen(false);
                    // }, 7000);
                  }}
                />
              </Form.Group>

              <Form.Group id="category">
                <Form.Label>Category</Form.Label>
                <Select
                  options={categoryList.map((category) => ({
                    value: category.value,
                    label: category.label,
                  }))}
                  placeholder=""
                  value={selectVal.category}
                  onChange={(e) => {
                    selectVal.category = e;
                    setSelectVal({ ...selectVal, category: e });
                    filterDashboard();
                    // setTimeout(() => {
                    //   setIsAccordionOpen(false);
                    // }, 7000);
                  }}
                />
              </Form.Group>

              <Form.Group id="domain">
                <Form.Label>Domain</Form.Label>
                <Select
                  options={domainList.map((domain) => ({
                    value: domain.value,
                    label: domain.label,
                  }))}
                  placeholder=""
                  value={selectVal.domain}
                  onChange={(e) => {
                    selectVal.domain = e;
                    setSelectVal({ ...selectVal, domain: e });
                    filterDashboard();
                    // setTimeout(() => {
                    //   setIsAccordionOpen(false);
                    // }, 7000);
                  }}
                />
              </Form.Group>

              <Form.Group id="region">
                <Form.Label>Region</Form.Label>
                <Select
                  options={regionList.map((region) => ({
                    value: region.value,
                    label: region.label,
                  }))}
                  placeholder=""
                  value={selectVal.region}
                  onChange={(e) => {
                    selectVal.region = e;
                    setSelectVal({ ...selectVal, region: e });
                    filterDashboard();
                    // setTimeout(() => {
                    //   setIsAccordionOpen(false);
                    // }, 7000);
                  }}
                />
              </Form.Group>

              <div>
                <Form.Group id="project">
                  <Form.Label>Period</Form.Label>
                  <Form.Control
                    required
                    type="month"
                    value={month}
                    placeholder="mm/dd/yyyy"
                    onChange={(e) => {
                      month = e.target.value;
                      setMonth(e.target.value);
                      filterDashboard();
                      // setTimeout(() => {
                      //   setIsAccordionOpen(false);
                      // }, 7000);
                    }}
                  />
                </Form.Group>

                <img
                  className="resetIconKM"
                  style={{ color: "#1658a0", cursor: "pointer" }}
                  title="Reset"
                  src={reset}
                  onClick={() => {
                    resetFilters();
                  }}
                />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "10px", marginTop: "4px" }}
      >
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>{cardValue.totalarticle}</strong>
                {cardValue.articale_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.articale_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Articles
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalarticle === lastmonthArticleCount
                      ? "No Change from Last Month"
                      : cardValue.articale_status
                      ? cardValue.article_percent +
                        "%" +
                        cardValue.articale_status +
                        " from last month"
                      : "Last month total article was " + lastmonthArticleCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-green"></div>
            <img
              src={ArticlesIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-green"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>{cardValue.casestudies}</strong>
                {cardValue.casestudies_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.casestudies_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Case Studies
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.casestudies === lastCaseStudyCount
                      ? "No Change from Last Month"
                      : cardValue.casestudies_status
                      ? cardValue.case_percent +
                        "% " +
                        cardValue.casestudies_status +
                        " from last month"
                      : "Last month total case studies was " +
                        lastCaseStudyCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-blue"></div>
            <img
              src={CaseStudiesIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-blue"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>{cardValue.bestpractices}</strong>
                {cardValue.bestpractices_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.bestpractices_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Best Practices
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.bestpractices === lastBPCount
                      ? "No Change from Last Month"
                      : cardValue.bestpractices_status
                      ? cardValue.practice_percent +
                        "% " +
                        cardValue.bestpractices_status +
                        " from last month"
                      : "Last month total best practice was " + lastBPCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-orange"></div>
            <img
              src={BestPracticesIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-orange"
            />
          </div>
        )}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "10px", marginTop: "10px" }}
      >
        {/* {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75 text-center">
              <p>
                <strong>{cardValue.totalusers}</strong>
              </p>
              Users
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-limegreen"></div>
            <img
              src={UsersIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-blue"
            />
          </div>
        )} */}
        {/* {cardValue.user_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.user_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null} */}
        {/* <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                className="pb05 span_text"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              > */}
        {/* </span> */}
        {/* <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalusers === lastUsersCount
                      ? "No Change from Last Month"
                      : cardValue.user_status
                      ? cardValue.user_percent +
                        "% " +
                        cardValue.user_status +
                        " from last month"
                      : "Last month total user was " + lastUsersCount}
                  </>
                )}
              </span> */}

        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75 text-center">
              <p>
                <strong className="bbl">{cardValue.totalusers}</strong> Users{" "}
                <br></br> <strong>{cardValue.activeusers}</strong> Active Users
                {/* {cardValue.user_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.user_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null} */}
              </p>
              {/* <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                className="pb05 span_text"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              > */}
              {/* </span> */}
              {/* <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalusers === lastUsersCount
                      ? "No Change from Last Month"
                      : cardValue.user_status
                      ? cardValue.user_percent +
                        "% " +
                        cardValue.user_status +
                        " from last month"
                      : "Last month total user was " + lastUsersCount}
                  </>
                )}
              </span> */}
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-skyblue"></div>
            <img
              src={ActiveUsersIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-blue"
            />
          </div>
        )}

        {/* {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>{cardValue.totalusers}</strong>
                {cardValue.user_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.user_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Client Implemented
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalusers === lastUsersCount
                      ? "No Change from Last Month"
                      : cardValue.user_status
                      ? cardValue.user_percent +
                        "% " +
                        cardValue.user_status +
                        " from last month"
                      : "Last month total user was " + lastUsersCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-maroon"></div>
            <img
              src={ClientImplementedRedIcon}
              style={{ width: "25px" }}
              className="maincontent__card--content-icon maincontent__card--content-icon-blue"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem", zIndex: "0" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>₹ {cardValue.totalusers}.5 L</strong>
                {cardValue.user_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.user_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Client Revenue
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalusers === lastUsersCount
                      ? "No Change from Last Month"
                      : cardValue.user_status
                      ? cardValue.user_percent +
                        "% " +
                        cardValue.user_status +
                        " from last month"
                      : "Last month total user was " + lastUsersCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-aqua"></div>
            <img
              src={ClientRevenueGreenIcon}
              style={{ width: "29px" }}
              className="maincontent__card--content-icon maincontent__card--content-icon-aqua"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75">
              <p>
                <strong>₹{cardValue.totalusers} L</strong>
                {cardValue.user_status === " Increase " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronUp}
                    className="clrGreen ml1"
                  />
                ) : cardValue.user_status === " Decrease " ? (
                  <FontAwesomeIcon
                    icon={faCircleChevronDown}
                    className="clrRed ml1"
                  />
                ) : null}
              </p>
              <span
                className={month ? "bb1 pb05 span_text" : "pb05 span_text"}
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  paddingBottom: "2px",
                }}
              >
                Client Savings
              </span>
              <span
                className="span_text"
                style={{ paddingTop: "2px", fontSize: "9px" }}
              >
                {month && (
                  <>
                    {cardValue.totalusers === lastUsersCount
                      ? "No Change from Last Month"
                      : cardValue.user_status
                      ? cardValue.user_percent +
                        "% " +
                        cardValue.user_status +
                        " from last month"
                      : "Last month total user was " + lastUsersCount}
                  </>
                )}
              </span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-yellow"></div>
            <img
              src={ClientSavingsIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-blue"
            />
          </div>
        )} */}

        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75 text-center">
              <p>
                <strong>{cardValue.starofmonth}</strong>
              </p>
              <span>Star of the month</span>
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-purple"></div>
            <img
              src={AdminIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-red"
            />
          </div>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <div
            className="overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader"
            style={{ padding: "1.5rem 10px 1.5rem 1rem" }}
          >
            <div className="flex flex-col w75 text-center">
              <p>
                <strong>{cardValue.starproject}</strong>
              </p>
              <span>Star Project</span>
              {/* <p>{cardValue.article_percent}% Increase from last month</p> */}
            </div>
            <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-litepurple"></div>
            <img
              src={StarIcon}
              className="maincontent__card--content-icon maincontent__card--content-icon-orange"
            />
          </div>
        )}
      </div>

      <div
        className="flex flex-col md:grid md:grid-cols-3 maincontent__card--kmDashboard-summaryrow"
        style={{ gap: "10px", marginTop: "10px" }}
      >
        <div className="w-full text-center dashboard-graph-section">
          {isengageLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Engagement Summary">
              <LineChart2
                data={engagements}
                casedata={casestudies}
                knowdata={knowledgewise}
                // vx={vxcount}
                title={"Artifacts"}
              />
            </ChartCard>
          )}
        </div>
        <div className="w-full text-center dashboard-graph-section">
          {isClientLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Overall Contribution">
              <KMStackedBarChart2
                data={overallContribution}
                title={"Artifacts"}
              />
            </ChartCard>
          )}
        </div>
        <div className="w-full text-center dashboard-graph-section">
          {isClientLoading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <ChartCard title="Category Classification">
              <PieChart1 data={classification} title={""} />
            </ChartCard>
          )}
        </div>
        <div className="w-full lg:col-span-2 md:col-span-3 maincontent__card maincontent__card--kmDashboard-contribution newContri">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">
              Contribution Summary
            </h2>
          </div>

          <div className="w-full maincontent__card--content">
            <div className="maincontent__card--tableheader">
              <div className="maincontent__card--tableheader-right">
                <div className="search-containerKMArti kmarticle-seactform">
                  <input
                    type="search"
                    placeholder="Search by author,project,name"
                    className="searchArtiInput w-full"
                    value={searchValue}
                    onChange={handleSearch}
                  />
                </div>
                <Link className="flexVerandHorCenter">
                  {/* <FontAwesomeIcon
                    icon={faFileExcel}
                    onClick={() => handleExport(filteredData)}
                    className="maincontent__faIcon maincontent__faIcon--redcolor"
                  /> */}
                  <img
                    src={excelicon}
                    style={{ width: "35px" }}
                    onClick={() => handleExport(filteredData)}
                    className="maincontent__faIcon maincontent__faIcon--redcolor"
                  ></img>
                </Link>
              </div>
            </div>
            <div align="center">
              {isLoading ? (
                <div class="circle__loader"></div>
              ) : (
                <DataTable
                  title=""
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  paginationPerPage={5}
                  highlightOnHover
                  className="mt-4 kmdash_cont_table"
                  defaultSortField="team" // Set the default sorting by "ProjectName" column
                  defaultSortAsc={true}
                />
              )}
            </div>
          </div>
        </div>

        <div className="maincontent__card lg:col-span-1 md:col-span-3">
          <div className="maincontent__card--header">
            <p className="maincontent__card--header-title">Top Contributors</p>
          </div>
          <div className="maincontent__card--content">
            {topContributorslist.map((row) => {
              return (
                <>
                  <div className="maincontent__card--kmDashboard-contributors">
                    <div className="flex gap-4">
                      <img
                        src={row.profile ? row.profile : ProfilePic}
                        alt="Profile Picture"
                        className="maincontent__card--kmDashboard-contributorsPic"
                      />
                      <div className="flex flex-col">
                        <span className="mt-2 font-semibold clrBlue">
                          {row.ArticleName} {"  "}
                          <FontAwesomeIcon
                            icon={faMedal}
                            className={
                              row.level === "Expert"
                                ? "clrGreen"
                                : row.level === "Intermediate"
                                ? "clrAmber"
                                : "clrPurple"
                            }
                          />
                        </span>
                      </div>
                    </div>
                    <span className="maincontent__card--kmDashboard-posttag">
                      {row.totalartical} posts
                    </span>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(KMDashboard1);
