import React, { useEffect, useState, useRef } from "react";
import ElementsLogo from "../assets/img/new-dashboard/Logo.svg";
import BarsIcon from "../assets/img/icons/bars-solid.svg";
import ProfilePic from "../assets/img/team/profile-picture-1.jpg";
import SearchIcon from "../assets/img/icons/magnifying-glass-solid.svg";
import ChevronIcon from "../assets/img/icons/arrow-blue-icon.svg";
import { Image } from "@themesberg/react-bootstrap";
import apiClient from "../../src/common/http-common";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Routes } from "../routes";
import { Modal, Card, Form, Col } from "@themesberg/react-bootstrap";
import { Alert } from "../components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloseIcon from "../assets/img/icons/closs_icon.png";
import { useNavigate } from "react-router-dom";
import {
  faArrowRightFromBracket,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { collapseIcon, addRoles, addUser } from "../actions/actions";
import { getPoints } from "../common/Helper";
const Navbar = (state) => {
  // const user = JSON.parse(sessionStorage.getItem("user"));
  const user = state.user;
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const popupRef = useRef(null);
  const [hideSidebar, setHideSidebar] = useState(true);
  const navigate = useNavigate();
  const [OldPwd, setOldPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [apiError, setApiError] = useState();
  const [pwdInputClass, setPwdInputClass] = useState();
  const [validCurPass, setValidCurPass] = useState(false);
  const [validNewPass, setValidNewPass] = useState(false);
  const [validConPass, setValidConPass] = useState(false);
  const handleClose = () => {
    setShowDefault(false);
    // setOldPwd("");
    // setPwd("");
    // setConfirmPwd("");
    // setApiError("");
    // setPwdInputClass("");
  };

  useEffect(() => {
    if (!showDefault) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDefault]);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setProfile(false);
    }
  };

  // const oldPasswordValidation = (pwd) => {
  //   setOldPwd(pwd);
  //   if (!pwd) {
  //     setApiError("Please enter Old Password");
  //     setPwdInputClass("input-error");
  //   } else {
  //     setApiError("");
  //     setPwdInputClass("input-success");
  //   }
  // };

  // const passwordValidation = (pwd) => {
  //   let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  //   setPwd(pwd);
  //   if (re.test(pwd)) {
  //     setApiError("");
  //     setPwdInputClass("input-success");
  //   } else {
  //     setApiError("Enter a valid Password");
  //     setPwdInputClass("input-error");
  //   }
  // };

  // function validateConfirmPassword(password) {
  //   setConfirmPwd(password);
  //   if (password == pwd) {
  //     // setConfirmPwd(false);
  //     setApiError("");
  //     setPwdInputClass("input-success");
  //   } else {
  //     //setConfirmPwd(true);
  //     setApiError("Passwords do not match");
  //     setPwdInputClass("input-error");
  //   }
  // }

  const logoutFunc = () => {
    dispatch(addRoles(""));
    dispatch(addUser(""));
    navigate("/");
  };
  const saveNewPassword = (e) => {
    e.preventDefault();
    if (!OldPwd || !pwd || !confirmPwd) {
      if (!OldPwd) setValidCurPass("Please Enter Old Password");
      if (!pwd) setValidNewPass("Please Enter New Password");
      if (!confirmPwd) setValidConPass("Please Enter Confirm Password");
      return;
    }

    if (
      !pwd ||
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(pwd)
    ) {
      setApiError(
        "Enter a valid New Password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)"
      );
      return;
    }

    if (pwd !== confirmPwd) {
      setApiError("Passwords do not match");
      setPwdInputClass("input-error");
      return;
    }

    // Clear any previous errors if all validations pass
    setApiError("");
    setPwdInputClass("input-success");

    // Create a data object with the required parameters for the API
    const data = {
      id: user?.Id,
      oldPassword: OldPwd,
      newPassword: pwd,
    };

    // Make the API call using Axios
    apiClient
      .post("/auth/change-password", data)
      .then((response) => {
        if (response.data.message === "User not found")
          Alert("error", "Password changed successfully");
        else {
          Alert("succ", "Password changed successfully");
          handleClose();
        }
      })
      .catch((error) => {
        Alert("error", "Error changing password. Please try again.");
      });
  };

  useEffect(() => {
    collapseFunc();
  }, []);

  const collapseFunc = () => {
    setHideSidebar(!hideSidebar);
    dispatch(collapseIcon(!hideSidebar));
  };

  return (
    <>
      <div className="nav">
        <div className="nav__left">
          <Link to={state.defaultpage}>
            <Image src={ElementsLogo} className="nav__left--logo" />
          </Link>
          {!state.showSideBar && (
            <>
              <Image
                // src={state.collapse ? CloseIcon : BarsIcon}
                src={BarsIcon}
                onClick={() => collapseFunc()}
                className="cursor-pointer nav__left--bars"
              />
            </>
          )}
          {/* <div className="hidden md:flex nav__left--searchbox">
          <input
            type="search"
            className="nav__left--search"
            placeholder="Search..."
          />
          <Image src={SearchIcon} className="nav__left--searchicon" />
        </div> */}
        </div>
        <div className="nav__right">
          {/* <Image src={MailIcon} className="nav__right--icon" />
        <div className="nav__right--notification">
          <Image src={NotificationsIcon} className="nav__right--icon" />
          <span className="nav__right--notifynum">4</span>
        </div>
        <Image src={USFlagIcon} className="nav__right--flag" /> */}
        {/* <a href="" className="text-[#388eff] text-[15px] font-semibold underline">My Page</a> */}
        {/* <span className="w-[1px] h-[40px] bg-[#388eff] opacity-50"></span> */}
          <div className="flex items-center gap-4">
            <>
              <div className="items-center hidden md:flex">
                <img
                  src={ProfilePic}
                  alt="Profile Picture"
                  className="maincontent__card--kmDashboard-contributorsPic"
                />
              </div>
              <div className="flex flex-col text-black">
                {user?.FirstName} {user?.LastName}
                <br></br>
                <span className="text-xs">
                  {"  "}
                  {getPoints(
                    state.user.DepartmentId,
                    state.user.RewardPoints
                  )}{" "}
                  | <span className="text-[#e18001]">{state.user.RewardPoints.toLocaleString() + " Credits"}</span>
                </span>
              </div>
            </>
          </div>
          {/* <p
            className="nav__right--logname navbar"
            style={{ padding: "0 0.2em" }}
          >
            <>
              <span className="user-profile">
                <img
                  src={ProfilePic}
                  alt="Profile Picture"
                  className="maincontent__card--kmDashboard-contributorsPic"
                />
                {state.levels.level}
              </span>
              {user?.FirstName} {user?.LastName}
            </>
          </p> */}
          {/* <Image src={ElementsLogo} className="w-24" /> */}
          <Image
            src={ChevronIcon}
            className="mt-2 cursor-pointer md:mt-0 nav__right--chevron"
            onClick={() => setProfile(!profile)}
          />
          {profile && (
            <div className="text-black nav__right--profile" ref={popupRef}>
              <p
                className="flex items-center gap-3 cursor-pointer hover:text-[#2d9800]"
                onClick={() => {
                  setShowDefault(true);
                }}
              >
                <FontAwesomeIcon icon={faKey} />
                <span className="cursor-pointer">Change Password</span>
              </p>

              {showDefault && (
                <Modal
                  as={Modal.Dialog}
                  centered
                  show={showDefault}
                  onHide={() => setShowDefault(false)}
                >
                  <div
                    className="maincontent__card--body bg-[#fff]"
                    style={{ marginTop: "10px", width: "100%" }}
                  >
                    <div className="maincontent__card--header bg-[#e0e0e0]">
                      <h2 className="maincontent__card--header-title">
                        CHANGE PASSWORD
                      </h2>
                    </div>
                    <div className="maincontent__card--content bg-[#fff] rounded-[20px]">
                      <form onSubmit={saveNewPassword}>
                        <Col>
                          <div className="midSection" id="signin">
                            {/* <label>Current Password</label> */}
                            <input
                              type="password" className="bg-[rgba(236,236,236,43%)]" placeholder="Current Password"
                              value={OldPwd}
                              onChange={(e) => {
                                setOldPwd(e.target.value.trim());
                                e.target.value.trim()
                                  ? setValidCurPass(false)
                                  : setValidCurPass(true);
                              }}
                            />
                          </div>
                          {validCurPass && (
                            <span className="errorsignin position-absolute">
                              <p>Please Enter Current Password</p>
                            </span>
                          )}
                          <div
                            className="midSection"
                            id="signin"
                            style={{ marginTop: "5%" }}
                          >
                            {/* <label>New Password</label> */}
                            <input
                              type="password" className="bg-[rgba(236,236,236,43%)]" placeholder="New Password"
                              value={pwd}
                              onChange={(e) => {
                                setPwd(e.target.value.trim());
                                e.target.value.trim()
                                  ? setValidNewPass(false)
                                  : setValidNewPass(true);
                              }}
                            />
                          </div>
                          {validNewPass && (
                            <span className="errorsignin position-absolute">
                              <p>Please Enter New Password</p>
                            </span>
                          )}
                          <div
                            className="midSection"
                            id="pwdId"
                            style={{ marginTop: "5%" }}
                          >
                            {/* <label>Confirm Password</label> */}
                            <input
                              type="password" className="bg-[rgba(236,236,236,43%)]" placeholder="Confirm Password"
                              value={confirmPwd}
                              onChange={(e) => {
                                setConfirmPwd(e.target.value.trim());
                                e.target.value.trim()
                                  ? setValidConPass(false)
                                  : setValidConPass(true);
                              }}
                            />
                          </div>
                          {validConPass && (
                            <span className="errorsignin position-absolute">
                              <p>Please Enter Confirm Password</p>
                            </span>
                          )}
                        </Col>
                        {/* </div> */}
                        {apiError && (
                          <span className="errorsignin position-absolute">
                            <p>{apiError}</p>
                          </span>
                        )}
                        <div
                          // className="savecanBtn casabtnPop"
                          align="right"
                          style={{ marginTop: "5%" }}
                        >
                          <button type="submit" className="btn btn-info bg-[#050346] border-none rounded-[20px]">
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-info  bg-[#b9a018] border-none rounded-[20px]"
                            onClick={handleClose}
                          >
                            Close
                          </button>
                        </div>
                        {/* </div> */}
                      </form>
                    </div>
                  </div>
                </Modal>
              )}

              <span
                onClick={() => logoutFunc()}
                className="flex items-center gap-3 text-black cursor-pointer hover:text-[#2d9800]"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span className="cursor-pointer">Logout</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Navbar);
