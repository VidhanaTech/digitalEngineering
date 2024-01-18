import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toggle/style.css";
import DataTable from "react-data-table-component";
import apiClient from "../../common/http-common";
import { Card,Accordion } from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import Papa from "papaparse";
import { Link } from "react-router-dom";
import excelicon from "../../assets/img/brand/excelicon.svg";
import DownloadIcon from "../../assets/img/new-dashboard/download-icon.svg";
// import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { faEdit,faEye } from "@fortawesome/free-solid-svg-icons";
import { ddmmyyyyFormat } from "../../common/Helper";

const KmUnpublished = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const location = useLocation();
  const [logUserId] = useState(state.user.Id);

  const navigate = useNavigate();
  const [unpublishedArticleList, setUnPublishedArticleList] = useState([]);
  const [reviewlist, setReviewList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    apiClient
      .post("kmarticle/kmarticleunpublished",{UserId: logUserId} )
      .then((res) => {
        setUnPublishedArticleList(res.data);
        setOriginalData(res.data);
        setLoading(false);
      })
      .catch(() => {});
  }, []);

  // useEffect(() =>  {
  //   apiClient
  //     .get("/kmarticle/article_revisionlist/"+ logUserId)
  //     .then((res) => {
  //       setReviewList(res.data.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {});
  // }, []);
  useEffect(() =>  {
    apiClient
      .post("kmarticle/kmarticleMyReviewList",{UserId : logUserId})
      .then((res) => {
        setReviewList(res.data);
        setLoading(false);
      })
      .catch((error) => {});
  }, []);

  const editArticle = (param) => {
    navigate(Routes.KMUpdateArticle, { state: { user: param } });
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      // Reset the table back to the original data
      setUnPublishedArticleList(originalData);
    } else {
      // Filter the data based on the search value
      filterData(value);
    }
  };

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    const filteredData = originalData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseValue) ||
        item.CategoryName.toLowerCase().includes(lowerCaseValue) ||
        item.ProjectName.toLowerCase().includes(lowerCaseValue)
    );
    setUnPublishedArticleList(filteredData);
  };

  function handleExport(data) {
    // Define your custom headers
    const headers = [
      { label: "Title", key: "title" },
      { label: "Project Name", key: "ProjectName" },
      { label: "Category Name", key: "CategoryName" },
      { label: "Client Name", key: "ClientName" },
      { label: "Author Name", key: "AuthorName" },
    ];

    // Prepare the data for export
    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        // console.log(row[header.key]);
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key]);
        else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );
    // console.log(exportData);
    // Convert the data to CSV format
    const csvData = Papa.unparse(exportData);

    // Create a Blob object and save the file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Unpublished Articles.csv");
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
      sortable: true,
      sortFunction: (a, b) => a.title.localeCompare(b.title),
      selector: (param) => (
        <span title={param.title}>
          {param.title.length > 20 ? `${param.title.substring(0, 20)}...` : param.title}
        </span>
      ),      
      //  (param) => capitalizeFirstLetter(param.title),
      // sortable: true,
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
          ?"VX Article"
          :"Customer accolades";
      },
      sortable: true,
    },
    {
      name: "Project",
      selector: (param) => (
        <span title={param.ProjectName}>{param.ProjectName}</span>
      ),
      // param.ProjectName,
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
      //(param) => param.CategoryName,
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
      name: "Client",
      selector: (param) => (
        <span title={param.ClientName}>{param.ClientName}</span>
      ),
      //(param) => param.ClientName,
      sortable: true,
      sortFunction: (a, b) => a.ClientName.localeCompare(b.ClientName),
    },
    {
      name: "Author",
      selector: (param) => (
        <span title={param.AuthorName}>{param.AuthorName}</span>
      ),
      // (param) => param.AuthorName,
      sortable: true,
      sortFunction: (a, b) => a.AuthorName.localeCompare(b.AuthorName),
    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", cursor: "pointer" }}
            title="Approve Article"
            icon={faEdit}
            onClick={() => {
              navigate(Routes.KMUpdateArticle, {
                state: { user: param, page: "unpublished" },
              });
            }}
          />
          {/* <ReactTooltip effect="solid" /> */}
        </>
      ),
      width: "100px",
    },
  ];

  const column = [
    // {
    //   name : "Article Id",
    //   selector : (param) => param.ArticleId,
    //   sortable : true
    // },
    // {
    //   name : "Comments",
    //   selector : (param) => param.Comment,
    //   sortable : true
    // },{
    //   name: "Reviewed Date",
    //   selector: (param) => ddmmyyyyFormat(param.CreatedAt),
    //   sortable: true,
    // },
    {
      name: "Date",
      selector: (param) => ddmmyyyyFormat(param.CreatedAt),
      sortable: true,
    },
    {
      name: "Title",
      sortable: true,
      selector: (param) => (
        <span title={param.title}>
          {param.title.length > 20 ? `${param.title.substring(0, 20)}...` : param.title}
        </span>
      ),      
      //  (param) => capitalizeFirstLetter(param.title),
      // sortable: true,
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
          ?"VX Article"
          :"Customer accolades";
      },
      sortable: true,
    },
    {
      name: "Project",
      selector: (param) => (
        <span title={param.ProjectName}>{param.ProjectName}</span>
      ),
      // param.ProjectName,
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
      //(param) => param.CategoryName,
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
      name: "Client",
      selector: (param) => (
        <span title={param.ClientName}>{param.ClientName}</span>
      ),
      //(param) => param.ClientName,
      sortable: true,
      sortFunction: (a, b) => a.ClientName.localeCompare(b.ClientName),
    },
    {
      name: "Author",
      selector: (param) => (
        <span title={param.AuthorName}>{param.AuthorName}</span>
      ),
      // (param) => param.AuthorName,
      sortable: true,
      sortFunction: (a, b) => a.AuthorName.localeCompare(b.AuthorName),
    },
    {
      name: "Status",
      sortable :true,
      selector :(param)=> (param.StatusId),
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
      name: "Review Date",
      selector: (param) => ddmmyyyyFormat(param.CreatedAt),
      sortable: true,
    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", cursor: "pointer" }}
            title="Approve Article"
            icon={faEye}
            onClick={() => {
              navigate(Routes.KMViewArticle, {
                state: { user: param},
              });
            }}
          />
          {/* <ReactTooltip effect="solid" /> */}
        </>
      ),
      width: "100px",
    },
    
          
  ];

  return (
    <div className="fsMain">
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
            <span>Artifacts for Review</span>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
        <div className="relative search-containerKMArti kmarticle-seactform">
            <input
              type="search"
              placeholder="Search Title, Project, Category"
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
            {/* <FontAwesomeIcon
            icon={faFileExcel}
            onClick={() => handleExport(unpublishedArticleList)}
            className="maincontent__faIcon maincontent__faIcon--redcolor"
          /> */}
            <img
              src={DownloadIcon}
              onClick={() => handleExport(unpublishedArticleList)}
              className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
              ></img>
          </Link>
        </div>
      </div>

      <div className="maincontent__card--body mt-2">
        {/* <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">
            Unpublished Articles
          </h2>
        </div> */}
        <div className="maincontent__card--content rdt_Pagination">
          <Card.Body align="center">
          <Accordion defaultActiveKey="1" className="mt-4">
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="accordionheader">
                    Pending Reviews
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{
                      visibility: "visible",
                      color: "#1658a0",
                    }}
                  >
            {loading ? (
              <div class="circle__loader"></div>
            ) : (
              <DataTable
                columns={columns}
                data={unpublishedArticleList}
                // onRowClicked={editArticle}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="kmUnpublishedDT"
              />
            )}
            </Accordion.Body>
                </Accordion.Item>
              </Accordion>
          </Card.Body>
          

          <Accordion defaultActiveKey="0" className="mt-4">
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="accordionheader">
                    My Reviews
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{
                      visibility: "visible",
                      color: "#1658a0",
                    }}
                  >
                    {loading ? (
              <div class="circle__loader"></div>
            ) : (
                    <DataTable
                columns={column}
                data={reviewlist}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="kmUnpublishedDT"
              />
            )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(KmUnpublished);
