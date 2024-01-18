import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import {
  ddmmyyyyFormat,
  yyyymmdd,
  isImageAttachment,
} from "../../common/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@themesberg/react-bootstrap";
import {
  faCalendarAlt,
  faClock,
  faMapPin,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../common/http-common";
import parse from "html-react-parser";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Routes } from "../../routes";

const vieweventregister = (state) => {
  const location = useLocation();
  const navigate = useNavigate();
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  const [logUserId] = useState(state.user.Id);
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const [eventname, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventendDate, setEventEndDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndTime] = useState();
  const [eventlocation, setEventLocation] = useState();
  const [eventdescription, setEventDescription] = useState("");
  const [SpeakerName, setSpeakerName] = useState("");
  const [editordata, setEditorData] = useState("");
  const [thumbImageList, setthumbImageList] = useState([]);
  const [banImageList, setBanImageList] = useState([]);

  useEffect(() => {
    apiClient
      .get("/kmarticle/getEventById/" + location.state.user.Id)
      .then((res) => {
        const user = res.data[0];
        setEventName(user.Title);
        setEventDate(yyyymmdd(user.Start_Date));
        setEventEndDate(yyyymmdd(user.End_Date));
        setStarttime(user.Start_Time);
        setEndTime(user.End_Time);
        setEventLocation(user.Location);
        setSpeakerName(user.SpeakerName);
        setEventDescription(parse(user.Description));
        setthumbImageList(user.thumbImg);
        setBanImageList(user.bannerImg);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (eventdescription) {
      setEditorData(eventdescription);
    }
  }, [eventdescription]);

  function formatTime(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    const formattedTime = time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  }

  return (
    <>
      <div className="fsMain">
        <div className="flex justify-between">
          {HideHomeBreadCumb && (
            <div className="maincontent__breadcrumb">
              <img
                className="cursor_pointer"
                src={HomeOutlineIcon}
                alt="home"
              />
              <span className="maincontent__breadcrumb--divider">/</span>
              <span
                className="cursor_pointer"
                onClick={() => { navigate(Routes.EventList); }}
              >
                Events{" "}
              </span>
              <span className="maincontent__breadcrumb--divider">/</span>
              <span className="maincontent__breadcrumb--active">
              Event Details
              </span>
            </div>
          )}
        </div>
      </div>
      <Card>
        <Card.Body>
          <div className="w-1/2 mx-auto">
            <div className="max-w-3xl rounded overflow-hidden shadow-lg">
              <div className="relative">
                {banImageList &&
                  banImageList.map((attachment, i) => {
                    const attachmentName = attachment.FilePath.split("/").pop();
                    const isImage = isImageAttachment(attachmentName);
                    return (
                      <div className="d-flex m-2 flex justify-center" key={i}>
                        <a
                          href={serverImgPath + attachment.FilePath}
                          download={true}
                        >
                          {isImage ? (
                            <img
                              className="w-full"
                              src={serverImgPath + attachment.FilePath}
                              alt={`Image ${i}`}
                            />
                          ) : (
                            <div className="block">
                              <a
                                className="filepath"
                                href={attachment.FilePath}
                              >
                                {attachment.FileName}
                              </a>
                            </div>
                          )}
                        </a>
                      </div>
                    );
                  })}
                {!banImageList || banImageList.length === 0 ? (
                  <div className="d-flex m-2 flex justify-center">
                    <img
                      className="w-full"
                      src="./images.png"
                      alt="Default Image"
                    />
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2  d-flex m-2 flex justify-center">
                  {eventname}
                </div>
                <div className="flex">
                  <p className="mr-4 flex-1" title="Location">
                    <FontAwesomeIcon icon={faMapPin} className="mr-1" />
                    {eventlocation}
                  </p>
                  <div className="flex-1 flex flex-col">
                    <p className="title" title="Time">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      <span className="ml-1">{formatTime(starttime)}</span>
                    </p>
                    <p className="title" title="Date">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                      <span className="ml-1">{ddmmyyyyFormat(eventDate)}</span>
                    </p>
                  </div>
                </div>
                <p title="Speaker Name">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {SpeakerName}
                </p>
                <p title="Description">{parse(eventdescription)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8 lg:justify-end">
            <button
              onClick={() => {
                const FromNewArticles = location.state.page === "newarticles";
                const destinationRoute = FromNewArticles
                  ? Routes.NewArticles
                  : Routes.EventRegister;

                navigate(destinationRoute);
              }}
              className="maincontent__btn maincontent__btn--primaryblue space_btn"
            >
              Back
            </button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(vieweventregister);
