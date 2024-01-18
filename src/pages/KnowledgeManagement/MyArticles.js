import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "react-toggle/style.css";
import DataTable from "react-data-table-component";
import apiClient from "../../common/http-common";
import { Card } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Routes } from "../../routes";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import DownloadIcon from "../../assets/img/new-dashboard/download-icon.svg";
import { faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import Papa from "papaparse";
import { ddmmyyyyFormat, getPoints } from "../../common/Helper";
import addRewardPoints from "../../common/AddRewardPoints";
const MyArticle = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);

  const navigate = useNavigate();
  const [logUserId] = useState(state.user.Id);
  const [articleList, setArticleList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  let [cardValue, setCardValue] = useState({
    level: "",
    Points: 0,
    myarticle: 0,
    published: 0,
    totalLike: 0,
  });

  useEffect(() => {
    if (location.state && location.state.selectedProject) {
      setSelectedProject(location.state.selectedProject);
    }
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .post("kmarticle/myarticle", { UserId: logUserId })
      .then((res) => {
        setArticleList(res.data);
        setTableData(res.data);
        setLoading(false);
        if (articleList.StatusId === 1) {
          if (articleList % 10 === 0) {
            addRewardPoints(
              state.rewards[12].Points,
              logUserId,
              state.rewards[12].Id,
              logUserId
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    apiClient
      .post("kmarticle/kmarticledashboard", { UserId: logUserId })
      .then((res) => {
        cardValue.level = res.data[0].level;
        cardValue.myarticle = res.data[0].totalArticle;
        cardValue.published = res.data[0].published;
        cardValue.totalLike = res.data[0].totalLike;
        cardValue.Points = getPoints(res.data[0].level);
        setCardValue(cardValue);
        setLoading(false);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filteredData = tableData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseValue) ||
        item.CategoryName.toLowerCase().includes(lowerCaseValue) ||
        item.ProjectName.toLowerCase().includes(lowerCaseValue)
    );
    setArticleList(filteredData);
  };

  function handleExport(data) {
    const headers = [
      { label: "Title", key: "title" },
      { label: "Project Name", key: "ProjectName" },
      { label: "Category Name", key: "CategoryName" },
      { label: "Author Name", key: "AuthorName" },
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
    saveAs(blob, "Article Details.csv");
  }

  function capitalizeFirstLetter(title) {
    if (!title) return "";
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  const columns = [
    {
      name: "Date",
      selector: (param) => ddmmyyyyFormat(param.CreatedAt),
      sortable: true,
    },
    {
      name: "Title",
      selector: (param) => <span title={param.title}>{param.title}</span>,
      sortable: true,
      sortFunction: (a, b) => a.title.localeCompare(b.title),

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
      name: "Type",
      selector: (param) => {
        return param.type === 1
          ? "Article"
          : param.type === 2
          ? "Case Study"
          : param.type === 3
          ? "Knowledge Management"
          : param.type === 4
          ? "VX Article"
          : "Customer Accolades";
      },
      sortable: true,
    },
    {
      name: "Project",
      selector: (param) => (
        <span title={param.ProjectName}>{param.ProjectName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.ProjectName.localeCompare(b.ProjectName),

      filter: (
        <input
          type="text"
          placeholder="Search"
          value={selectedProject || ""}
          onChange={(e) => setSelectedProject(e.target.value)}
        />
      ),
    },
    {
      name: "Category",
      selector: (param) => (
        <span title={param.CategoryName}>{param.CategoryName}</span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.CategoryName.localeCompare(b.CategoryName),

      filter: (
        <input
          type="text"
          placeholder="Search"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
      ),
    },
    {
      name: "Status",
      sortable:true,
      selector: (param) => (param.StatusId
      ),
      format: (param) => (
        <>
          {param.StatusId === 1 ? (
            <div class="maincontent__table--status maincontent__table--status-updated">
              Published
            </div>
          ) : param.StatusId === 2 ? (
            <div class="maincontent__table--status maincontent__table--status-notupdated bg-info scheduled">
              Submitted
            </div>
          ) : param.StatusId === 4 ? (
            <div class="maincontent__table--status maincontent__table--status-notupdated draftbtnMyArticle">
              Draft
            </div>
          ) : (
            <div
              class="maincontent__table--status maincontent__table--status-review"
              style={{ backgroundColor: "#eb954f" }}
            >
              Rework
            </div>
          )}
        </>
      ),
    },
    {
      name: "Likes",

      selector: (param) => param.Likes,
      sortable: true,
    },
    {
      name: "Comments",
      selector: (param) => param.Comments,
      sortable: true,
    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <>
          <FontAwesomeIcon
              style={{ color: "#1658a0" }}
              icon={faEye}
              onClick={() => {
                navigate(Routes.KMViewArticle, { state: { user: param } });
              }}
              title="View Article"
            />
{'  '}
          {param.StatusId !== 2 ? (
            <FontAwesomeIcon
              style={{ color: "#1658a0"}}
              icon={faPenToSquare}
              onClick={() => {
                navigate(Routes.UpdateArticle, { state: { user: param } });
              }}
              title="Edit Article"
            />
          ):""}

          </>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
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
            <span>My Articles</span>
          </div>
        )}

        <div
          className="flex gap-2 mt-2"
        >
          <div className="relative search-containerKMArti kmarticle-seactform">
            <input
              type="search"
              placeholder="Search Title, Category, Project"
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
              onClick={() => handleExport(articleList)}
              className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
            ></img>
          </Link>
        </div>
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--content">
          <Card.Body id="unpublishedDatatble" align="center">
            {loading ? (
              <div class="circle__loader"></div>
            ) : (
              <DataTable
                columns={columns}
                data={articleList}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="myArticleDT"
              />
            )}
          </Card.Body>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(MyArticle);
