import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../common/http-common";
import { Routes } from "../../routes";
import { connect } from "react-redux";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "../../components/Alert";
import { ddmmyyyyFormat } from "../../common/Helper";
import addRewardPoints from "../../common/AddRewardPoints";

const EventCard = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [logUserId] = useState(state.user.Id);
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventLoading, setEventLoading] = useState({});
  const itemsPerPage = 10;

  useEffect(() => {
    EventList();
  }, []);

  function EventList() {
    apiClient
      .get("kmarticle/event_list_register/" + logUserId)
      .then((res) => {
        setOriginalData(res.data);
        setLoading(false);
      })
      .catch(() => {});
  }

  function EventRegister(eventid) {
    setEventLoading((prevLoading) => ({
      ...prevLoading,
      [eventid]: true,
    }));

    let data = {
      id: null,
      eventId: eventid,
      userId: logUserId,
    };

    apiClient
      .post("/kmarticle/event_register", data)
      .then((res) => {
        Alert("succ", "Registered Successfully");
        addRewardPoints(
          state.rewards[10].Points,
          logUserId,
          state.rewards[10].Id,
          logUserId
        );
        setEventLoading((prevLoading) => ({
          ...prevLoading,
          [eventid]: false,
        }));
        setLoading(false);
        EventList();
      })
      .catch(() => {
        setEventLoading((prevLoading) => ({
          ...prevLoading,
          [eventid]: false,
        }));
      });
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = originalData.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="flex justify-between">
        {HideHomeBreadCumb && (
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
            <span>Events</span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">
              Events Registration
            </span>
          </div>
        )}
      </div>
      {loading ? (
        <div class="circle__loader items-center my-0 mx-auto"></div>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {currentData.map((article, index) => (
            <div
              key={index}
              className="w-1/5 px-2 mb-4"
            >
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a>
                  <img
                    className="rounded-t-lg registerimg"
                    src={
                      article.thumImg
                        ? serverImgPath + article.thumImg
                        : "/images.png"
                    }
                    alt=""
                    onClick={() => {
                      navigate(Routes.ViewEventRegister, {
                        state: {
                          user: article,
                          page: Routes.EventRegister,
                          fromFirstPage: true,
                        },
                      });
                    }}
                  />
                </a>
                <div className="p-5">
                <a className="flex items-center justify-between">
                  <div style={{ fontSize: "10px" }}>
                    <FontAwesomeIcon icon={faMapPin} className="mr-1" />
                    {article.Location.length > 15
                      ? article.Location.slice(0, 15) + "..."
                      : article.Location.charAt(0).toUpperCase() + article.Location.slice(1)}
                  </div>
                  <div style={{ fontSize: "10px" }}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                    {ddmmyyyyFormat(article.Start_Date)}
                  </div>
                </a>
                  <br />
                  <h5
                    className="mb-2 text-base tracking-tight text-gray-900 dark:text-black cursor-pointer"
                    onClick={() => {
                      navigate(Routes.ViewEventRegister, {
                        state: {
                          user: article,
                          page: "event-register",
                          fromFirstPage: true,
                        },
                      });
                    }}
                  >
                    {article.Title.charAt(0).toUpperCase() +
                      article.Title.slice(1)}
                  </h5>
                  <div className="flex justify-center items-center">
                    {article.regStatus ? (
                      <span
                        className="rounded-full maincontent__btn articles__rightcard--status articles__rightcard--published registered"
                      >
                        Registered
                      </span>
                    ) : (
                      <button
                        className="rounded-full maincontent__btn maincontent__btn--primaryblue"
                        onClick={() => EventRegister(article.Id)}
                        disabled={eventLoading[article.Id]}
                      >
                        {eventLoading[article.Id]
                          ? "Registering..."
                          : "Register"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center mt-4 ml-4 pagi">
        <Pagination
          color="primary"
          className="flex justify-center items-center"
          size="large"
          count={Math.ceil(originalData.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(EventCard);
