import React, { useState } from "react"
import CircleIcon from "../assets/img/icons/circle.svg"
import ProfileImg from "../assets/img/profile.jpg"
import { Image } from "@themesberg/react-bootstrap"
import { connect } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAddressBook,
  faCalendarDays,
  faChartColumn,
  faCircleChevronDown,
  faCircleChevronRight,
  faHouseChimneyWindow,
  faStore,
  faUsers
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

export const SidebarKM = () => {
  const navigate = useNavigate()
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <Image
          src={ProfileImg}
          alt="profile"
          className="sidebar__profile--pic"
        />
        <div className="sidebar__profile--namesec">
          <p className="sidebar__profile--namesec-name">Administrator</p>
          <p className="sidebar__profile--namesec-status">
            <Image
              src={CircleIcon}
              className="sidebar__profile--namesec-icon"
            />
            Online
          </p>
        </div>
      </div>
      <ul className="sidebar__ul">
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className="sidebar__a"
            onClick={() => {
              navigate("/kmdashboard/overview")
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              KM Dashboard
            </span>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="sidebar__icons--chevron"
            />
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className="sidebar__a"
            onClick={() => {
              navigate("/kmarticles/overview")
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              KM Articles
            </span>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="sidebar__icons--chevron"
            />
          </a>
        </li>
        <li className="sidebar__li">
          <a
            href="javascript:void(0)"
            className="sidebar__a"
            onClick={() => {
              navigate("/chatgpt/overview")
            }}
          >
            <span className="sidebar__a--span">
              <FontAwesomeIcon
                icon={faHouseChimneyWindow}
                className="sidebar__icons"
              />
              ChatGPT
            </span>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="sidebar__icons--chevron"
            />
          </a>
        </li>
      </ul>
      <div className="sidebar__links">
        <a href="#" className="sidebar__links--a">
          About
        </a>
        <a href="#" className="sidebar__links--a">
          Privacy & Policy
        </a>
        <a href="#" className="sidebar__links--a">
          Contact
        </a>
      </div>
    </div>
  )
}
