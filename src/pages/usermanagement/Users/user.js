import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import DataTable from "react-data-table-component";
import apiClient from "../../../common/http-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrashAlt,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import DownloadIcon from "../../../assets/img/new-dashboard/download-icon.svg";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import Swal from "sweetalert2";
import { Routes } from "../../../routes";
import Papa from "papaparse";
import { Link } from "react-router-dom";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../../components/Alert";
import { connect } from "react-redux";

const User = (state) => {
  const [UserTabData, setUserTabData] = useState([]);
  const [newUser, setNewUser] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [UserStatus, setUserStatus] = useState(true);
  const [LockStatus, setLockStatus] = useState(false);
  const [isdisabled, setdisabled] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  function capitalizeFirstLetter(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const navigate = useNavigate();

  const column = [
    {
      name: "User Name",
      selector: (param) =>
        capitalizeFirstLetter(param.FirstName) +
        " " +
        capitalizeFirstLetter(param.LastName),
      sortable: true,
      cell: (param) => (
        <a>
          {capitalizeFirstLetter(param.FirstName) +
            " " +
            capitalizeFirstLetter(param.LastName)}
        </a>
      ),
    },
    {
      name: " User ID",
      selector: (param) => param.Id,
      sortable: true,
    },
    {
      name: "Email Address",
      selector: (param) => <span title={param.EmailId}>{param.EmailId}</span>,
      sortable: true,
      sortFunction: (a, b) => a.EmailId.localeCompare(b.EmailId),
    },
    {
      name: "Lock Status",
      sortable : true,
      selector : (param) => param.IsLocked,
      cell: (param) => (
        <>
          {param.IsLocked === "Active" ? (
            <div class="maincontent__table--status maincontent__table--status-notupdated">
              Locked
            </div>
          ) : (
            <div class="maincontent__table--status maincontent__table--status-updated">
              UnLocked
            </div>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "User Status",
      sortable : true,
      selector : (param) => param.IsActive,
      cell: (param) => (
        <>
          {param.IsActive === "Active" ? (
            <div class="maincontent__table--status maincontent__table--status-updated">
              Active
            </div>
          ) : (
            <div class="maincontent__table--status maincontent__table--status-notupdated">
              InActive
            </div>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", fontSize: "1.5em", cursor: "pointer" }}
            icon={faPenToSquare}
            title="edit user"
            onClick={() => {
              navigate(Routes.editUsr, { state: { user: param } });
            }}
          />
          {param.Id !== 1 ? (
            <FontAwesomeIcon
              style={{
                color: "red",
                fontSize: "1.5em",
                width: "2rem",
                cursor: "pointer",
              }}
              icon={faTrashAlt}
              title="delete user"
              onClick={() => {
                deleteUserFunc(param.Id);
              }}
            />
          ) : null}
        </>
      ),
      width: "100px",
    },
  ];

  const deleteUserFunc = (id) => {
    Swal.fire({
      title: "",
      text: "Are you sure, you want to remove?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1658a0",
      cancelButtonColor: "#1658a0",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete("/user/" + id)
          .then(() => {
            Alert("succ", "User Deleted Successfully");
            getAllUsers();
          })
          .catch(() => {
            Alert("error", "Please Try Again");
          });
      }
    });
  };

  const getAllUsers = () => {
    setdisabled(true);
    apiClient
      .post("/user/search", {
        firstName: "",
        lastName: "",
        emailId: "",
        isApproved: null,
        isActive: null,
        isLocked: null,
        userId: "1",
      })
      .then((result) => {
        if (result.data.user) {
          const arr = [];
          result?.data?.user?.map((usr) => {
            let obj = {
              FirstName: usr.FirstName,
              LastName: usr.LastName,
              Id: usr.Id,
              EmailId: usr.EmailId,
              IsLocked: usr.IsLocked == "0" ? "InActive" : "Active",
              IsActive: usr.IsActive == "1" ? "Active" : "Inactive",
              DefaultpageId: usr.DefaultpageId,
              ModuleName: usr.ModuleName,
              DepartmentId: usr.DepartmentId,
              DepartmentName: usr.DepartmentName,
            };
            arr.push(obj);
          });
          setUserTabData(arr);
          setNewUser(arr);
          setdisabled(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const searchUser = () => {
    setLoading(true);
    setdisabled(true);
    apiClient
      .post("/user/search", {
        firstName: firstName,
        lastName: lastName,
        emailId: EmailId,
        isApproved: UserStatus.value,
        isLocked: LockStatus.value,
        isApproved: null,
        isLocked: LockStatus ? "1" : "0",
        isActive: UserStatus ? "1" : "0",
        userId: "1",
      })
      .then((result) => {
        if (result.data.user) {
          const arr = [];
          result?.data?.user?.map((usr) => {
            let obj = {
              FirstName: usr.FirstName,
              LastName: usr.LastName,
              Id: usr.Id,
              EmailId: usr.EmailId,
              IsLocked: usr.IsLocked == "0" ? "InActive" : "Active",
              IsActive: usr.IsActive == "1" ? "Active" : "Inactive",
            };
            arr.push(obj);
          });
          setUserTabData(arr);
          setIsAccordionOpen(false);
          setdisabled(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  };

  const resetUser = () => {
    setLastName("");
    setFirstName("");
    setEmailId("");
    setUserStatus(true);
    setLockStatus(false);
    getAllUsers();
    setIsAccordionOpen(false);
  };
  const StatusData = [
    { label: "All", value: null },

    {
      label: "Active",
      value: "1",
    },
    {
      label: "InActive",
      value: "0",
    },
  ];

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);

    if (searchValue === "") {
      setUserTabData(newUser);
    } else {
      const filterData = UserTabData.filter((item) => {
        return (
          item.FirstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.LastName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.EmailId.toLowerCase().includes(searchValue.toLowerCase())
        );
      });

      setUserTabData(filterData);
    }
  };

  function handleExport(data) {
    const headers = [
      { label: "First Name", key: "FirstName" },
      { label: "Last Name", key: "LastName" },
      { label: "User ID", key: "Id" },
      { label: "Email Address", key: "EmailId" },
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
    saveAs(blob, "User Details.csv");
  }

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  };
  return (
    <div className="fsMain">
      <div className="flex flex-col gap-4 md:justify-between md:flex-row my-2 items-center">
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
          <span>User Management</span>
          <span className="maincontent__breadcrumb--divider">/</span>
          <span className="maincontent__breadcrumb--active">Users</span>
        </div>
        <button
          className="maincontent__btn maincontent__btn--primaryblue w-fit"
          onClick={() => {
            navigate(Routes.createUsr);
          }}
        >
          +Create Users
        </button>
      </div>

      <div className="maincontent__card">
        <Accordion
          activeKey={isAccordionOpen ? "1" : "0"}
          
        >
          <Accordion.Item eventKey="1">
            <Accordion.Header
              className="accordionheader"
              onClick={toggleAccordion}
            >
              SEARCH USERS
            </Accordion.Header>
            <Accordion.Body
              className="accordionnew"
              style={{ visibility: "visible", color: "#1658a0" }}
            >
              <div className="cardContent Cctent">
                <Form style={{ marginLeft: "10px" }}>
                  <Row>
                    <Col md={3} className="mb-3">
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <div className="dropdown-container">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="inputIconCont input-group-text icon-container">
                                  <FontAwesomeIcon icon={faUser} />
                                </span>
                              </div>
                              <Form.Control
                                required
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => {
                                  setFirstName(e.target.value);
                                }}
                                onKeyDown={handleEnterKey}
                                className="selectOptions"
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <div className="dropdown-container">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="inputIconCont input-group-text icon-container">
                                  <FontAwesomeIcon icon={faUser} />
                                </span>
                              </div>
                              <Form.Control
                                required
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => {
                                  setLastName(e.target.value);
                                }}
                                onKeyDown={handleEnterKey}
                                className="selectOptions"
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </Form>
                    </Col>

                    <Col md={3} className="mb-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <div className="dropdown-container">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="inputIconCont input-group-text icon-container">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                            </div>
                            <Form.Control
                              required
                              type="text"
                              value={EmailId}
                              placeholder="Wild card search of email"
                              onChange={(e) => {
                                setEmailId(e.target.value);
                              }}
                              onKeyDown={handleEnterKey}
                              className="selectOptions"
                              style={{ backgroundColor: "#ccd1e9 !important" }}
                            />
                          </div>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={3} className="mb-3">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>User Status</Form.Label>

                            <div className="toggle-container">
                              <Toggle
                                className="custom-toggle"
                                checked={UserStatus}
                                onChange={() => setUserStatus(!UserStatus)}
                              />
                            </div>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Lock Status</Form.Label>

                            <div className="toggle-container">
                              <Toggle
                                className="custom-toggle"
                                checked={LockStatus}
                                onChange={() => setLockStatus(!LockStatus)}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col style={{ padding: "0px 0px 10px 0px" }} align="right">
                      <Button
                        variant="info"
                        onClick={searchUser}
                        onKeyDown={handleEnterKey}
                        disabled={isdisabled}
                        className="maincontent__btn maincontent__btn--primaryblue"
                        style={{ display: "inline-block" }}
                      >
                        Search
                      </Button>
                      <Button
                        style={{ marginLeft: "4px", display: "inline-block" }}
                        variant="info"
                        onClick={resetUser}
                        className="maincontent__btn maincontent__btn--primaryblue"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div
          className="maincontent__card--body"
          style={{ margin: "10px 0 0 0 " }}
        >
          <div className="maincontent__card--header ">
            <h2 className="maincontent__card--header-title text-black">
              Users
            </h2>
          </div>
          <div className="maincontent__card--content  rdt_Pagination">
            <div className="secDiv">
              <div
                className="maincontent__card--tableheader-right"
                style={{ margin: "10px 0px 10px 0px" }}
              >
                <div className="relative search-containerKMArti kmarticle-seactform">
                  <input
                    type="search"
                    placeholder="Search by username, emailaddress"
                    className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[34px]"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
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
                    onClick={() => handleExport(UserTabData)}
                    className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
                  ></img>
                </Link>
              </div>

              <Card.Body align="center">
                {loading ? (
                  <div class="circle__loader items-center my-0 mx-auto"></div>
                ) : (
                  <DataTable
                    columns={column}
                    data={UserTabData}
                    highlightOnHover
                    pagination
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={10}
                    className="user_table"
                  />
                )}
              </Card.Body>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(User);
