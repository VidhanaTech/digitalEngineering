import React, { useEffect, useState } from "react";
import apiClient from "../../../common/http-common";
import DataTable from "react-data-table-component";
import "./createrole.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes } from "../../../routes";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Modal, Card, Form, Accordion } from "@themesberg/react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "../../../components/Alert";
import { connect } from "react-redux";
import Swal from "sweetalert2";

const CreateRole = (state) => {
  const [Rname, setRname] = useState("");
  const [Rdes, setRdes] = useState("");
  const [defaultlPage, setdefaultlPage] = useState({});
  const [ModuleTabData, setModuleTabData] = useState([]);
  let [UserTabData, setUserTabData] = useState([]);
  const [addModuleTabData, setAddModuleTabData] = useState([]);
  const [moduleTabList, setModuleTabListData] = useState([]);
  const [addUserTabData, setAddUserTabData] = useState([]);
  const [getrows, setgetrows] = useState([]);
  const [getusers, setgetusers] = useState([]);
  const [ShowDef, setShowDef] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const navigate = useNavigate();
  const [showTables, setShowTables] = useState(false);
  const [userIdd, setuserIdd] = useState();
  const [isdisabled, setIsdisabled] = useState(false);
  let [userDetails, setUserDetails] = useState({
    id: null,
    emailId: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    isActive: 0,
    isLocked: 0,
    loginType: "1",
    userId: "1",
  });

  const AddModulePermission = (param) => {
    setgetrows(param.selectedRows);
  };

  const postModulePermission = (obj) => {
    if (getrows.length > 0) {
      let err = 0;
      const selectedModules = getrows.map((data) => ({
        id: data.id,
        ModuleName: data.ModuleName,
        ModuleDescription: data.ModuleDescription,
      }));
      setModuleTabData((prevModuleTabData) => [
        ...prevModuleTabData,
        ...selectedModules,
      ]);

      getrows.forEach((data) => {
        let params = {
          roleId: userIdd,
          moduleId: data.id,
          userId: "1",
        };
        apiClient.post("user/roles/module", params).catch(() => {
          err++;
        });
      });
      handleClose();

      if (err) Alert("error", "Please Try Again!..");
      else Alert("succ", "Module Updated");
    } else {
      Alert("warn", "At least Please Choose One Module");
    }
  };

  const AddUsers = (param) => {
    setgetusers(param.selectedRows);
  };

  const postUsers = (obj) => {
    if (getusers.length > 0) {
      let err = 0;
      const selectedUsers = getusers.map((data) => ({
        Id: data.Id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        EmailId: data.EmailId,
      }));
      setUserTabData((prevUserTabData) => [
        ...prevUserTabData,
        ...selectedUsers,
      ]);

      getusers.forEach((data) => {
        let params = {
          roleId: userIdd,
          userId: data.Id,
        };

        apiClient.post("/user/role", params).catch(() => {
          err++;
        });
      });
      handleClose();

      if (err) Alert("error", "Please Try Again!..");
      else {
        Alert("succ", "User Updated");
      }
    } else {
      Alert("warn", "At least Please Choose One User");
    }
  };

  const handleModuleDelete = async (id) => {
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
          .delete("/user/roles/module", {
            data: {
              moduleId: id,
              userId: 1,
            },
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error);
            } else {
              Alert("succ", response.data.user);
            }
          })
          .catch((err) => {
            Alert("error", "Please Try Again");
          });

        const modadd = ModuleTabData.filter((module) => {
          return module.id !== id;
        });
        setModuleTabData(modadd);
      } else {
        handleClose();
      }
    });
  };

  const handleUserDelete = async (Id) => {
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
          .delete("/user/role", {
            data: {
              roleId: Id,
              userId: userDetails.id,
            },
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error);
            } else {
              Alert("succ", response.data.user);
            }
          });

        const useradd = UserTabData.filter((user) => {
          return user.Id !== Id;
        });
        setUserTabData(useradd);
      } else {
        handleClose();
      }
    });
  };

  const column1 = [
    {
      name: "SEMO_ID",
      selector: (param) => param.id,
      sortable: true,
    },
    {
      name: "Module Name",
      selector: (param) => param.ModuleName,
      sortable: true,
    },
    {
      name: "Description",
      selector: (param) => param.ModuleDescription,
      sortable: true,
    },
    {
      name: "Actions",
      id: "id",
      cell: (param) => (
        <a>
          <FontAwesomeIcon
            icon={faTrash}
            size="lg"
            color="#1475DF"
            onClick={() => {
              handleModuleDelete(param.id);
            }}
          />
        </a>
      ),

      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const columnAddModulePermission = [
    {
      name: "Module Name",
      selector: (param) => param.ModuleName,
      sortable: true,
    },
    {
      name: "Description",
      selector: (param) => param.ModuleDescription,
      sortable: true,
    },
  ];

  const columnAddUser = [
    {
      name: "User Name",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true,
    },
    {
      name: "User ID",
      selector: (param) => param.EmailId,
      sortable: true,
    },
  ];

  const column2 = [
    {
      name: "SEUS_ID",
      selector: (param) => param.Id,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true,
    },
    {
      name: "User ID",
      selector: (param) => param.EmailId,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (param) => (
        <a>
          <FontAwesomeIcon
            icon={faTrash}
            size="lg"
            color="#1475DF"
            onClick={() => {
              handleUserDelete(param.Id);
            }}
          />
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  useEffect(() => {
    const fetchFilteredModules = async () => {
      const response = await apiClient.get("/user/role/module/list");
      const filteredModules = response.data.user;
      // Filter out modules that already exist in ModuleTabData
      let defVal = [];
      filteredModules.map((row) => {
        defVal.push({ value: row.id, label: row.ModuleName });
      });
      setModuleTabListData(defVal);
      const uniqueModules = filteredModules.filter((module) => {
        return !ModuleTabData.some(
          (existingModule) => existingModule.id === module.id
        );
      });

      setAddModuleTabData(uniqueModules);
    };

    fetchFilteredModules();
  }, [ModuleTabData]);

  useEffect(() => {
    const fetchFilteredModules = async () => {
      const response = await apiClient.post("/user/search", {
        firstName: "",
        lastName: "",
        emailId: "",
        isApproved: null,
        isActive: null,
        isLocked: null,
        userId: "1",
      });
      const filteredModules = response.data.user;
      const uniqueArray = filteredModules.filter(
        (item1) => !UserTabData.some((item2) => item2.Id === item1.Id)
      );

      setAddUserTabData(uniqueArray);
    };

    fetchFilteredModules();
  }, [UserTabData]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter"&& !isdisabled) {
      e.preventDefault();
      postRole();
    }
  };

  const postRole = () => {
    setIsdisabled(true);
    if (
      Rname === "" ||
      Rdes === "" ||
      defaultlPage.value === undefined ||
      defaultlPage.value === ""
    ) {
      Alert("warn", "Role Name,  Default Page can't be empty!");
      setIsdisabled(false);
    } else {
      apiClient
        .post("/user/roles", {
          id: userDetails.id,
          roleName: Rname.trim(),
          roleDescription: Rdes.trim(),
          defaultlPage: defaultlPage.value,
          isActive: userDetails.isActive,
          userId: userDetails.userId,
        })

        .then((response) => {
          setShowTables(true);
          setuserIdd(response.data.user[0].LV_ID);
          Alert('succ', "Role Created Successfully")
          setIsdisabled(true);
        })
        .catch((error) => {
        })
    }
  };

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
        <span
          className="cursor_pointer"
          onClick={() => {
            navigate(Routes.Roles);
          }}
        >
          Roles
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Create Role</span>
      </div>

      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Create Role</h2>
        </div>

        <div className="maincontent__card--content ">
          <Form className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Group className="mb-3 mb3form">
              <Form.Label>Name</Form.Label>
              <Form.Control
                className="formconus"
                value={Rname}
                onChange={(e) => setRname(e.target.value)}
                onKeyDown={handleKeyDown}
                type=""
                placeholder="Role Name"
              />
            </Form.Group>

            <Form.Group className="mb-3 mb3form">
              <Form.Label>Description</Form.Label>
              <Form.Control
                className="formconus"
                value={Rdes}
                onChange={(e) => setRdes(e.target.value)}
                onKeyDown={handleKeyDown}
                type=""
                placeholder="Role Description"
              />
            </Form.Group>
            <Form.Group className="mb-3 mb3form">
              <Form.Label>Default Page</Form.Label>
              <Select
                options={moduleTabList}
                placeholder=""
                value={defaultlPage}
                onChange={(e) => {
                  setdefaultlPage(e);
                }}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
          <div className="flex justify-center gap-4 mt-4 md:justify-end">
            <button
              className="maincontent__btn maincontent__btn--primaryblue"
              onClick={() => postRole()}
              disabled={isdisabled}
            >
              Save
            </button>
            <button
              className="maincontent__btn maincontent__btn--primaryblue"
              onClick={() => {
                navigate(Routes.Roles);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showTables && (
        <div className="maincontent__card " style={{ margin: "1rem 0 0 0" }}>

          <Accordion defaultActiveKey="1" style={{ marginTop: "10px" }}>
            <Accordion.Item eventKey="1">
              <Accordion.Header className="accordionheader">
                MODULE PERMISSIONS
              </Accordion.Header>
              <Accordion.Body
                className="accordionnew"
                style={{
                  visibility: "visible",
                  color: "#1658a0",
                  padding: "0px",
                }}
              >
                <div className="maincontent__card--content accordionnew">
                  <>
                    <div className="flex justify-end maincontent__pageheader-right">
                      <button
                        className="maincontent__btn maincontent__btn--primaryblue"
                        onClick={() => setShowDefault(true)}
                        style={{ margin: "0 0 20px 0" }}
                      >
                        +Add Module Permissions
                      </button>
                      <Modal
                        as={Modal.Dialog}
                        centered
                        show={showDefault}
                        onHide={handleClose}
                        className="midpop"
                      >
                        <Card
                          centered
                          show={showDefault}
                          onHide={handleClose}
                          className="usrCrd"
                        >
                          <Card.Header className="rhdivCard">
                            <div className="maincontent__card--header">
                              <h2 className="maincontent__card--header-title">
                                Modules
                              </h2>
                            </div>
                          </Card.Header>
                          <div className="cardContent Cctent">
                            <Card.Body>
                              <DataTable
                                columns={columnAddModulePermission}
                                data={addModuleTabData}
                                highlightOnHover
                                pagination
                                onSelectedRowsChange={AddModulePermission}
                                selectableRows
                                paginationRowsPerPageOptions={[5, 10, 15]}
                                paginationPerPage={5}
                              />
                            </Card.Body>
                          </div>

                          <div className="flex justify-end gap-4 p-4">
                            <button
                              className="maincontent__btn maincontent__btn--primaryblue"
                              onClick={postModulePermission}
                            >
                              Add
                            </button>
                            <button
                              className="maincontent__btn maincontent__btn--primaryblue"
                              onClick={handleClose}
                            >
                              Cancel
                            </button>
                          </div>
                        </Card>
                      </Modal>
                    </div>
                    <Card.Body>
                      <DataTable
                        columns={column1}
                        data={ModuleTabData}
                        highlightOnHover
                        pagination
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        paginationPerPage={5}
                      />
                    </Card.Body>
                  </>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion defaultActiveKey="1" style={{ marginTop: "10px" }}>
            <Accordion.Item eventKey="1">
              <Accordion.Header className="accordionheader">
                USERS
              </Accordion.Header>
              <Accordion.Body
                className="accordionnew"
                style={{
                  visibility: "visible",
                  color: "#1658a0",
                  padding: "0px",
                }}
              >
                <div className="maincontent__card--content accordionnew">
                  <div className="flex justify-end maincontent__pageheader-right ">
                    <button
                      className="mb-4 maincontent__btn maincontent__btn--primaryblue"
                      onClick={() => setShowDef(true)}
                    >
                      +Add Users
                    </button>

                    <Modal
                      className="mdlclspop midpop"
                      as={Modal.Dialog}
                      centered
                      show={ShowDef}
                      onHide={handleClose}
                    >
                      <Card
                        centered
                        show={ShowDef}
                        onHide={handleClose}
                        className="usrCrd"
                      >
                        <Card.Header className="rhdivCard">
                          <div className="maincontent__card--header">
                            <h2 className="maincontent__card--header-title">
                              Users
                            </h2>
                          </div>
                        </Card.Header>
                        <div className="cardContent Cctent rdt_Pagination">
                          <Card.Body className="rmroldcb rdt_Pagination">
                            <DataTable
                              columns={columnAddUser}
                              data={addUserTabData}
                              highlightOnHover
                              pagination
                              onSelectedRowsChange={AddUsers}
                              selectableRows
                              paginationRowsPerPageOptions={[5, 10, 15]}
                              paginationPerPage={5}
                            />
                          </Card.Body>
                        </div>

                        <div className="flex justify-end gap-4 p-4">
                          <button
                            className="maincontent__btn maincontent__btn--primaryblue"
                            onClick={postUsers}
                          >
                            Add
                          </button>
                          <button
                            className="maincontent__btn maincontent__btn--primaryblue"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </Card>
                    </Modal>
                  </div>
                  <Card.Body>
                    <DataTable
                      columns={column2}
                      data={UserTabData}
                      highlightOnHover
                      pagination
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      paginationPerPage={5}
                    />
                  </Card.Body>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(CreateRole);
