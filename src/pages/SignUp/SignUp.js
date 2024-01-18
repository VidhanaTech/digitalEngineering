import React, { useState } from "react";
import "./SignUp.css";
import apiClient from "../../common/http-common";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import ElementsLogo from "../../assets/img/new-dashboard/Logo_white.svg";
const SignUp = () => {
  const [email, setEmail] = useState();
  const [validEmail, setValidEmail] = useState();
  const [inValidEmail, setInValidEmail] = useState();
  const [firstName, setFirstName] = useState("");
  const [inValidNames, setInValidNames] = useState();
  const [lastName, setLastName] = useState("");
  const [inValidLastNames, setInValidLastNames] = useState();
  const [phoneNum, setPhoneNum] = useState();
  const [inValidPhoneNo, setInValidMobile] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [InValidConfPassword, setInValidConfPassword] = useState("");
  const [validPassword, setValidPassword] = useState();
  const [inValidPassword, setInValidPassword] = useState();
  const [apiError, setApiError] = useState();
  const [agree, setAgree] = useState();

  const navigate = useNavigate();

  function validatePassword(pwd) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (re.test(pwd)) {
      setInValidPassword(false);
      setValidPassword(true);
    } else {
      setValidPassword(false);
      setInValidPassword(true);
    }
  }
  function validateConfirmPassword(pwd) {
    if (password == pwd) {
      setInValidConfPassword(false);
    } else {
      setInValidConfPassword(true);
    }
  }
  function validateEmail(email) {
    var emailRegex =
      /^[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
    if (emailRegex.test(email)) {
      setInValidEmail(false);
      setValidEmail(true);
    } else {
      setValidEmail(false);
      setInValidEmail(true);
    }
  }

  function validateFirstname(firstname) {
    var namesRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*/;
    if (namesRegex.test(firstname)) {
      setInValidNames(false);
    } else {
      setInValidNames(true);
    }
  }
  function validateLastname(lastname) {
    var namesRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*/;
    if (namesRegex.test(lastname)) {
      setInValidLastNames(false);
    } else {
      setInValidLastNames(true);
    }
  }

  function validateMobile(mobile) {
    var mobileRegex = /^((\\+91-?)|0)?[0-9]{10}$/;
    if (mobileRegex.test(mobile)) {
      setInValidMobile(false);
    } else {
      setInValidMobile(true);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var request = {
      email,
      password,
      firstName,
      lastName,
      phoneNum,
    };
    apiClient
      .post("/auth/register", request)
      .then((response) => {
        if (response.data.error) {
          setApiError(response.data.error);
        } else {
          navigate(Routes.RegisterMsg);
        }
      })
      .catch((err) => {
        setApiError("Bad Request!!");
      });
  };

  const isFormValid = () => {
    return (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      validPassword &&
      !inValidEmail &&
      !InValidConfPassword &&
      agree
    );
  };
  const handlePaste = (event) => {
    event.preventDefault();
  };
  return (
    <div className="Main">
      <div className="leftBox">
        <img src={ElementsLogo} className="w-2/3" />
      </div>
      <div className="rightBox">
        <div className="newUser">
          Already have an account?{" "}
          <a
            style={{ color: "#464bc1" }}
            href="javascript:void(0)"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </a>
        </div>
        <div className="mainContainer">
          <div className="Container reg-container">
            <h5 className="headTitle">5 Elements Signup</h5>
            <form onSubmit={handleSubmit}>
              <div class="midSection">
                {email && <label>Email Address</label>}
                <input
                  id="input__email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                    validateEmail(e.target.value.trim());
                  }}
                  placeholder="Email Address"
                  required
                />
                {inValidEmail && (
                  <div className="password-invalid position-absolute">
                    <div className="red-line">
                      <p className="pwddes position-relative">
                        Please enter a valid email address
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="registration-name">
                <div class="midSection">
                  {firstName && <label>First Name</label>}
                  <input
                    id="input__firstname"
                    name="firstname"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value.trim());
                      validateFirstname(e.target.value.trim());
                    }}
                    type="text"
                    placeholder="First Name"
                    required
                  />
                </div>
                {inValidNames && (
                  <div className="password-invalid position-absolute">
                    <div className="red-line">
                      <p className="pwddes position-relative errmargin newHighlight">
                        First Name must contain only alphabets
                      </p>
                    </div>
                  </div>
                )}

                <div class="midSection">
                  {lastName && <label>Last Name</label>}
                  <input
                    id="input__lastname"
                    name="lastname"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value.trim());
                      validateLastname(e.target.value.trim());
                    }}
                    type="text"
                    placeholder="Last Name"
                    required
                  />
                </div>

                {inValidLastNames && (
                  <div className="password-invalid position-absolute">
                    <div className="red-line">
                      <p className="pwddes position-relative  errmargin newHighlight2">
                        Last Name must contain only alphabets
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div class="midSection">
                {phoneNum && <label>Phone Number</label>}
                <input
                  id="input__phonenumber"
                  type="number"
                  name="phonenumber"
                  value={phoneNum}
                  onChange={(e) => {
                    setPhoneNum(e.target.value.trim());
                  }}
                  placeholder="Phone Number(Optional) "
                />
              </div>
              {inValidPhoneNo === false && (
                <div className="password-invalid position-absolute">
                  <div className="red-line"></div>
                </div>
              )}
              <div class="midSection">
                {password && <label>Password</label>}
                <input
                  id="input__password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value.trim());
                    validatePassword(e.target.value.trim());
                  }}
                  type="password"
                  placeholder="Password"
                />
                {validPassword && (
                  <div className="password-valid position-absolute">
                    <div className="green-line">
                      <p
                        className="position-relative  pwddes"
                        style={{ color: "green" }}
                      >
                        Password is strong
                      </p>
                    </div>
                  </div>
                )}
                {inValidPassword && (
                  <div className="password-invalid position-absolute">
                    <div className="red-line">
                      <p
                        className="position-relative pwddes"
                        style={{ marginBottom: "20px" }}
                      >
                        Password must contain 8 to 16 characters with atleast 1
                        uppercase, 1 digit, 1 special character.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div class="midSection">
                {confirmPassword && <label>Confirm Password</label>}
                <input
                  id="input__confirmpassword"
                  name="confirmpassword"
                  value={confirmPassword}
                  onPaste={(e) => handlePaste(e)}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value.trim());
                    validateConfirmPassword(e.target.value.trim());
                  }}
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              {InValidConfPassword && (
                <div className="password-invalid position-absolute">
                  <div className="red-line">
                    <p className="pwddes">Passwords not match</p>
                  </div>
                </div>
              )}
              {apiError && (
                <div className="errorsignin">
                  <p>{apiError}</p>
                </div>
              )}
              <button
                type="submit"
                class="signupBtn"
                className={!isFormValid() ? "signupBtn-dis" : "signupBtn"}
                disabled={!isFormValid()}
              >
                Sign Up
              </button>

              <div className="privacy-policy">
                <input
                  type="checkbox"
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <p className="policy">
                  By clicking Create account, I agree that I have read and
                  accepted the Terms of Use and Privacy Policy.
                </p>
              </div>
            </form>
          </div>
        </div>

        <footer className="reg-footer w-[80%] flex justify-center">
          <p className="footerText w-[60%] text-[12px]">
            Protected by reCAPTCHA and subject to the{" "}
            <a href="javascript:void(0)">Privacy Policy</a> and{" "}
            <a href="javascript:void(0)">Terms of Service</a>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignUp;
