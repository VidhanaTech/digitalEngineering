import React, { useState, useEffect } from "react";
import { Modal, Card, Form } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import apiClient from "../../common/http-common";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../components/Alert";
import { connect } from "react-redux";
import Swal from "sweetalert2";

const ApproveReview = (state) => {
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const navigate = useNavigate();
  const [logUserId] = useState(state.user.Id);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const [rolePopUp, setRolePopUp] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
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

  const AddRole = (param) => {
    setRolesList((prev) => [...prev, param]);
  };
  const AddRoleData = (param) => {
    setSelectedRows(param.selectedRows);
  };

  const postRoleData = async () => {
    setDisabled(true);
    const apiCalls = selectedRows.map((row) => {
      return apiClient.post("/kmarticle/review_approve_apply", {
        id: null,
        roleId: row.Id,
        userId: logUserId,
      });
    });

    try {
      await Promise.all(apiCalls);
      const [rolePopUpResponse, rolesListResponse] = await Promise.all([
        apiClient.get("/user/roles/role"),
        apiClient.post("/kmarticle/review_approve_list"),
      ]);

      const allModules = rolePopUpResponse.data.user;
      setRolePopUp(allModules);

      const newRolesList = rolesListResponse.data;
      setRolesList(newRolesList);
      Alert("succ", "Role Added Successfully");
      setDisabled(false);
      handleClose();
    } catch (error) {}
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
        setRolesList((prevRolesList) =>
          prevRolesList.filter((role) => role !== param)
        );
        apiClient
          .post("/kmarticle/review_approve_apply", {
            id: param.Id,
            roleId: null,
            userId: null,
          })
          .then((response) => {
            Alert("succ", "Role Deleted Successfully");
          });
      } else {
        handleClose();
      }
    });
  };

  const [rolesList, setRolesList] = useState([]);

  useEffect(() => {
    setLoading(true);
    apiClient
      .post("/kmarticle/review_approve_list")
      .then((response) => {
        setRolesList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  }, []);

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
    const fetchFilteredModules = async () => {
      try {
        const response = await apiClient.get("/user/roles/role");
        const allModules = response.data.user;

        // Create an array of roleIds in rolesList
        const rolesListRoleIds = rolesList.map((role) => role.RoleId);

        // Filter out roles from allModules that exist in rolesList
        const uniqueArray = allModules.filter(
          (item) => !rolesListRoleIds.includes(item.Id)
        );

        setRolePopUp(uniqueArray);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      }
    };

    fetchFilteredModules();
  }, [rolesList]);

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
        <span>Approve Roles</span>
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Roles Assigned</h2>
        </div>

        <div className="flex flex-col justify-start md:justify-end md:flex-row items-center my-2">
          <button
            className="maincontent__btn maincontent__btn--primaryblue tableBottomBtn mb-2"
            onClick={() => setShowDefault(true)}
          >
            +Add Roles
          </button>


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
                  disabled={disabled}
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
        <div className="maincontent__card--content">
          <Card.Body className="rmroldcb">
            {loading ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <DataTable
                columns={column}
                data={rolesList}
                highlightOnHover
                pagination
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={5}
              />
            )}
          </Card.Body>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ApproveReview);
