import React, { useState, useEffect } from "react";
import "./createuser.css";
import { Modal, Card, Form } from "@themesberg/react-bootstrap";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../common/http-common";
import { Routes } from "../../../routes";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../../components/Alert";
import { connect } from "react-redux";
import Swal from "sweetalert2";

const CreateUser = (state) => {
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const navigate = useNavigate();

  const [rolePopUp, setRolePopUp] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [department, setdepartment] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [isdisabled, setdisabled] = useState(false);
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

  const [departmentList, setdepartmentList] = useState([]);
  const [UserStatus, setUserStatus] = useState(true);
  const [LockStatus, setLockStatus] = useState(false);

  const [showRolesTable, setShowRolesTable] = useState(false);

  const validateEmail = (email) => {
    const emailCheck = /\S+@\S+\.\S+/;
    return emailCheck.test(email);
  };

  const checkEmailAvailability = async (email) => {
    try {
      const response = await apiClient.post("/user/check-email", { email });
      return response.data.status === "exists";
    } catch (error) {
      return false;
    }
  };

  const AddRoleData = (param) => {
    setSelectedRows(param.selectedRows);
  };
  const postRoleData = () => {
    setRolesData(selectedRows);
    selectedRows.map((row) => {
      apiClient
        .post("/user/role", {
          userId: userDetails.id,
          roleId: row.Id,
        })
        .then((response) => {});
        Alert("succ","Roles Added successfully")
    });
    handleClose();
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
        let newRoles = rolesData.filter((role) => role !== param);
        apiClient
          .delete("/user/role", {
            userId: userDetails.id,
            roleId: param.Id,
          })
          .then((response) => {});
        setRolesData(newRoles);
        Alert("succ"," User Role Deleted Successfully");
      } else {
        handleClose();
      }
    });
  };

  function postNewUser() {
    setdisabled(true);
    if (
      userDetails.firstName === "" ||
      userDetails.emailId === "" ||
      !department.value
    ) {
      Alert("warn", "User Name ,Email ID & Department can't be empty!");
      setdisabled(false);
    } else if (!validateEmail(userDetails.emailId)) {
      Alert("warn", "Invalid email format");
    } else {
      userDetails.firstName = userDetails.firstName.trim();
      userDetails.emailId = userDetails.emailId.trim();
      userDetails.departmentId = department.value;

      if (UserStatus) userDetails.isActive = 1;
      else userDetails.isActive = 0;
      if (LockStatus) userDetails.isLocked = 1;
      else userDetails.isLocked = 0;

      apiClient
        .post("/user/update", userDetails)
        .then((response) => {
          if (response?.data?.user.length > 0) {
            if (userDetails.id) {
              Alert("succ", "User Updated Successfully");
            } else {
              if (response.data.user === "Email Id is already registered") {
                Alert("warn", response.data.user);
                setdisabled(false);
              } else {
                setShowRolesTable(true);
                Alert("succ", "User Added Successfully");
                userDetails.id = response.data.user[0].UserId;
                setUserDetails(userDetails);
                setdisabled(true);
              }
            }
          } else {
            Alert("error", "Please Try Again");
          }
        })
        .catch((error) => {
          Alert("error", "Please Try Again");
        })
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter"&& !isdisabled) {
      e.preventDefault();
      postNewUser();
    }
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

  const column = [
    {
      name: "SERO_ID",
      selector: (param) => param.Id,
    },
    {
      name: "Role Name",
      selector: (param) => param.RoleName,
    },
    {
      name: "Role Description",
      selector: (param) => param.RoleDescription,
    },
    {
      name: "Actions",
      cell: (param) => (
        <FontAwesomeIcon
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
    apiClient
      .get("/lookup/Department/1")
      .then((response) => {
        if (response.data.lookup.length > 0) {
          const arr = [];
          response?.data?.lookup?.map((user) => {
            const obj = { value: user.Id, label: user.Name };
            arr.push(obj);
            setdepartmentList(arr);
          });
        }
      })
      .catch((err) => {
        Alert("warn", "Please Try Again");
      });
  }, []);

  useEffect(() => {
    apiClient.get("/user/roles/role").then((response) => {
      if (response?.data?.user) {
        setRolePopUp(response.data.user);
      }
    });
  }, []);

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
            navigate(Routes.UserM);
          }}
        >
          Users
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Create User</span>
      </div>

      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Create User</h2>
        </div>

        <div className="maincontent__card--content ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:justify-between">
            <Form.Group>
              <Form.Label>User Name</Form.Label>
              <Form.Control
                placeholder="User Name"
                value={userDetails.firstName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, firstName: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="email@example.com"
                value={userDetails.emailId}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    emailId: e.target.value.replace(/\s/g, ""),
                  })
                }
                onKeyDown={handleKeyDown}
              />
            </Form.Group>

            <div className="flex flex-col gap-2">
              <Form.Group className="flex items-center justify-start gap-8">
                <Form.Label>Is Active</Form.Label>
                <Form.Check type="checkbox" checked={UserStatus} />
              </Form.Group>

              <Form.Group className="flex items-center justify-start gap-6">
                <Form.Label>Is Locked</Form.Label>
                <Form.Check type="checkbox" checked={LockStatus} />
              </Form.Group>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-8 md:justifY-between">
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend"></div>
                <Select
                  options={departmentList}
                  required
                  value={department}
                  onChange={(e) => {
                    setdepartment(e);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </Form.Group>
          </div>
          <div className="flex justify-center gap-4 mt-8 md:justify-end">
            <button
              className="maincontent__btn maincontent__btn--primaryblue"
              onClick={postNewUser}
              disabled={isdisabled}
            >
              Save
            </button>
            <button
              className="maincontent__btn maincontent__btn--primaryblue"
              onClick={() => {
                navigate(Routes.UserM);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showRolesTable &&
        userDetails.firstName.trim() &&
        userDetails.emailId && (
          <div className="maincontent__card" style={{ margin: "1rem 0 0 0" }}>
            <div className="maincontent__card--header">
              <h2 className="maincontent__card--header-title">
                Roles Assigned
              </h2>
            </div>

            <div className="maincontent__pageheader-right">
              <button
                className="maincontent__btn maincontent__btn--primaryblue tableBottomBtn"
                onClick={() => setShowDefault(true)}
              >
                +Add Roles
              </button>

              <div className="addspace"></div>

              <Modal
                className="mdlclspop"
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
                    <Card.Body className="rmroldcb">
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

                  <div
                    className="flex justify-end gap-4 mt-4"
                    style={{
                      gap: "10px",
                      marginRight: "10px",
                      paddingBottom: "1rem",
                    }}
                  >
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
            </div>
            <div className="addspace"></div>
            <div className="maincontent__card--content ">
              <Card.Body className="rmroldcb">
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
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(CreateUser);
