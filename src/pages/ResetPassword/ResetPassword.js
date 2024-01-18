import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";


const ResetPassword = ({ dispatch }) => {
  const navigate = useNavigate();
  const [OldPwd, setOldPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState();
  const [emailInputClass, setEmailInputClass] = useState();
  const [pwdInputClass, setPwdInputClass] = useState();
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

  const isFormValid = () => {
    return OldPwd !== "" && pwd !== "";
  };

  let handleSubmit = async (e) => {
    // if (isFormValid() && !apiError) {
    //   var request = {
    //     email: email,
    //     password: pwd,
    //   };
    //   apiClient
    //     .post("/auth/login", request)
    //     .then((response) => {
    //       if (response.data.user.error) {
    //         setApiError(response.data.user.error);
    //       } else {
    //         // sessionStorage.setItem('roles', JSON.stringify(response.data.user));
    //         dispatch(addRoles(response.data.user));
    //         apiClient.get(`/user/${email}`).then((response) => {
    //           if (response.data.user.error) {
    //             setApiError(response.data.user.error);
    //           } else {
    //             // sessionStorage.setItem('user', JSON.stringify(response.data.user[0]));
    //             dispatch(addUser(response.data.user[0]));
    //           }
    //         });
    //         navigate(Routes.DashboardOverview);
    //       }
    //     })
    //     .catch((err) => {
    //       setApiError("Bad Request!!");
    //     });
    // } else {
    //   !OldPwd ? emailValidation() : passwordValidation();
    // }
  };

  return (
    <div className="Main">
      <div className="rightBox">
        <div className="mainContainer">
          <div className="Container">
            <h5 className="headTitle">Reset Password</h5>

            <div
              className="midSection"
              id="emailId">
              {OldPwd && <label>Old Password</label>}
              <input
                className={OldPwd ? emailInputClass : ""}
                placeholder="Old Password"
                type="password"
                value={OldPwd}
                onChange={(e) => oldPasswordValidation(e.target.value)}></input>
            </div>
            <div
              className="midSection"
              id="pwdId">
              {pwd && <label>New Password</label>}
              <input
                className={pwd ? pwdInputClass : ""}
                placeholder="New Password"
                type="password"
                value={pwd}
                onChange={(e) => passwordValidation(e.target.value)}></input>
            </div>
            <div
              className="midSection"
              id="pwdId">
              {confirmPwd && <label>Confirm New Password</label>}
              <input
                className={confirmPwd ? pwdInputClass : ""}
                placeholder="Confirm New Password"
                type="password"
                value={confirmPwd}
                onChange={(e) =>
                  validateConfirmPassword(e.target.value)
                }></input>
            </div>

            {apiError && (
              <div className="errorsignin position-absolute">
                <p>{apiError}</p>
              </div>
            )}
            <div className="downSection">
              <a href="">Forgot password?</a>
              <button
                className="signinBtn"
                type="submit"
                onClick={handleSubmit}>
                Reset
              </button>
            </div>

            <div className="message">{message ? <p>{message}</p> : null}</div>
          </div>{" "}
          {/*container closing div*/}
        </div>{" "}
        {/*mainContainer closing div*/}
      </div>{" "}
      {/*rightsidebox closing div*/}
    </div>
  );
};

export default ResetPassword;
