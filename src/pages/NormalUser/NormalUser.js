import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./NormalUser.css";
import {
    faCertificate,
    faChartSimple,
    faCircleChevronUp,
    faCircleChevronDown,
    faFileExcel,
    faUserGroup,
    faUserPlus,
    faClose,
    faSearch,
    faBookBookmark,
    faStar,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Form, Accordion } from "@themesberg/react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import Papa from "papaparse";
import excelicon from "../../assets/img/brand/excelicon.svg";

const NormalUser = () => {
    return (
        <>
            <div>
                <h3>Thanks for signingup</h3>
            </div>
        </>
    )
}

export default NormalUser