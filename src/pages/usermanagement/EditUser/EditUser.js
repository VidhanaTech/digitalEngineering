import React, { useState, useEffect } from "react";
import "./EditUser.css";
import { Modal, Card, Form, Accordion } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../common/http-common";
import { Routes } from "../../../routes";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../../components/Alert";
import Swal from "sweetalert2";
import Select from "react-select";
import { connect } from "react-redux";

const EditUser = (state) => {
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [isdisabled, setdisabled] = useState(false);
  const [UserStatus, setUserStatus] = useState(false);
  const [LockStatus, setLockStatus] = useState(true);
  const [rolePopUp, setRolePopUp] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [defaultList, setDefaultList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showResetField, setShowResetField] = useState(false);
  const [OldPwd, setOldPwd] = useState("changeme");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [apiError, setApiError] = useState();
  const [pwdInputClass, setPwdInputClass] = useState();
  const [defaultPage, setDefaultPage] = useState({ label: "", value: "" });
  const [resetPasswd, setResetPasswd] = useState("");
  const [department, setdepartment] = useState([]);
  const [departmentList, setdepartmentList] = useState([]);
  const oldPasswordValidation = (pwd) => {
    setOldPwd(pwd);
    if (!pwd) {
      setApiError("Please enter Old Password");
      setPwdInputClass("input-error");
    } else {
      setApiError("");
      setPwdInputClass("input-success");
    }
  };

  const isAdminch = location?.state?.user?.Id === 1;

  const passwordValidation = (pwd) => {
    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    setPwd(pwd);
    if (re.test(pwd)) {
      setApiError("");
      setPwdInputClass("input-success");
    } else {
      setApiError("Enter a valid Password");
      setPwdInputClass("input-error");
    }
  };

  function validateConfirmPassword(password) {
    setConfirmPwd(password);
    if (password == pwd) {
      setApiError("");
      setPwdInputClass("input-success");
    } else {
      setApiError("Passwords do not match");
      setPwdInputClass("input-error");
    }
  }

  const AddRoleData = (param) => {
    setSelectedRows(param.selectedRows);
  };

  const postRoleData = () => {
    if (selectedRows.length > 0) {
      let err = 0;
      selectedRows.map((row) => {
        apiClient
          .post("/user/role", {
            userId: userId.toString(),
            roleId: row.Id,
          })
          .then((response) => {})
          .catch((err) => {
            err += 1;
          });
        if (err) Alert("error", "Please Try Again");
        else Alert("succ", "Roles Added Successfully...");
      });
      getRolesData();
      handleClose();
      setTimeout(() => {
        getRolesData();
      }, 2000);
    } else {
      Alert("error", "Please Try Again..");
    }
  };
  const deleteRole = (param) => {
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
              userId: userId,
              roleId: param.RoleId.toString(),
            },
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error);
            } else {
              Alert("succ", response.data.user);
              getRolesData();
            }
          });
      } else {
        handleClose();
      }
    });
  };

  const columnAR = [
    {
      name: "Role Name",
      selector: (param) => param.RoleName,
    },
    {
      name: "Role Description",
      selector: (param) => param.RoleDescription,
    },
  ];
  const handleKeyDown = (e) => {
    if (e.key === "Enter"&& !isdisabled) {
      e.preventDefault(); 
      postNewUser();
    }
  };
  const column = [
    {
      name: "SERO_ID",
      selector: (param) => param.RoleId,
      sortable: true,
    },
    {
      name: "Role Name",
      selector: (param) => param.RoleName,
      sortable: true,
    },
    {
      name: "Role Description",
      selector: (param) => param.RoleDescription,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (param) => (
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={faTrash}
          size="lg"
          color="#1475DF"
          onClick={() => deleteRole(param)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  useEffect(() => {
    if (location?.state?.user) {
      setUserId(location?.state?.user?.Id);
      setUserName(location?.state?.user?.FirstName);
      setEmailId(location?.state?.user?.EmailId);
      setdepartment({
        label: location.state.user.DepartmentName,
        value: location.state.user.DepartmentId,
      });
      if (location?.state?.user?.IsActive === "Active") {
        setUserStatus(true);
      } else {
        setUserStatus(false);
      }
      if (location?.state?.user?.IsLocked === "InActive") {
        setLockStatus(false);
      } else {
        setLockStatus(true);
      }
    }
    getRolesData();
  }, []);

  useEffect(() => {
    apiClient.get("/lookup/department/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setdepartmentList(arr);
        });
      }
    });
  }, []);
  const resetPwd = () => {
    apiClient
      .post("auth/change-password", {
        id: emailId,
        oldPassword: OldPwd,
        newPassword: resetPasswd,
      })

      .then((res) => {
        Alert("succ", "password changed");
        setOldPwd(resetPasswd);
        backResetting();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    const fetchFilteredModules = () => {
      apiClient.get("/user/roles/role").then((response) => {
        if (response?.data?.user) {
          const filteredModules = response.data.user;
          const uniqueArray = filteredModules.filter(
            (item1) => !rolesData.some((item2) => item2.RoleId === item1.Id)
          );
          setRolePopUp(uniqueArray);
        }
      });
    };
    fetchFilteredModules();
  }, [rolesData]);

  const postNewUser = () => {
    setdisabled(true);
    if (isAdminch) {
      Alert("error", "Admin user cannot be edited.");
      return;
    } else {
      let usts = 0;
      let lsts = 0;
      if (UserStatus) usts = 1;
      if (LockStatus) lsts = 1;
      let userDetails = {
        id: location?.state?.user?.Id,
        emailId: emailId,
        firstName: userName,
        lastName: location?.state?.user?.LastName,
        defaultlPageId: defaultPage.value,
        departmentId: department.value,
        isActive: usts,
        isLocked: lsts,
        loginType: "1",
        userId: "1",
      };
      if (
        userName.trim() === "" ||
        userName === null ||
        emailId.trim() === "" ||
        emailId === null ||
        defaultPage.value === undefined ||
        defaultPage.value === "" ||
        department.value === undefined ||
        department.value === ""
      ) {
        Alert("warn", "Username ,Email can't be empty");

      setdisabled(false);
      } else {
        apiClient
          .post("/user/update", userDetails)
          .then((response) => {
            navigate(Routes.UserM);
            if (response?.data?.user.length > 0) {
              Alert("succ", "User Updated Successfully");
              navigate(Routes.UserM);
            } else {
              Alert("error", "Please Try Again");
            }
          })
          .catch((error) => {
            Alert("error", "Please Try Again");
          })
          .finally(()=> {
            setTimeout(() => {
              setdisabled(false);
            }, 4000);
          })
      }
    }
  };
  const getRolesData = () => {
    apiClient
      .get(`/user/roles/${location?.state?.user?.Id}`)
      .then((response) => {
        if (response?.data?.user) {
          setRolesData(response.data.user);
          let deflist = [];
          response.data.user.forEach((element) => {
            deflist.push({
              label: element.ModuleName,
              value: element.DefaultPageId,
            });
          });
          setDefaultList(removeDuplicatesByValue(deflist));
          setDefaultPage({
            label: location.state.user.ModuleName,
            value: location.state.user.DefaultpageId,
          });
        }
      });
  };
  function removeDuplicatesByValue(array) {
    const uniqueValues = new Set();
    return array.filter((item) => {
      if (!uniqueValues.has(item.value)) {
        uniqueValues.add(item.value);
        return true;
      }
      return false;
    });
  }

  const backResetting = () => {
    setShowResetField(false);
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
          onClick={() => {
            navigate(Routes.UserM);
          }}
          style={{ cursor: "pointer" }}
        >
          Users
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Edit User</span>
      </div>
      <div className="mt-4 maincontent__card">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Edit User</h2>
        </div>

        <div className="maincontent__card--content ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:justify-between">
            <Form.Group>
              <Form.Label className="formlblus">User Name</Form.Label>
              <Form.Control
                className="formconus"
                type="email"
                value={userName.trim()}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="formlblus">Email ID</Form.Label>
              <Form.Control
                className="formconus"
                type="email"
                value={emailId.trim()}
                onChange={(e) => setEmailId(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="formlblus">Default Page</Form.Label>
              <Select
                labelKey="name"
                onChange={(e) => {
                  setDefaultPage(e);
                }}
                onKeyDown={handleKeyDown}
                options={defaultList}
                placeholder=""
                value={defaultPage}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="formlblus">Department</Form.Label>
              <Select
                labelKey="name"
                options={departmentList}
                value={department}
                onChange={(e) => {
                  setdepartment(e);
                }}
              />
            </Form.Group>
            <div className="flex flex-col gap-2">
              <Form.Group>
                <Form.Label className="formlblus">Is Active</Form.Label>
                <Form.Check
                  className="formconus chckbx"
                  type="checkbox"
                  checked={UserStatus}
                  value={UserStatus}
                  onClick={() => setUserStatus(!UserStatus)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="formlblus">Is Locked</Form.Label>
                <Form.Check
                  className="formconus chckbx"
                  type="checkbox"
                  checked={LockStatus}
                  value={LockStatus}
                  onClick={() => setLockStatus(!LockStatus)}
                />
              </Form.Group>
            </div>
            <div className="mt-8 md:justify-end">
              <button
                disabled={isdisabled}
                className="maincontent__btn maincontent__btn--primaryblue"
                onClick={() => navigate(Routes.UserM)}
                style={{ float: "right" }}
              >
                Cancel
              </button>
              <button
                disabled={isdisabled}
                className="maincontent__btn maincontent__btn--primaryblue"
                onClick={postNewUser}
                style={{ float: "right", marginRight: "5px" }}
              >
                Save
              </button>
            </div>
          </div>

          {showResetField && (
            <div className="inputContainer d-flex justify-content-end">
              <input
                type="password"
                id="inputField"
                placeholder="New Password"
                onChange={(e) =>
                  passwordValidation(setResetPasswd(e.target.value))
                }
              />
              <button
                className="maincontent__btn maincontent__btn--primaryblue"
                style={{ marginLeft: "5px", marginRight: "5px" }}
                onClick={resetPwd}
              >
                {" "}
                Save{" "}
              </button>
              <button
                className="maincontent__btn maincontent__btn--primaryblue"
                onClick={backResetting}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <Accordion defaultActiveKey="1" style={{ marginTop: "10px" }}>
          <Accordion.Item eventKey="1">
            <Accordion.Header className="accordionheader">
              ROLES ASSIGNED
            </Accordion.Header>
            <Accordion.Body
              className="accordionnew"
              style={{
                visibility: "visible",
                color: "#1658a0",
                padding: "0px",
              }}
            >
              <Modal
                className="mdlclspop midpop"
                as={Modal.Dialog}
                centered
                show={showDefault}
                onHide={handleClose}
              >
                <Card
                  centered
                  show={showDefault}
                  onHide={handleClose}
                  className="usrCrd"
                >
                  <Card.Header className="rhdivCard">
                    <div className="maincontent__card--header">
                      <h2 className="maincontent__card--header-title">Roles</h2>
                    </div>
                  </Card.Header>
                  <div className="cardContent Cctent">
                    <Card.Body className="rmroldcb rdt_Pagination">
                      <DataTable
                        columns={columnAR}
                        data={rolePopUp}
                        selectableRows
                        onSelectedRowsChange={AddRoleData}
                        highlightOnHover
                        pagination
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        paginationPerPage={5}
                      />
                    </Card.Body>
                  </div>

                  <div className="flex justify-end gap-4 p-4">
                    <button
                      className="maincontent__btn maincontent__btn--primaryblue"
                      onClick={postRoleData}
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
              <div className="maincontent__card--content bg-purple-100 rdt_Pagination">
                <div className="flex justify-end maincontent__pageheader-right">
                  <button
                    className="mb-4 maincontent__btn maincontent__btn--primaryblue"
                    onClick={() => setShowDefault(true)}
                  >
                    +Add Roles
                  </button>
                </div>
                <Card.Body className="p-0">
                  <DataTable
                    columns={column}
                    data={rolesData}
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(EditUser);
