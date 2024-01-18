import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMessage,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../components/Alert";
import axios from "axios";
import { Card } from "@themesberg/react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import apiClient from "../../common/http-common";
import { Routes } from "../../routes";
import Swal from "sweetalert2";
import {
  datetimeClockFormat,
  ddmmyyyyFormat,
} from "../../common/Helper";
import { connect } from "react-redux";
import addRewardPoints from "../../common/AddRewardPoints";
import parse from "html-react-parser";

const ApproveVxArticle = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [logUserId] = useState(state.user.Id);
  const [selectVal, setSelectVal] = useState({
    type: "",
    project: "",
    source: "",
  });

  const [categoryList, setCategoryList] = useState([]);
  const [clientList, setClienttList] = useState([]);
  const [validTitleVal, setValidTtitleVal] = useState("");
  const [validDescpVal, setValidDescpVal] = useState("");
  const [attachmentList, setAttachmentList] = useState([]);
  const [commentList, setCommentList] = useState(false);
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

  const [comment, setcomment] = useState("");
  const [disabled, setDisabled] = useState(false);
  let [sourceTitle, setSourceTitle] = useState();
  const [revenueError, setRevenueError] = useState("");
  const [revenueClientError, setRevenueClientError] = useState("");
  const [revenueInternalError, setRevenueInternalError] = useState("");
  const [costError, setCostError] = useState("");
  const [costClientError, setCostClientError] = useState("");
  const [costInternalError, setCostInternalError] = useState("");
  const [personDaysError, setPersonDaysError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [articleby, setArticleBy] = useState("");
  const [sourceTitleError, setSourceTitleError] = useState("");
  const [sourceTitleSugg, setSourceTitleSugg] = useState([]);
  const [revenue, setRevenue] = useState();
  const [cost, setCost] = useState();
  const [revenueClient, setRevenueClient] = useState("");
  const [revenueInternal, setRevenueInternal] = useState("");
  const [costClient, setCostClient] = useState("");
  const [costInternal, setCostInternal] = useState("");
  const [personDays, setPersonDays] = useState("");
  const [sourcetitleId, setSourceTitleId] = useState();
  const [loadclientId, setloadClientId] = useState();
  const [clientloadId, seClientloadId] = useState(true);
  let [sourceSelect, setSourceSelect] = useState({});
  const [typeError, setTypeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [Keyword, setKeywords] = useState("");
  const [viewStatus, setViewStatus] = useState(1);
  const [description, setDescription] = useState("");
  const [article, setArticle] = useState({
    title: "",
    AuthorName: "",
    CategoryName: "",
    Description: "",
    CreatedAt: "",
    Likes: "",
    Comments: "",
    KeyWords: "",
    ViewStatus: "",
    FilePath: [],
  });
  useEffect(() => {
    apiClient
      .post("/kmarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        setArticle(res.data[0]);
        setDescription(parse(res.data[0].Description));
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

  const [categoryselect, setCategoryselect] = useState({});

  useEffect(() => {
    apiClient
      .post("/kmarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        setArticle(res.data[0]);
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

  const [resData, setResData] = useState("");
  useEffect(() => {
    apiClient
      .post("/vxarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        const resdata = res.data[0];
        setResData(res.data[0]);
        autofill(resdata.SourceId);
        setArticle(resdata);
        setTitle(resdata.title);
        setContent(parse(resdata.Description));
        setKeywords(resdata.KeyWords);
        setViewStatus(resdata.ViewStatus);
        let typeoption = [
          { value: 1, label: "Article" },
          { value: 2, label: "Case Study" },
          { value: 3, label: "Knowledge Management" },
          { value: 4, label: "Value Xperience" },
          { value: 5, label: "Customer Accolades" },
        ];

        setType(typeoption[resdata.type - 1].label);
        selectVal.type = {
          value: resdata.type,
          label: typeoption[resdata.type - 1].label,
        };
        setSelectVal(selectVal);
        setSourceSelect({
          value: resdata.SourceId,
          label: resdata.SourceCategoryName,
        });
        setClientSelect({ value: resdata.ClientId, label: resdata.ClientName });
        setCategoryselect({
          value: resdata.CategoryId,
          label: resdata.CategoryName,
        });
        setSourceTitle({
          value: resdata.SourceTitle,
          label: resdata.SourceTitleName,
        });
        setArticleBy(resdata.ArticleBy);
        setloadClientId(resdata.ClientId);
        setSourceTitleId(resdata.SourceTitle);
        setRevenueClient(resdata.RevenueClient);
        setRevenueInternal(resdata.RevenueInternal);
        setCostClient(resdata.CostClient);
        setCostInternal(resdata.CostInternal);
        setPersonDays(resdata.PersonDays);
        setCost(!resdata.Cost);
        setRevenue(!resdata.Revenue);
        setCategory(resdata.CategoryName);
        setAttachmentList(resdata.FilePath);
      })
      .catch((error) => {
        console.log("rerrr", error);
      });
  }, []);

  useEffect(() => {
    apiClient
      .get("/lookup/ArticalCategory/1")
      .then((response) => {
        let arr = [];
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
          });
        }
        setCategoryList(arr);
      })
      .catch(() => {
        Alert("error", "Please Try Again");
      });

    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0",
      })
      .then((response) => {
        let arr = [];
        if (response.data.client.length > 0) {
          response.data.client.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
          });
        }
        setClienttList(arr);
      })
      .catch(() => {});
  }, []);

  const autofill = (sourceId = "") => {
    if (sourceSelect.value || sourceId) {
      !sourceId && setSourceTitle({});
      let parame = sourceId ? sourceId : sourceSelect.value;
      apiClient
        .get("/vxarticle/get_source_title/" + parame)
        .then((response) => {
          let parr = [];
          if (response.data.length > 0) {
            response.data.forEach((element) => {
              parr.push({ value: element.Id, label: element.title });
            });
          }
          setSourceTitleSugg(parr);
        })
        .catch((error) => {
          Alert("error", "Please Try Again");
        });
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const words = inputValue.split(" ");
    const modifiedWords = words.map((word) => {
      if (word.startsWith("#") && word.length > 1) {
        return word;
      } else if (!word.startsWith("#") && word.trim() !== "") {
        return `#${word}`;
      }
      return word;
    });

    const modifiedValue = modifiedWords.join(" ");
    setKeywords(modifiedValue);
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
                addRewardPoints(
                  state.rewards[8].Points,
                  logUserId,
                  state.rewards[8].Id,
                  logUserId
                );
                navigate(Routes.KMUnpublished);
                Alert("succ", "Artifacts has been send back");
                setcomment("");
                setDisabled(false);
                getComments();
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

  return (
    <>
      <div>
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
            <span className="cursor_pointer" onClick={handleBreadcrumbClick}>
              {location.state.page === "unpublished"
                ? "Artifacts for Review"
                : "My Articles"}
            </span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">VX Article</span>
          </div>
        )}

        <div className="mt-4 maincontent__card--body">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">
              VX ARTICLE DETAILS
            </h2>
          </div>
          <div className="maincontent__card--content">
            <div>
              <h1 className="text-2xl font-bold">
                {title}
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="cursor-pointer"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    speak(content);
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                />
                <div className="ArticleDetailss">
                  <div>{resData.AuthorName} | </div>
                  <div>{ddmmyyyyFormat(resData.CreatedAt)} | </div>
                  <div>{resData.CategoryName}</div>
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
                      {resData.Likes}
                    </span>
                    <span className="IconSpan2">
                      {" "}
                      <FontAwesomeIcon
                        icon={faMessage}
                        style={{ marginRight: "4px" }}
                      />
                      {resData.Comments}{" "}
                    </span>
                  </div>
                ) : null}
              </div>

              <p
                className="ArticleDesc"
                dangerouslySetInnerHTML={{ __html: content }}
              >
              </p>
              <div>
                <div className="mt-4 clrBlue">
                  <p>{resData.KeyWords}</p>
                </div>
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
                          disabled={location.state.page !== "unpublished"}
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
                </div>
                <div md={12}>
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
                        onClick={() => submitComment()}
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
        <div className="items-center justify-between mtb1">
          <div className="commentsSection">
            <Card className="commentCard">
              <div className="maincontent__card--header">
                <h2 className="maincontent__card--header-title">
                  Review Comments
                </h2>
              </div>
              <Card.Body className="commentCardBody">
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
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ApproveVxArticle);
