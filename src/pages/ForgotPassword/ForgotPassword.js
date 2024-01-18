import React, { useState } from "react"
import apiClient from "../../common/http-common"
import { useNavigate } from "react-router-dom"
import { Routes } from "../../routes"
import ElementsLogo from "../../assets/img/new-dashboard/Logo_white.svg"
import { Alert } from "../../components/Alert"
import "./ForgotPassword.css"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [emailValue, setEmailValue] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleChange = (event) => {
    setEmailValue(event.target.value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailValue) {
      setEmailError("Please enter an email address.")
    } else if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter an Valid email address.")
    } else {
      setEmailError("")
    }
  }

  const addPassword = (e) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailValue) {
      setEmailError("Please enter an email address.")
    } else if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter an Valid email address.")
    } else {
      apiClient
        .post("/auth/forgot-password", { EmailId: emailValue })
        .then((res) => {
          if (res.data === "User Not Found") {
            setEmailError(res.data)
          } else {
            navigate(Routes.Signin)
            Alert("success", "Password reset link sent to email")
          }
        })
        .catch((err) => {
          setEmailError("Please try again!")
        })
    }
  }
  return (
    <div className="flex flex-col Main signin-bg gap-y-4">
      <div className="newUser text-[#fff]">
        Back To{" "}
        <a
          className="hover:text-[#fff]"
          href="javascript:void(0)"
          onClick={() => {
            navigate("/login")
          }}
        >
          Sign In
        </a>
      </div>
      <div className="w-2/3">
        <img
          src={ElementsLogo}
          className="w-[330px] pt-[1rem] pb-[2rem] my-0 mx-auto"
        />
        <div className="mainContainer bg-[rgba(255,255,255,70%)] rounded-[20px] p-8">
          <div className="container">
            <h5 className="headTitle">Forgot Password</h5>
            <form onSubmit={addPassword}>
              <div className="midSections" id="emailId">
                <label>Email Address</label>
                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) => handleChange(e)}
                />
                {emailError ? (
                  <div className="errorsignin" align="left">
                    <p>{emailError}</p>
                  </div>
                ) : null}
              </div>
              <div align="right">
                <button className="btn btnButton">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
        <footer className="flex justify-center w-[40%] py-8 mx-auto my-0">
          <p className="text-[12px] text-[#fff]">
            Protected by reCAPTCHA and subject to the{" "}
            <a href="javascript:void(0)"> Privacy Policy </a> <br />
            and
            <a href="javascript:void(0)"> Terms of Service </a>.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default ForgotPassword
