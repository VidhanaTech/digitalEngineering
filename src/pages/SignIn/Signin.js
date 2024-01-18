import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Routes } from "../../routes"
import "./Signin.css"
import apiClient from "../../common/http-common"
import addRewardPoints from "../../common/AddRewardPoints"
import { connect } from "react-redux"
import {
  addUser,
  addRoles,
  isAdmin,
  defaultPage,
  leveDetails,
  approveReview,
  rewardPoints
} from "../../actions/actions"
import { Routes as appRoutes } from "../../routes"
import { Alert } from "../../components/Alert"
import ElementsLogo from "../../assets/img/new-dashboard/Logo_white.svg"
import KeyIcon from "../../assets/img/new_design/key-solid.svg"

const SignIn = ({ dispatch }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const [message, setMessage] = useState("")
  const [apiError, setApiError] = useState()
  const [emailInputClass, setEmailInputClass] = useState()
  const [pwdInputClass, setPwdInputClass] = useState()
  const [isdisable, setIsDisable] = useState(true)
  const [emailError, setEmailError] = useState("")
  const [pwdError, setPwdError] = useState("")
  const emailValidation = (email) => {
    setEmail(email)
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (!email) {
      setEmailError("Please enter Email Id")
      setApiError("")
      setEmailInputClass("input-error")
    } else if (regex.test(email) === false) {
      setEmailError("Please enter a valid Email Id")
      setApiError("")
      setEmailInputClass("input-error")
    } else {
      setEmailError("")
      setEmailInputClass("input-success")
      if (email && pwd) setIsDisable(false)
    }
  }

  const passwordValidation = (val) => {
    setPwd(val)
    if (!val) {
      setPwdError("Please enter Password")
      setPwdInputClass("input-error")
      setApiError("")
    } else {
      setPwdError("")
      setPwdInputClass("input-success")
      if (email && pwd) setIsDisable(false)
    }
  }

  const isFormValid = () => {
    if (email !== "" && pwd !== "") return true
    else {
      emailValidation(email)
      passwordValidation(pwd)
    }
  }
  const [submitClicked, setSubmitClicked] = useState(false)

  let handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitClicked(true)
    if (isFormValid() && !emailError && !pwdError) {
      var request = {
        email: email,
        password: pwd
      }
      apiClient
        .post("/auth/login", request)
        .then((response) => {
          if (response.data.user.error) {
            setApiError(response.data.user.error)
          } else {
            dispatch(addRoles(response.data.user))
            if (response.data.user.length > 0) {
              apiClient.get(`/user/${email}`).then((response) => {
                if (response.data.data.user.error) {
                  setApiError(response.data.data.user.error)
                } else {
                  addRewardPoints(
                    response.data.data.rewards
                      ? response.data.data.rewards[0].Points
                      : 0,
                    response.data.data.user
                      ? response.data.data.user[0].Id
                      : null,
                    response.data.data.rewards
                      ? response.data.data.rewards[0].Id
                      : null,
                    response.data.data.user
                      ? response.data.data.user[0].Id
                      : null
                  )
                  dispatch(approveReview(response.data.data.reviewApprove))
                  dispatch(leveDetails(response.data.data.level[0]))
                  dispatch(rewardPoints(response.data.data.rewards))
                  dispatch(
                    isAdmin(
                      response.data.data.rolelist.some(
                        (item) => item.RoleId === 1
                      )
                    )
                  )
                  dispatch(addUser(response.data.data.user[0]))
                  if (response.data.data.user[0].defaultPage) {
                    dispatch(
                      defaultPage(response.data.data.user[0].defaultPage)
                    )
                    navigate(response.data.data.user[0].defaultPage)
                  } else {
                    if (response.data.data.defaultPage) {
                      dispatch(defaultPage(response.data.data.defaultPage))
                      navigate(response.data.data.defaultPage)
                    } else navigate(appRoutes.DefaultPage)
                  }
                }
              })
            } else navigate(appRoutes.DefaultPage)
          }
        })
        .catch((err) => {
          setApiError("Bad Request!!")
        })
    } else {
      !email ? emailValidation() : passwordValidation()
    }
  }

  return (
    <>
      <div className="flex flex-col Main signin-bg">
        {/* <p className="flex justify-end w-full pr-8 text-white">New user? <a className="pl-2 underline"> Create an account</a></p> */}
        <div className="newUser"></div>
        <div className="w-2/3">
          <img
            src={ElementsLogo}
            className="w-[330px] pt-[1rem] pb-[2rem] my-0 mx-auto"
          />
          <div className="mainContainer bg-[rgba(255,255,255,70%)] rounded-[20px] p-8">
            <div className="flex flex-col w-full gap-4">
              <h5 className="font-medium text-[24px] text-[#202020]">
                {" "}
                Signin
              </h5>
              {/* <div className="flex gap-4 bg-[#989898] p-4 rounded-xl">
                <img src={KeyIcon} />
                <span className="text-white">Sign up with SSO</span>
              </div>
              <div className="relative pt-[15px]">
                <hr/>
                <span className="absolute bg-[#ccc] top-[3px] right-[50%] pl-[12px] pr-[12px]">or</span>
              </div> */}
              <form onSubmit={handleSubmit}>
                <div className="midSection" id="signin">
                  <label className="pl-0 text-[#4a5073] text-sm font-semibold">Email</label>
                  <input
                    className={email ? emailInputClass : ""}
                    type="email"
                    value={email}
                    onChange={(e) => emailValidation(e.target.value)}
                  />
                  {submitClicked && emailError ? (
                    <div className="errorsignin">
                      <p>{emailError}</p>
                    </div>
                  ) : null}
                </div>
                <div className="midSection" id="signin">
                  <label className="pl-0 text-[#4a5073] text-sm font-semibold">Password</label>
                  <input
                    className={pwd ? pwdInputClass : ""}
                    type="password"
                    value={pwd}
                    autoComplete="off"
                    onChange={(e) => passwordValidation(e.target.value)}
                  />
                  {submitClicked && pwdError ? (
                    <div className="errorsignin">
                      <p>{pwdError}</p>
                    </div>
                  ) : null}
                </div>
                {apiError ? (
                  <div className="errorsignin">
                    <p>{apiError}</p>
                  </div>
                ) : null}
                <div className="downSection">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      navigate(Routes.ForgotPassword)
                    }}
                  >
                    Forgot password?
                  </a>
                  <div className="flex gap-4">
                    {/* <button className="signinBtn bg-[#737373]" type="submit">
                      Register
                    </button> */}
                    <button className="signinBtn" type="submit">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
              <div className="message">{message ? <p>{message}</p> : null}</div>
            </div>{" "}
          </div>{" "}
          <footer className="flex justify-center w-full py-8">
            <p className="text-[12px] text-[#fff]">
              {/* Protected by reCAPTCHA and subject to the{" "} */}
              Subject to the <a href="javascript:void(0)">
                Privacy Policy
              </a> and <a href="javascript:void(0)">Terms of Service</a>.
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}

export default connect()(SignIn)
