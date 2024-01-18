import React, { useState, useEffect } from "react";
import {  Form } from "@themesberg/react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../common/http-common";
import { Routes } from "../../../routes";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../../components/Alert";
import Swal from "sweetalert2";
import { connect } from "react-redux";

const ApproveUser = (state) => {
  const [showDefault, setShowDefault] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [PhoneNo, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [UserStatus, setUserStatus] = useState(false);
  const [LockStatus, setLockStatus] = useState(true);
  const [showResetField, setShowResetField] = useState(false);
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);

  useEffect(() => {
    if (location?.state?.user) {
      setUserId(location?.state?.user?.Id);
      setFirstName(location?.state?.user?.FirstName);
      setLastName(location?.state?.user?.LastName);
      setEmailId(location?.state?.user?.EmailId);
      setPhone(location?.state?.user?.PhoneNo);
      setUserStatus(true);
      setLockStatus(false);
    }
  }, []);

  const approveUser = () => {
    apiClient
      .post("/user/user_approve", {
        Id: location.state.user.Id,
        isActive: true,
        isLocked: location.state.user.IsLocked,
        userId: logUserId,
      })
      .then((res) => {
        navigate(Routes.UserM);
        Alert("succ", "User Added");
      })
      .catch((error) => {
        Alert("err", "please try again!");
      });
  };

  const RejectUser = () => {
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
          .delete("/user/" + location.state.user.Id)
          .then((res) => {
            navigate(Routes.RegisterLit);
            Alert("succ", "Reject User");
          })
          .catch((error) => {
            Alert("err", "please try again!");
          });
      }
    });
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
        <span className="cursor_pointer"
          onClick={() => {
            navigate(Routes.UserM);
          }}
        >
          Users
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Approve User</span>
      </div>
      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header ">
          <h2 className="maincontent__card--header-title text-black">User Details</h2>
        </div>

        <div className="maincontent__card--content">
          <Form.Group className="mb-3 mb3form">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              User ID
            </Form.Label>
            <Form.Control
              className="formconus"
              type="email"
              disabled={true}
              value={userId}
              style={{ width: "60%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3 mb3form">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              First Name
            </Form.Label>
            <Form.Control
              className="formconus"
              disabled={true}
              type="email"
              value={FirstName}
              style={{ width: "60%" }}
            />
          </Form.Group>
          <Form.Group className="mb-3 mb3form">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              Last Name
            </Form.Label>
            <Form.Control
              className="formconus"
              disabled={true}
              type="email"
              value={LastName}
              style={{ width: "60%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3 mb3form">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              Email ID
            </Form.Label>
            <Form.Control
              className="formconus"
              disabled={true}
              type="email"
              value={emailId}
              style={{ width: "60%" }}
            />
          </Form.Group>

          <Form.Group className="mb-3 mb3form">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              Phone Number
            </Form.Label>
            <Form.Control
              className="formconus"
              disabled={true}
              type="email"
              style={{ width: "60%" }}
              value={PhoneNo}
            />
          </Form.Group>

          <Form.Group className="mb-3 mb3form mb3f">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              Is Active
            </Form.Label>
            <Form.Check
              className="formconus chckbx"
              disabled={true}
              type="checkbox"
              checked={UserStatus}
              value={UserStatus}
            />
          </Form.Group>

          <Form.Group className="mb-3 mb3form mb3f">
            <Form.Label
              className="formlblus"
              style={{ display: "inline-block", width: "40%" }}
            >
              Is Locked
            </Form.Label>
            <Form.Check
              className="formconus chckbx"
              type="checkbox"
              disabled={true}
              checked={LockStatus}
              value={LockStatus}
            />
          </Form.Group>

          <div className="flex space-x-4 justify-end">
          <button className="maincontent__btn maincontent__btn--primaryblue authorBtn" onClick={approveUser}>
            Approve
          </button>
          <button className="maincontent__btn maincontent__btn--primaryblue authorBtn" onClick={RejectUser}>
            Reject
          </button>
          <button onClick={() => navigate(Routes.RegisterLit)} className="maincontent__btn maincontent__btn--primaryblue authorBtn">
            Cancel
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ApproveUser);
