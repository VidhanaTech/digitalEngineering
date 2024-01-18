import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../components/Alert";
import { Card } from "@themesberg/react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../common/http-common";
import { Routes } from "../../routes";
import {
  faHeart,
  faMessage,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import {
  datetimeClockFormat,
  isImageAttachment,
  ddmmyyyyFormat,
} from "../../common/Helper";
import { connect } from "react-redux";
import addRewardPoints from "../../common/AddRewardPoints";
import parse from "html-react-parser";

const ApproveArticle = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const ApiUrl = process.env.REACT_APP_IMG_PATH;
  const navigate = useNavigate();
  const location = useLocation();
  const [comment, setcomment] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [logUserId] = useState(state.user.Id);
  const [commentList, setCommentList] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewStatus, setViewStatus] = useState(1);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const speak = (text) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    setSpeechSynthesis(synth);
    if (!isPlaying) {
      setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
      };
      synth.speak(utterance);
    } else {
      setIsPlaying(false);
      synth.pause();
    }
  };

  const [article, setArticle] = useState({
    title: "",
    AuthorName: "",
    CategoryName: "",
    Description: "",
    KeyWords: "",
    CreatedAt: "",
    Likes: "",
    Comments: "",
    ViewStatus: "",
    FilePath: [],
  });

  const [description, setDescription] = useState("");

  const [vxArticle, setVxArticle] = useState({
    title: "",
    AuthorName: "",
    CategoryName: "",
    Description: "",
    KeyWords: "",
    CreatedAt: "",
    Likes: "",
    Comments: "",
    ViewStatus: "",
    FilePath: [],
    type: "",
  });

  useEffect(() => {
    apiClient
      .post("/kmarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        setArticle(res.data[0]);
        setDescription(parse(res.data[0].Description));
        setViewStatus(res.data[0].ViewStatus);
      })
      .catch((error) => {});

    getComments();
  }, []);

  useEffect(() => {
    apiClient
      .post("/vxarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        autofill(resdata.SourceId);
        setVxArticle(res.data[0]);
      })
      .catch((error) => {});
    getComments();
  }, []);

  function getComments() {
    apiClient
      .get("/kmarticle/article_revision_get/" + location.state.user.Id)
      .then((res) => {
        setCommentList(res.data.data);
      })
      .catch((error) => {});
  }

  const approveArtical = () => {
    setDisabled(true);
    apiClient
      .post("/kmarticle/article_approve", {
        id: location.state.user.Id,
        userid: 1,
        status: 1,
        viewstatus: viewStatus,
      })
      .then((res) => {
        addRewardPoints(
          state.rewards[3].Points,
          article.ArticleBy,
          state.rewards[3].Id,
          logUserId
        );
        navigate(Routes.KMUnpublished);
        Alert("succ", "Published Successfully");
        setDisabled(false);
      })
      .catch((error) => {
        Alert("err", "please try again!");
        setDisabled(false);
      });
  };

  const submitComment = () => {
    setDisabled(true);
    if (comment && location.state.user.Id) {
      const getState = localStorage.getItem("state");
      const getUserId = JSON.parse(getState);
      let data = {
        articleId: location.state.user.Id,
        comment: comment,
        userId: getUserId.user.Id,
      };
      apiClient
        .post("/kmarticle/article_revision", data)
        .then((res) => {
          if (res.data[0].LV_Id) {
            apiClient
              .post("/kmarticle/article_revision_set", {
                id: location.state.user.Id,
                status: 3,
                userId: getUserId.user.Id,
              })
              .then(() => {
                navigate(Routes.KMUnpublished);
                Alert("succ", "Artifacts has been send back");
                setcomment("");
                setDisabled(false);
                getComments();
                addRewardPoints(
                  state.rewards[8].Points,
                  logUserId,
                  state.rewards[8].Id,
                  logUserId
                );
              });
          } else Alert("error", "Please Try Again");
        })
        .catch(() => {
          Alert("error", "Please Try Again");
        });
    } else setDisabled(false);
  };

  const handleBreadcrumbClick = () => {
    if (location.state.page === "unpublished") {
      navigate(Routes.KMUnpublished);
    } else {
      navigate(Routes.MyArticle);
    }
  };

  return (
    <div>
      <div className="flex-wrap d-flex justify-content-between flex-md-nowrap align-items-center">
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
            <span
              className="maincontent__breadcrumb--active breadCrumbHeader"
              onClick={handleBreadcrumbClick}
            >
              {" "}
              {location.state.page === "unpublished"
                ? "Artifacts for Review"
                : "My Articles"}
            </span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">Article</span>
          </div>
        )}
      </div>
      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">
            KM ARTICLE DETAILS
          </h2>
        </div>
        <div className="maincontent__card--content">
          <div>
            <h1 className="text-2xl font-bold">
              {article.title}
              <FontAwesomeIcon
                style={{ marginLeft: "10px" }}
                icon={isPlaying ? faPause : faPlay}
                className="cursor-pointer"
                onClick={() => {
                  speak(parse(article.Description));
                }}
                title={isPlaying ? "Pause" : "Play"}
              />
              <div className="ArticleDetailss">
                <div>{article.AuthorName} | </div>
                <div>{ddmmyyyyFormat(article.CreatedAt)} | </div>
                <div>{article.CategoryName}</div>
              </div>
            </h1>

            <div className="likesncmts">
              {location.state.user.StatusId !== 2 ? (
                <div>
                  <span className="IconSpan">
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{ marginRight: "4px" }}
                    />
                    {article.Likes}
                  </span>
                  <span className="IconSpan2">
                    {" "}
                    <FontAwesomeIcon
                      icon={faMessage}
                      style={{ marginRight: "4px" }}
                    />
                    {article.Comments}{" "}
                  </span>
                </div>
              ) : null}
            </div>

            <p
              className="ArticleDesc"
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
            <div>
              <div className="mt-4 clrBlue">
                <p>{article.KeyWords}</p>
              </div>
              {location.state.page === "unpublished" ? (
                <>
                  <div className="flex flex-1 gap-4 md:col-span-3">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="flex items-center gap-2 col-span-1">
                        <p>View Status</p>
                        <label className="toggle-button cursor-pointer">
                          <input
                            type="checkbox"
                            checked={viewStatus === 1}
                            onClick={() => {
                              viewStatus === 1
                                ? setViewStatus(2)
                                : setViewStatus(1);
                            }}
                          />

                          <span className="slider"></span>
                          <span
                            className={`slider-text ${
                              viewStatus === 1 ? "public" : "private"
                            }`}
                          >
                            {viewStatus === 1 ? "Public" : "Private"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>{" "}
                </>
              ) : null}
              {/* {location.state.page !== "unpublished" && (
                <div className="viewStatusDisplay">
                  <div className="flex flex-1 gap-4 md:col-span-3">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="flex items-center gap-2 col-span-1">
                        <p>View Status</p>
                        <label className="toggle-button">
                          <input
                            type="checkbox"
                            checked={viewStatus === 1}
                            value={viewStatus}
                            disabled
                          />

                          <span className="slider"></span>
                          <span
                            className={`slider-text ${
                              viewStatus === 1 ? "public" : "private"
                            }`}
                          >
                            {viewStatus === 1 ? "Public" : "Private"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>{" "}
                </div>
              )} */}

              <div md={12}>
                {article.FilePath.map((row, index) => {
                  const attachmentName = row.FilePath.split("/").pop();
                  const isImage = isImageAttachment(attachmentName);
                  return (
                    <div className="m-2" key={index}>
                      <a
                        target="_blank"
                        href={ApiUrl + "/" + row.FilePath}
                        download={`image-${index}`}
                      >
                        {isImage ? (
                          <img
                            className="max-h-64 inline-flex w-80 object-contain"
                            src={ApiUrl + "/" + row.FilePath}
                            alt={`Image ${index}`}
                          />
                        ) : (
                          <div className="block">
                            <a
                              className="filepath"
                              href={ApiUrl + "/" + row.FilePath}
                            >
                              {row.FileName}
                            </a>
                          </div>
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {location.state.page === "unpublished" ? (
              <>
                <div className="relative flex w-full md:w-1/2 mt-4">
                  <textarea
                    className="w-full p-2 rounded-md	border-2 border-solid border-indigo-600"
                    placeholder="Type your Review"
                    value={comment}
                    rows={4}
                    onChange={(e) => setcomment(e.target.value)}
                  />
                </div>
                <div className="relative flex w-full md:w-1/2">
                  {location.state.page === "unpublished" ? (
                    <button
                      disabled={disabled}
                      className="maincontent__btn maincontent__btn--primaryblue m-2"
                      onClick={submitComment}
                    >
                      Send Back
                    </button>
                  ) : null}
                  <div style={{ display: "flex" }}>
                    {location.state.page === "unpublished" ? (
                      <button
                        className="maincontent__btn maincontent__btn--primaryblue m-2"
                        onClick={approveArtical}
                        disabled={disabled}
                      >
                        Approve
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        
      </div>
      <div className="maincontent__card--body mt-2">
        <div className="maincontent__card--header">
                  <h2 className="maincontent__card--header-title">
                    Review Comments
                  </h2>
        </div>
        <div className="maincontent__card--content">
          {commentList.length > 0 ? (
            commentList.map((cmd, index) => (
              <div key={index}>
                <div className="flex items-center gap-2">
                  <img
                    src={cmd.profile ? cmd.profile : ProfilePic}
                    alt="Profile"
                    className="maincontent__card--kmDashboard-contributorsPic commentorProfile"
                  />
                  <p className="flex flex-col">
                    <span className="font-semibold commentor">
                      {cmd.Author}
                    </span>
                    <span className="clrPrimaryBlue commentor">
                      {datetimeClockFormat(cmd.CreatedAt)}
                    </span>
                  </p>
                </div>
                <p
                  style={{ marginLeft: "50px" }}
                  className="commentsList"
                >
                  {cmd.Comment}
                </p>
              </div>
            ))
          ) : (
            <div>
              <p className="commentsList">No Comments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ApproveArticle);
