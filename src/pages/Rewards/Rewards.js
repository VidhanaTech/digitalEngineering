import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import { faPenToSquare, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const TeamMembers = (state) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);
  const [editRow, setEditRow] = useState(null);
  const [editedValue, setEditedValue] = useState(null); // Store edited value
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true)
    apiClient
      .get("/user/reward/rewardpointslist")
      .then((res) => {
        const resData = res.data.user? res.data.user : res.data
        setData(resData);
        setLoading(false)
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("warn", "Please Try Again");
        }
      });
  };

  const regex = /^[0-9]*(\.[0-9]{0,2})?$/;

  const columns = [
    {
      name: "Category",
      selector: (param) => param.CategoryName,
      sortable: true,
    },

    {
      name: "Activity",
      selector: (param) => (
        <span title={param.Activity}>{param.Activity}</span>
      ),
      sortable: true,
    }, 
  {
    name: "Reward Points",
    selector: "Points",
    cell: (param) => {
      return (
        <div>
          {param === editRow ? (
            <input
              type="number"
              value={editedValue !== null ? editedValue : param.Points}
              onChange={(e) => setEditedValue(e.target.value)}
              min="0"
              step="1"
              autoFocus
            />
          ) : (
            <span>{param.Points}</span>
          )}
        </div>
      );
    },
  },
  {
    name: "Actions",
    cell: (param) => (
      <div className="flex space-x-2"> 
        {editRow === param ? (
          <>
            <button onClick={() => handleSaveChanges(param)} 
                        className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                        >
              <FontAwesomeIcon icon={faSave} size="lg" color="#1475DF" />
            </button>
            <button onClick={cancelEdit}
                        className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                        >
              <FontAwesomeIcon icon={faTimes} size="lg" color="#1475DF" />
            </button>
          </>
        ) : (
          <button onClick={() => editRow ? cancelEdit() : enterEditMode(param)}>
            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1475DF" />
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
  },
];

const handleSaveChanges = (row) => {
  if (editedValue !== null || editedValue === "") {
    const newValue = parseInt(editedValue, 10);

    if (!isNaN(newValue) && newValue >= 0) {
      if (row.Id) {
        apiClient
          .post("/user/reward/updateReward", {
            id: row.Id,
            points: newValue,
            userId: logUserId,
          })
          .then((res) => {
            getData();
            setEditRow(null);
            setEditedValue(null);
          })
          .catch(() => {
            Alert("error", "Please Try Again");
          });
      }
    }
  }
};

const enterEditMode = (row) => {
  setEditRow(row);
  setEditedValue(row.Points.toString());
};

const cancelEdit = () => {
  setEditRow(null);
  setEditedValue(null);
};


  return (
    <>
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
        <span>Rewards</span>
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ cursor: "pointer" }}
          >
            REWARDS
          </h2>
        </div>
       
        <div className="maincontent__card--content">
        {loading ? (
                  <div class="circle__loader items-center my-0 mx-auto"></div>
                ) : (
          <DataTable
            title=""
            columns={columns}
            data={data}
            className="RewardsTable"
            pagination
            highlightOnHover
            paginationRowsPerPageOptions={[5, 10, 15]}
            paginationPerPage={10}
          />
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(TeamMembers);
