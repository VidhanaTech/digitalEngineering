import React, { useEffect, useState } from "react";
import "./roles.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import apiClient from "../../../common/http-common";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import DownloadIcon from "../../../assets/img/new-dashboard/download-icon.svg"
import { Link } from "react-router-dom";
import { Routes } from "../../../routes";
import { faPenToSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Papa from "papaparse";
import { Alert } from "../../../components/Alert";
import Swal from "sweetalert2";
import { connect } from "react-redux";

const Roles = (state) => {
  const [rolesData, setRolesData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRolesData();
  }, []);

  function getRolesData() {
    apiClient.get("/user/roles/role")
      .then((response) => {
        if (response.data.user.length > 0) {
          setRolesData(response.data.user);
          setNewRole(response.data.user);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  }

  const columns = [
    {
      name: "Role Name",
      selector: (param) => (<span title={param.RoleName}>{param.RoleName}</span>),
      sortFunction: (a, b) => a.RoleName.localeCompare(b.RoleName), 
      
    },
    {
      name: "Description",
      selector:(param) => (<span title={param.RoleDescription}>{param.RoleDescription}</span>),
      sortable: true,
      sortFunction: (a, b) => {
        const descriptionA = a.RoleDescription || "";
        const descriptionB = b.RoleDescription || "";
        return descriptionA.localeCompare(descriptionB);
      },

      },
    
    {
      name: "Default Page",
      selector: (param) => (<span title={param.ModuleName}>{param.ModuleName}</span>),
      sortable: true,
      sortFunction: (a, b) => a.ModuleName.localeCompare(b.ModuleName), 

    },
    {
      name: "Action",
      selector: (param) => (
        <>
          <FontAwesomeIcon
            style={{ color: "#1658a0", fontSize: "1.5em", cursor: "pointer" }}
            icon={faPenToSquare}
            title="edit role"
            onClick={() => {
              navigate(Routes.EditRole, { state: { id: param } });
            }}
          />
          {param.Id !== 1 ? (
            <FontAwesomeIcon
              style={{
                color: "red",
                fontSize: "1.5em",
                width: "2rem",
                cursor: "pointer",
              }}
              icon={faTrashAlt}
              title="delete role"
      
              onClick={() => {
                deleteRoleFunc(param.Id);
              }}
            />
          ) : null}
        </>
      ),
      // sortable: true,
      width: "100px",
    },
  ];

  const deleteRoleFunc = (id) => {
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
          .post("/user/role/role", { roleId: id })
          .then((res) => {
            if (res.data.user) {
              Alert("succ", "Role Deleted Successfully");
              getRolesData();
            } else Alert("warn", res.data.error);
          })
          .catch(() => {
            Alert("error", "Please Try Again");
          });
      }
    });
  };

  const handleSearch = (searchValue) => {
    setSearchValue(searchValue);

    if (!rolesData) {
      setRolesData([]);
    } else if (searchValue === "") {
      setRolesData(newRole);
    } else {
      const filteredData = rolesData.filter((item) => {
        return (
          item.RoleName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.ModuleName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.RoleDescription?.toLowerCase().includes(
            searchValue.toLowerCase()
          )
        );
      });

      setRolesData(filteredData);
    }
  };

  function handleExport(data) {
    const headers = [
      { label: "Role Name", key: "RoleName" },
      { label: "Description", key: "RoleDescription" },
    ];

    const exportData = data.map((row) =>
      headers.reduce((acc, header) => {
        if (row[header.key] === "start_date" || row[header.key] === "end_date")
          acc[header.label] = changeStartDateFormat(row[header.key]);
        else acc[header.label] = row[header.key];
        return acc;
      }, {})
    );
    const csvData = Papa.unparse(exportData);

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "Role Details.csv");
  }

  const navigate = useNavigate();

  return (
    <div className="main">
      <div className="flex flex-col justify-start md:justify-between md:flex-row items-center my-2">
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
          <span>User Management</span>
          <span className="maincontent__breadcrumb--divider">/</span>
          <span className="maincontent__breadcrumb--active">Roles</span>
        </div>
        <button
          className="maincontent__btn maincontent__btn--primaryblue w-fit"
          onClick={() => {
            navigate(Routes.createRol);
          }}
        >
          +Create Role
        </button>
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--header bg">
          <h2 className="maincontent__card--header-title text-black">Roles</h2>
        </div>

        <div className="maincontent__card--content  rdt_Pagination" style={{padding:"1rem 2rem 0rem 2rem"}}>
          <div className="flex items-center justify-end gap-2">

          <div className="relative search-containerKMArti kmarticle-seactform">
              <input
                type="search"
                placeholder="Search by role, description, default page"
                className="w-full pt-2 pb-2 pl-2 pr-[26%] text-xs border-0 rounded-[28px] outline-0 h-[34px]"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
                <button
                    type="button"
                    className="absolute top-1 right-1 bg-[rgba(0,0,0,60%)] rounded-[28px] h-[26px] text-white text-[10px] font-bold"
                  >
                    Search
                  </button>
            </div>
            <Link className="flexVerandHorCenter">
              <img
                src={DownloadIcon}
                onClick={() => handleExport(rolesData)}
                className="p-2 bg-[rgba(0,0,0,60%)] rounded-md"
                ></img>
            </Link>
          </div>
          <div>
            {loading ? (
              <div
                class="circle__loader items-center my-0 mx-auto"
              ></div>
            ) : (
              <DataTable
                title=""
                columns={columns}
                data={rolesData}
                pagination
                highlightOnHover
                paginationRowsPerPageOptions={[5, 10, 15]}
                paginationPerPage={10}
                className="mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(Roles);