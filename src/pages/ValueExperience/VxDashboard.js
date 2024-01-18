import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import ImgIcon from "../../components/ImageIcon";
import ChartCard from "./ChartCard";
import "./VxDashboard.css";
import {
  faCertificate,
  faChartSimple,
  faCircleChevronUp,
  faCircleChevronDown,
  faDollarSign,
  faComments,
  faUserGroup,
  faUserPlus,
  faClose,
  faTrashAlt,
  faSearch,
  faBookmark,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Form, Accordion } from "@themesberg/react-bootstrap";
import BarChart from "../dashboard/BarChart";
import LineChart from "../components/LineChart";
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
import ClientIcon from "../../assets/img/icons/project-management/icon-client.svg";
import ClientTestimonialIcon from "../../assets/img/icons/testimonial-icon.svg";
import ClientSavingsIcon from "../../assets/img/icons/client-savings-icon.svg";
import AdminIcon from "../../assets/img/icons/admin-icon.svg";
import StarIcon from "../../assets/img/icons/star-icon.svg";
import ClientImplemented from "../../assets/img/icons/client-implemented-icon.svg";
import ClientRevenue from "../../assets/img/icons/client-revenue-icon.svg";
import IndustryIcon from "../../assets/img/icons/icon-industry.svg";
// import Accordion from 'react-bootstrap/Accordion';
import reset from "../../assets/img/brand/reseticon.svg";

const VxDashboard = () => {
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
  const [charLimit, setCharLimit] = useState(20);
  const [remainingChar, setRemainingChar] = useState(20);
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const navigate = useNavigate();
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState();
  const [source, setSource] = useState();
  const [sourceTitle, setSourceTitle] = useState();
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
  const [projectList, setProjectList] = useState([
    { value: null, label: "All" },
  ]);
  const [postClientList, setPostClientList] = useState([]);

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

  const [typeError, setTypeError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [revenueError, setRevenueError] = useState("");
  const [revenueClientError, setRevenueClientError] = useState("");
  const [revenueInternalError, setRevenueInternalError] = useState("");
  const [costError, setCostError] = useState("");
  const [costClientError, setCostClientError] = useState("");
  const [costInternalError, setCostInternalError] = useState("");
  const [personDaysError, setPersonDaysError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [sourceTitleError, setSourceTitleError] = useState("");

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  const [engagements, setEngagements] = useState([]);
  const [casestudies, setCasestudies] = useState([]);
  const [knowledgewise, setKnowledgewise] = useState([]);
  const [overallContribution, setOverallContribution] = useState([]);
  const [classification, setClassification] = useState([]);

  const [revenue, setRevenue] = useState();
  const [cost, setCost] = useState();
  const [revenueClient, setRevenueClient] = useState("");
  const [revenueInternal, setRevenueInternal] = useState("");
  const [costClient, setCostClient] = useState("");
  const [costInternal, setCostInternal] = useState("");
  const [personDays, setPersonDays] = useState("");

  const postArticle = () => {
    setTypeError("");
    setProjectError("");
    setCategoryError("");
    setTitleError("");
    setContentError("");
    setRevenueError("");
    setRevenueClientError("");
    setRevenueInternalError("");
    setCostError("");
    setCostClientError("");
    setCostInternalError("");
    setPersonDaysError("");
    setSourceError("");
    setSourceTitleError("");

    let revenueval = "";
    let costval = "";
    if (revenue) {
      revenueval = 0;
    } else {
      revenueval = 1;
    }
    if (cost) {
      costval = 0;
    } else {
      costval = 1;
    }

    setDisabled(true);
    let hasError = false;

    if (!type) {
      setDisabled(false);
      setTypeError("Please Choose the Type");
      hasError = true;
      // Alert("warn", "Please Choose the Type")
    }
    if (!project) {
      setDisabled(false);
      // Alert("warn", "Please Choose the Project")
      setProjectError("Please Choose the Project");
      hasError = true;
    }
    if (!category) {
      setDisabled(false);
      // Alert("warn", "Please Choose the Category")
      setCategoryError("Please Choose the Category");
      hasError = true;
    }
    if (!source) {
      setDisabled(false);
      // Alert("warn", "Please Choose the Category")
      setSourceError("Please Choose the Source");
      hasError = true;
    }
    if (!sourceTitle) {
      setDisabled(false);
      // Alert("warn", "Please Choose the Category")
      setSourceTitleError("Please Enter Source Title");
      hasError = true;
    }
    if (title === "" || title.length < 3) {
      setDisabled(false);
      // Alert("warn", "Enter title, must contain 3 characters atleast")
      setTitleError(
        "Enter Value Experience, must contain 3 characters atleast"
      );
      hasError = true;
    }
    if (content === "" || content.length < 20) {
      setDisabled(false);
      // Alert("warn", "Enter content, must contain 10 characters atleast")
      setContentError(
        "Enter Business Case, must contain 20 characters atleast"
      );
      hasError = true;
    }
    // if (!revenueClient) {
    //   setDisabled(false);
    //   // Alert("warn", "Please Choose the Category")
    //   setRevenueClientError("Please Enter Revenue Client");
    //   hasError = true;
    // }  if (!revenueInternal) {
    //   setDisabled(false);
    //   // Alert("warn", "Please Choose the Category")
    //   setRevenueInternalError("Please Enter Revenue Internal");
    //   hasError = true;
    // }  if (!costClient) {
    //   setDisabled(false);
    //   // Alert("warn", "Please Choose the Category")
    //   setCostClientError("Please Enter Cost Client");
    //   hasError = true;
    // }  if (!costInternal) {
    //   setDisabled(false);
    //   // Alert("warn", "Please Choose the Category")
    //   setCostInternalError("Please Enter Cost Internal");
    //   hasError = true;
    // }  if (!personDays) {
    //   setDisabled(false);
    //   // Alert("warn", "Please Choose the Category")
    //   setPersonDaysError("Please Enter Person Days");
    //   hasError = true;
    // }
    if (hasError) {
      setDisabled(false);
      return;
    } else {
      let status = 2;
      if (logUserId === 1) status = 1;
      let details = {
        Id: null,
        type: type,
        title: title,
        clientId: project,
        sourceId: source,
        sourceTitle: sourceTitle,
        description: content,
        articalby: logUserId,
        projectid: null,
        categoryid: category,
        statusid: status,
        UserId: logUserId,
        revenue: revenueval,
        revenueClient: revenueClient,
        revenueInternal: revenueInternal,
        cost: costval,
        costClient: costClient,
        costInternal: costInternal,
        personDays: personDays,
      };
      apiClient
        .post("/vxarticle/add", details)
        .then((response) => {
          if (response.data[0].Id) {
            setTimeout(() => {
              let serverPath = process.env.REACT_APP_API_URL;
              if (image.length > 0) {
                let err = 0;
                let cnt = image.length - 1;
                image.forEach((row, key) => {
                  let formData = new FormData();
                  formData.append("image", row);
                  formData.append("id", null);
                  formData.append("articleId", response.data[0].Id);
                  formData.append("userId", logUserId);
                  axios
                    .post(serverPath + "/kmarticle/attachment", formData)
                    .then(() => {
                      if (cnt === key) {
                        if (err) {
                          Alert("warn", "Article Save but Image not upload");
                          setDisabled(false);
                          navigate(Routes.KMArticles);
                        } else {
                          Alert("succ", "Save successfully");
                          navigate(Routes.KMArticles);
                        }
                      }
                    })
                    .catch(() => {
                      err++;
                    });
                });
              } else {
                setDisabled(false);
                Alert("succ", "Article Added");
                navigate(Routes.KMArticles);
              }
            }, 2000);
          }
        })
        .catch((error) => {
          setDisabled(false);
          Alert("error", "Please Try Again");
        });
    }
  };

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
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name });
          });
        }
        setProjectList(arr);
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
            parr.push({ value: element.id, label: element.Name });
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
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };

  const resetFilters = () => {
    setSelectVal({
      client: { value: null, label: "All" },
      project: { value: null, label: "All" },
      category: { value: null, label: "All" },
      domain: { value: null, label: "All" },
      region: { value: null, label: "All" },
      month: { value: null, label: "All" },
    });
    filterDashboard();
  };
  useEffect(() => {
    if (!isLoading && !isengageLoading && !isClientLoading) {
      resetFilters();
    }
  }, [filteredData]);

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
      setIsengageLoading(false);
    });
    apiClient.post("kmarticle/kmdashboardclientcategory", data).then((res) => {
      // if (res.data.clientwise.length > 0) {
      let carr = res.data.clientwise.map((row) => ({
        label: row.Name,
        value: row.count,
        color: "#9de6a1",
      }));
      setOverallContribution(carr);
      // }

      let colarr = ["#e96f1b", "#939393", "#e9b800", "#448bca", "#63a436"];

      // if (res.data.categorywise.length > 0) {
      let clarr = [];
      let no = 0;
      res.data.categorywise.forEach((row) => {
        let color = colarr[no];
        clarr.push({
          label: row.CategoryName,
          value: row.ArticleCount,
          color: color,
        });

        if (no === 4) no = 0;
        else no++;
      });
      setClassification(clarr);
      // }
      setIsClientLoading(false);
      setTimeout(() => {
        setIsAccordionOpen(false);
      }, 7000);
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
    // {
    //   name: "Project",
    //   selector: (param) => param.level,
    //   sortable: true,
    // },
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
    const filteredData = tableData.filter((item) =>
      item.team.toLowerCase().includes(lowerCaseValue)
    );
    setFilteredData(filteredData);
  };

  function handleExport(data) {
    // Define your custom headers
    const headers = [
      { label: "Author", key: "team" },
      { label: "Level", key: "level" },
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
        <div className="maincontent__breadcrumb">
          <img
            className="cursor_pointer"
            src={HomeOutlineIcon}
            alt="home"
            onClick={() => {
              navigate(Routes.KMDashboard);
            }}
          />
          <span className="maincontent__breadcrumb--divider">/</span>
          <span
            className="cursor_pointer"
            onClick={() => {
              navigate(Routes.KMDashboard);
            }}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </span>
          <span className="maincontent__breadcrumb--divider">/</span>
          <span className="maincontent__breadcrumb--active">Summary</span>
        </div>

        <div>
          {/* <button
            className="maincontent__btn maincontent__btn--primaryblue"
            onClick={() => setShowDefault(true)}
          >
            +Add Article
          </button> */}

          <Modal
            as={Modal.Dialog}
            centered
            show={showDefault}
            onHide={handleClose}
          >
            <div className="py-8 maincontent__postarticle">
              <div>
                <FontAwesomeIcon
                  icon={faClose}
                  onClick={handleClose}
                  style={{ borderRadius: "20px", backgroundColor: "grey" }}
                  className="cursor-pointer closeIcon"
                />
                <p className="font-bold clrBlack">Post</p>
              </div>

              <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                <div className="flex flex-col flex-1 gap-2">
                  <p>Type</p>
                  <Select
                    options={[
                      { value: "1", label: "Articles" },
                      { value: "2", label: "Case Study" },
                      { value: "3", label: "Knowledge Management" },
                      { value: "4", label: "Value Xperience" },
                    ]}
                    isDisabled={true}
                    placeholder="Select Type"
                    onChange={(selectedOption) => {
                      setType(selectedOption.value);
                      setTypeError("");
                    }}
                  />
                  {typeError && <p className="error-message">{typeError}</p>}
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <p>Client</p>
                  <Select
                    options={clientList.map((project) => ({
                      value: project.value,
                      label: project.label,
                    }))}
                    placeholder="Select Project"
                    onChange={(selectedOption) => {
                      setProject(selectedOption.value);
                      setProjectError("");
                    }}
                  />
                  {projectError && (
                    <p className="error-message">{projectError}</p>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <p>Category</p>
                  <Select
                    options={postcategoryList.map((category) => ({
                      value: category.value,
                      label: category.label,
                    }))}
                    placeholder="Select Category"
                    onChange={(selectedOption) => {
                      setCategory(selectedOption.value);
                      setCategoryError("");
                    }}
                  />
                  {categoryError && (
                    <p className="error-message">{categoryError}</p>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-2 md:col-span-1">
                  <p>Source</p>
                  <Select
                    options={postcategoryList.map((source) => ({
                      value: source.value,
                      label: source.label,
                    }))}
                    placeholder="Select Source"
                    onChange={(selectedOption) => {
                      setSource(selectedOption.value);
                      setSourceError("");
                    }}
                  />
                  {sourceError && (
                    <p className="error-message">{sourceError}</p>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-2 md:col-span-2">
                  <p>Source Title</p>
                  <input
                    type="text"
                    placeholder="Soft Skills that helped in Customer Retention"
                    className="maincontent__postarticle--input"
                    value={sourceTitle}
                    onChange={(e) => {
                      setSourceTitle(e.target.value);
                      setSourceTitleError("");
                    }}
                  />
                  {sourceTitleError && (
                    <p className="error-message">{sourceTitleError}</p>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-2 md:col-span-3">
                  <p>Value Experience</p>
                  <input
                    type="text"
                    placeholder="Soft Skills that helped in Customer Retention"
                    className="maincontent__postarticle--input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleError("");
                    }}
                  />
                  {titleError && <p className="error-message">{titleError}</p>}
                </div>
                <div className="flex flex-col flex-1 col-span-3 gap-2">
                  <p>Business Case</p>
                  <textarea
                    type="text"
                    placeholder="Type here.."
                    className="maincontent__postarticle--input"
                    value={content}
                    onChange={(e) => {
                      const inputContent = e.target.value;
                      setContent(e.target.value);
                      const remaining = charLimit - inputContent.length;
                      setRemainingChar(remaining);
                      setContentError("");
                    }}
                  />
                  {contentError && (
                    <p className="error-message">{contentError}</p>
                  )}
                  {remainingChar >= 0 ? (
                    <p style={{ color: "red" }}>
                      {remainingChar} characters remaining
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-1 gap-4 md:col-span-3">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="flex items-center gap-2 col-span-1">
                      <p>Revenue</p>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          value={revenue}
                          onChange={() => {
                            setRevenue(!revenue);
                          }}
                          checked={revenue ? 0 : 1}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center col-span-2">
                      <p>Client</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input w-9/12"
                        value={revenueClient}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (/^\d*$/.test(inputText)) {
                            setRevenueClient(inputText);
                            setRevenueClientError("");
                          }
                        }}
                      />
                      {revenueClientError && (
                        <p className="error-message">{revenueClientError}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center col-span-2">
                      <p>Internal</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input w-9/12"
                        value={revenueInternal}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (/^\d*$/.test(inputText)) {
                            setRevenueInternal(inputText);
                            setRevenueInternalError("");
                          }
                        }}
                      />
                      {revenueInternalError && (
                        <p className="error-message">{revenueInternalError}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 gap-4 md:col-span-3">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="flex gap-2 items-center col-span-1">
                      <p>Cost</p>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          value={cost}
                          onChange={() => {
                            setCost(!cost);
                          }}
                          checked={cost ? 0 : 1}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center col-span-2">
                      <p>Client</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input w-9/12"
                        value={costClient}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (/^\d*$/.test(inputText)) {
                            setCostClient(inputText);
                            setCostClientError("");
                          }
                        }}
                      />
                      {costClientError && (
                        <p className="error-message">{costClientError}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center col-span-2">
                      <p>Internal</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input w-9/12"
                        value={costInternal}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (/^\d*$/.test(inputText)) {
                            setCostInternal(inputText);
                            setCostInternalError("");
                          }
                        }}
                      />
                      {costInternalError && (
                        <p className="error-message">{costInternalError}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 gap-4 items-center md:col-span-3">
                  <p>Person Days</p>
                  <input
                    type="text"
                    className="maincontent__postarticle--input"
                    value={personDays}
                    onChange={(e) => {
                      const inputText = e.target.value;
                      if (/^\d*$/.test(inputText)) {
                        setPersonDays(inputText);
                        setPersonDaysError("");
                      }
                    }}
                  />
                  {personDaysError && (
                    <p className="error-message">{personDaysError}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mt-8">
                <div className="flex items-center flex-1 gap-2">
                  <p>Attach</p>
                  <div className="flex gap-2 ml05">
                    <ImgIcon
                      image={image}
                      setImage={setImage}
                      className="maincontent__postarticle--attachicon"
                    />
                  </div>
                </div>
              </div>

              <div>
                {image &&
                  image?.map((attachment, i) => (
                    <>
                      <div className="d-flex" key={i}>
                        <ul class="list-disc">
                          <li>
                            <span>
                              {attachment.name}
                              <FontAwesomeIcon
                                onClick={() => removeFile(i)}
                                icon={faTrashAlt}
                                style={{
                                  marginLeft: "15px",
                                  cursor: "pointer",
                                  color: "red",
                                }}
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </>
                  ))}
              </div>
              <div className="flex flex-1 justifyEnd">
                <button
                  type="button"
                  disabled={isdisabled}
                  className="maincontent__btn maincontent__btn--red"
                  onClick={postArticle}
                >
                  Post the article
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <Accordion activeKey={isAccordionOpen ? "1" : "0"} className="mt-4">
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={toggleAccordion}>SEARCH</Accordion.Header>
          <Accordion.Body style={{ visibility: "visible", color: "#1658a0" }}>
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-4"
              style={{ width: "97%" }}
            >
              <Form.Group id="client">
                <Form.Label>Client</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={ClientIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    options={clientList.map((client) => ({
                      value: client.value,
                      label: client.label,
                    }))}
                    placeholder="Select Client"
                    value={selectVal.client}
                    onChange={(e) => {
                      selectVal.client = e;
                      filterDashboard();
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="project">
                <Form.Label>Industry</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={IndustryIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    options={projectList.map((project) => ({
                      value: project.value,
                      label: project.label,
                    }))}
                    placeholder=""
                    value={selectVal.project}
                    onChange={(e) => {
                      selectVal.project = e;
                      filterDashboard();
                    }}
                  />
                </div>
              </Form.Group>

              <Form.Group id="category">
                <Form.Label>Category</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <img
                        src={ClientIcon}
                        alt="client name"
                        className="input-icon"
                      />
                    </span>
                  </div>
                  <Select
                    options={categoryList.map((category) => ({
                      value: category.value,
                      label: category.label,
                    }))}
                    placeholder=""
                    value={selectVal.category}
                    onChange={(e) => {
                      selectVal.category = e;
                      filterDashboard();
                    }}
                  />
                </div>
              </Form.Group>

              <div>
                <Form.Group id="domain">
                  <Form.Label>VA Category</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <img
                          src={ClientIcon}
                          alt="client name"
                          className="input-icon"
                        />
                      </span>
                    </div>
                    <Select
                      options={domainList.map((domain) => ({
                        value: domain.value,
                        label: domain.label,
                      }))}
                      placeholder=""
                      value={selectVal.domain}
                      onChange={(e) => {
                        selectVal.domain = e;
                        filterDashboard();
                      }}
                    />
                  </div>
                </Form.Group>

                <img
                  className="resetIconKM"
                  style={{ color: "#1658a0", cursor: "pointer" }}
                  title="Reset"
                  src={reset}
                  onClick={() => {
                    resetFilters();
                    filterDashboard();
                  }}
                />
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* </div>
      </div> */}
      <div className="flex flex-col gap-4 mt-4 md:flex-row md:justify-between">
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader">
              <div className="flex flex-col w75">
                <p className="bb1" style={{ paddingBottom: "5px" }}>
                  <strong>{cardValue.totalarticle} Cost</strong>
                  {cardValue.articale_status === " Increase " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronUp}
                      className="ml-4 clrGreen"
                    />
                  ) : cardValue.articale_status === " Decrease " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronDown}
                      className="ml-4 clrRed"
                    />
                  ) : null}

                  {/* <strong className="ml1 pb05"> Articles </strong> */}
                </p>
                <span
                  className="span_text"
                  style={{ paddingTop: "2px", fontSize: "10px" }}
                >
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
                </span>
                {/* <span
                  className="bb1 pb05 span_text"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingBottom: "2px"
                  }}
                >
                  Articles
                </span> */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between mt1">
                  <>
                    <span className="span_text" title="Implemented for Client">
                      <img src={ClientImplemented} className="w-4" /> 35
                    </span>
                    <span className="span_text" title="Client Testimonial ">
                      <img src={ClientRevenue} className="w-4" /> 35
                    </span>
                    <span className="span_text" title="Client Savings">
                      <FontAwesomeIcon icon={faDollarSign} /> 35
                    </span>
                  </>
                </div>
              </div>
              <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-green"></div>
              <img
                src={ArticlesIcon}
                className="maincontent__card--content-icon maincontent__card--content-icon-green"
              />
            </div>
          </>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader">
              <div className="flex flex-col w75">
                <p className="bb1" style={{ paddingBottom: "5px" }}>
                  <strong>{cardValue.casestudies} Revenue</strong>
                  {cardValue.casestudies_status === " Increase " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronUp}
                      className="ml-4 clrGreen"
                    />
                  ) : cardValue.casestudies_status === " Decrease " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronDown}
                      className="ml-4 clrRed"
                    />
                  ) : null}

                  {/* <strong className="ml1 pb05"> Case Studies </strong> */}
                </p>
                <span
                  className="span_text"
                  style={{ paddingTop: "2px", fontSize: "10px" }}
                >
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
                </span>
                {/* <span
                  className="bb1 pb05 span_text"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingBottom: "2px"
                  }}
                >
                  Case Studies
                </span> */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between mt1">
                  <>
                    <span className="span_text" title="Implemented for Client">
                      <img src={ClientImplemented} className="w-4" />
                      35
                    </span>
                    <span className="span_text" title="Client Testimonial ">
                      <img src={ClientRevenue} className="w-4" /> 35
                    </span>
                    <span className="span_text" title="Client Savings">
                      <FontAwesomeIcon icon={faDollarSign} /> 35
                    </span>
                  </>
                </div>
              </div>
              <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-blue"></div>
              <img
                src={CaseStudiesIcon}
                className="maincontent__card--content-icon maincontent__card--content-icon-blue"
              />
            </div>
          </>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader">
              <div className="flex flex-col w75">
                <p className="bb1" style={{ paddingBottom: "5px" }}>
                  <strong>{cardValue.bestpractices} Efforts in PDs</strong>
                  {cardValue.bestpractices_status === " Increase " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronUp}
                      className="ml-4 clrGreen"
                    />
                  ) : cardValue.bestpractices_status === " Decrease " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronDown}
                      className="ml-4 clrRed"
                    />
                  ) : null}

                  {/* <strong className="ml1 pb05"> Best Practices </strong> */}
                </p>
                <span
                  className="span_text"
                  style={{ paddingTop: "2px", fontSize: "10px" }}
                >
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
                </span>
                {/* <span
                  className="bb1 pb05 span_text"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingBottom: "2px"
                  }}
                >
                  Best Practices
                </span> */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between mt1">
                  <>
                    <span className="span_text" title="Implemented for Client">
                      <img src={ClientImplemented} className="w-4" />
                      35
                    </span>
                    <span className="span_text" title="Client Testimonial ">
                      <img src={ClientRevenue} className="w-4" /> 35
                    </span>
                    <span className="span_text" title="Client Savings">
                      <FontAwesomeIcon icon={faDollarSign} /> 35
                    </span>
                  </>
                </div>
              </div>
              <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-orange"></div>
              <img
                src={BestPracticesIcon}
                className="maincontent__card--content-icon maincontent__card--content-icon-orange"
              />
            </div>
          </>
        )}
        {isLoading ? (
          <div class="circle__loader"></div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden text-black maincontent__card--content maincontent__card--content-woheader">
              <div className="flex flex-col w75">
                <p className="bb1" style={{ paddingBottom: "5px" }}>
                  <strong>{cardValue.bestpractices} Value Adds</strong>
                  {cardValue.bestpractices_status === " Increase " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronUp}
                      className="ml-4 clrGreen"
                    />
                  ) : cardValue.bestpractices_status === " Decrease " ? (
                    <FontAwesomeIcon
                      icon={faCircleChevronDown}
                      className="ml-4 clrRed"
                    />
                  ) : null}

                  {/* <strong className="ml1 pb05"> Best Practices </strong> */}
                </p>
                <span
                  className="span_text"
                  style={{ paddingTop: "2px", fontSize: "10px" }}
                >
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
                </span>
                {/* <span
                  className="bb1 pb05 span_text"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    paddingBottom: "2px"
                  }}
                >
                  Best Practices
                </span> */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between mt1">
                  <>
                    <span className="span_text" title="Implemented for Client">
                      <img src={ClientImplemented} className="w-4" />
                      35
                    </span>
                    <span className="span_text" title="Client Testimonial ">
                      <img src={ClientRevenue} className="w-4" /> 35
                    </span>
                    <span className="span_text" title="Client Savings">
                      <FontAwesomeIcon icon={faDollarSign} /> 35
                    </span>
                  </>
                </div>
              </div>
              <div className="maincontent__card--content-circleWithIcon maincontent__card--content-circleWithIcon-orange"></div>
              <img
                src={BestPracticesIcon}
                className="maincontent__card--content-icon maincontent__card--content-icon-orange"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4 md:grid md:grid-cols-3 maincontent__card--kmDashboard-summaryrow">
        <div
          className="w-full dashboard-graph-section"
          align="center"
          style={{ height: "auto" }}
        >
          {isengageLoading ? (
            <div class="circle__loader"></div>
          ) : (
            <ChartCard title="Engagement Summary">
              <LineChart
                data={engagements}
                casedata={casestudies}
                knowdata={knowledgewise}
                title={"Articles"}
              />
            </ChartCard>
          )}
        </div>
        <div
          className="w-full dashboard-graph-section"
          align="center"
          style={{ height: "auto" }}
        >
          {isClientLoading ? (
            <div class="circle__loader"></div>
          ) : (
            <ChartCard title="Overall Contribution">
              <BarChart data={overallContribution} title={"Articles"} />
            </ChartCard>
          )}
        </div>
        <div
          className="w-full dashboard-graph-section"
          align="center"
          style={{ height: "auto" }}
        >
          {isClientLoading ? (
            <div class="circle__loader"></div>
          ) : (
            <ChartCard title="Category Classification">
              <PieChart data={classification} title={""} />
            </ChartCard>
          )}
        </div>
        <div className="col-span-3 maincontent__card maincontent__card--kmDashboard-contribution newContri">
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
                    placeholder="Search"
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VxDashboard;
