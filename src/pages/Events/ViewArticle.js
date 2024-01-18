import React, { useState, useEffect } from "react";
import ProfilePic from "../../assets/img/profile.jpg";
import apiClient from "../../common/http-common";
import { connect } from "react-redux";
import { Alert } from "../../components/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  datetimeClockFormat,
  getPoints,
} from "../../common/Helper";
import {
  faTrash,
  faPaperPlane,
  faHeart,
  faMessage,
  faClose,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Card } from "@themesberg/react-bootstrap";
import PDFIcon from "../../assets/img/new_design/pdf.svg";
import XLIcon from "../../assets/img/new_design/xlsx.svg";
import GalleryIcon from "../../assets/img/new_design/gallery.svg";
import CommentIcon from "../../assets/img/new_design/comment.svg";
import addRewardPoints from "../../common/AddRewardPoints";
import parse from 'html-react-parser';

const ViewArticle = ({
  article = "",
  user,
  isAdminState,
  rewardsData,
  onClose,
}) => {
  const location = useLocation();
  const initialArticleDetails = article || location?.state?.article;
  const [articleDetails, setArticleDetails] = useState(initialArticleDetails);
  const [logUserName] = useState(user.FirstName + " " + user.LastName);
  const [logUserId] = useState(user.Id);
  const [isAdmin] = useState(isAdminState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCommentList, setShowCommentList] = useState(false);
  const [commentList, SetCommentList] = useState([]);

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
  const navigate = useNavigate();
  const handleOnClose = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    onClose();
  };
  function responseChange(e, cmdId = "") {
    const list = { ...articleDetails };
    list["response"] = e.target.value;
    setArticleDetails(list);
  }

  const submitLike = async () => {
    if (articleDetails.Id) {
      let data = {
        articalId: articleDetails.Id,
        likedBy: logUserId,
        UserId: logUserId,
      };
      try {
        apiClient.post("kmarticle/addlike", data).then(() => {
          const updateDetalis = { ...articleDetails };
          if (updateDetalis.ArticleBy !== logUserId) {
            addRewardPoints(
              rewardsData[7].Points,
              logUserId,
              rewardsData[7].Id,
              logUserId
            );
            addRewardPoints(
              rewardsData[4].Points,
              updateDetalis.ArticleBy,
              rewardsData[4].Id,
              logUserId
            );
          }
          if (updateDetalis.Likes % 25 === 0) {
            addRewardPoints(
              rewardsData[14].Points,
              updateDetalis.ArticleBy,
              rewardsData[14].Id,
              logUserId
            );
          }

          updateDetalis.Likes = updateDetalis.Likes + 1;
          updateDetalis.likestatus = true;
          setArticleDetails(updateDetalis);
        });
      } catch (error) {
        Alert("error", "Please Try Again");
      }
    } else {
      Alert("error", "Please Try Again");
    }
  };

  const disLike = async () => {
    if (articleDetails.Id) {
      let data = {
        articalId: articleDetails.Id,
        likedBy: logUserId,
      };
      try {
        await apiClient.post("kmarticle/dislike", data);
        const updateDetalis = { ...articleDetails };
        updateDetalis.Likes = updateDetalis.Likes - 1;
        updateDetalis.likestatus = false;
        setArticleDetails(updateDetalis);
      } catch (error) {
        Alert("error", "Please Try Again");
      }
    } else {
      Alert("error", "Please Try Again");
    }
  };

  const handlesubcomment = (i, id, cmdId) => {
    const textarea = document.getElementById("subcmd_" + id);
    textarea.value && submtComment(i, cmdId, textarea.value, id);
  };

  const submtComment = async (
    i = null,
    cmdId = null,
    textvalue = null,
    id = null
  ) => {
    try {
      if (articleDetails.Id && (articleDetails.response || textvalue)) {
        const cmdres = textvalue || articleDetails.response;
        const data = {
          articalId: articleDetails.Id,
          commentId: cmdId,
          comments: cmdres,
          commentby: logUserId,
          UserId: logUserId,
        };
        const response = await apiClient.post("/kmarticle/addcomment", data);
        const updatedArticleDetails = { ...articleDetails };

        updatedArticleDetails["Comments"] =
          updatedArticleDetails["Comments"] + 1;

        if (articleDetails.commentList.length > 2) {
          updatedArticleDetails["commentList"][0] = {
            Author: logUserName,
            Comments: cmdres,
            postdate: articleDetails.commentList[0].postdate,
          };
        } else {
          if (updatedArticleDetails["commentList"]) {
            updatedArticleDetails["commentList"].push({
              Author: logUserName,
              Comments: cmdres,
              postdate: articleDetails.postdate,
            });
          } else {
            updatedArticleDetails["commentList"] = [
              {
                Author: logUserName,
                Comments: cmdres,
                postdate: articleDetails.postdate,
              },
            ];
          }
        }

        updatedArticleDetails["response"] = "";
        if (id) {
          const textarea = document.getElementById("subcmd_" + id);
          textarea.value = "";
        }
        setArticleDetails(updatedArticleDetails);
        commentlistbyarticle(articleDetails.Id);

        if (articleDetails.ArticleBy !== logUserId) {
          addRewardPoints(
            rewardsData[6].Points,
            logUserId,
            rewardsData[6].Id,
            logUserId
          );
          addRewardPoints(
            rewardsData[5].Points,
            articleDetails.ArticleBy,
            rewardsData[5].Id,
            logUserId
          );
        }
        if (articleDetails.Comments % 25 === 0) {
          addRewardPoints(
            rewardsData[13].Points,
            articleDetails.ArticleBy,
            rewardsData[13].Id,
            logUserId
          );
        }
      } else {
        Alert("error", "Please Try Again");
      }
    } catch (error) {
      Alert("error", "Please Try Again");
    }
  };

  const expandToViewComments = async () => {
    if (showCommentList) {
      setShowCommentList(false);
    } else {
      try {
        const response = await apiClient.post("/kmarticle/articlecomments", {
          id: articleDetails.Id,
        });
        SetCommentList(response.data);
        setShowCommentList(true);
      } catch (error) {
      }
    }
  };

  const commentlistbyarticle = (id) => {
    apiClient
      .post("/kmarticle/articlecomments", { id: id })
      .then((res) => {
        const comments = res.data;
        SetCommentList(comments);
      })
      .catch(() => {});
  };

  const deletePostComment = (id, ArticleId) => {
    if (id) {
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
          let data = {
            articalId: ArticleId,
            id: id,
          };
          apiClient
            .post("/kmarticle/deletecomment", data)
            .then((res) => {
              const latestlist = { ...articleDetails };
              latestlist["Comments"] = latestlist["Comments"] - 1;
              setArticleDetails(latestlist);
              apiClient
                .post("/kmarticle/articlecomments", {
                  id: articleDetails.Id,
                })
                .then((response) => {
                  SetCommentList(response.data);
                });
            })
            .catch(() => {
              Alert("error", "Please Try Again!");
            });
        }
      });
    }
  };

  const toggleAccordionFunc = (event) => {
    const accordionContent = event.target.nextElementSibling;
    accordionContent &&
      accordionContent.classList.toggle("accordion-content-active");
  };
  
  const htmlToView = (htmlText) => {
    htmlText = parse(htmlText);
    return <div dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };

  return (
    <Card>
      <Card.Body>
        <div className="h-full">
          {" "}
          <div className="h-full">
            {" "}
            <div className="articles__articlelist grid-cols-1">
              <div className={`articles__article pt-0`}>
                <div className="articles__article--header justify-start gap-4">
                  <img
                    src={ProfilePic}
                    className="articles__article--profilepic w-24 h-24"
                  />
                  <div className="flex flex-col">
                    <span className="articles__article--author text-xl font-bold text-capitalize">
                      {articleDetails.ArticleName}
                    </span>
                    <span className="articles__article--level text-base">
                      {getPoints(
                        articleDetails.DepartmentId,
                        articleDetails.RewardPoints
                      )}
                    </span>
                  </div>
                  <span className="articles__article--line h-7"></span>
                  <div className="flex items-center gap-4">
                    <span className="articles__article--date font-bold text-base">
                      {articleDetails.postdate}
                    </span>
                    <div className="flex gap-2 items-center">
                      <span className="articles__article--likescount">
                        {articleDetails.likestatus ? (
                          <FontAwesomeIcon
                            className="cursor-pointer activeHeart w-5 h-5"
                            icon={faHeart}
                            onClick={() => disLike()}
                          />
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 512 512"
                              id="IconChangeColor"
                              onClick={() => submitLike()}
                            >
                              <title>Like</title>
                              <path
                                d="M352.92,80C288,80,256,144,256,144s-32-64-96.92-64C106.32,80,64.54,124.14,64,176.81c-1.1,109.33,86.73,187.08,183,252.42a16,16,0,0,0,18,0c96.26-65.34,184.09-143.09,183-252.42C447.46,124.14,405.68,80,352.92,80Z"
                                id="mainIconPathAttribute"
                                stroke-width="0.3"
                                stroke="#ff0000"
                                fill="#737373"
                                filter="url(#shadow)"
                              ></path>
                              <filter id="shadow">
                                <feDropShadow
                                  id="shadowValue"
                                  stdDeviation="0.3"
                                  dx="-1"
                                  dy="-0.8"
                                  flood-color="black"
                                ></feDropShadow>
                              </filter>
                            </svg>
                          </>
                        )}
                      </span>
                      <span className="articles__article--likes text-lg">
                        {articleDetails.Likes}
                      </span>
                    </div>
                    <span
                      className="articles__article--comments gap-2"
                      onClick={() => expandToViewComments()}
                    >
                      <FontAwesomeIcon
                        className="flex items-center justify-between gap-2 cursor-pointer commentBoxClr"
                        icon={faMessage}
                      />
                      <span
                        className="articles__article--commentscount text-lg"
                        onClick={() => expandToViewComments()}
                      >
                        {articleDetails.Comments}
                      </span>
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={faClose}
                    onClick={handleOnClose}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                      borderRadius: "20px",
                      backgroundColor: "grey",
                    }}
                    className="cursor-pointer closeIcon"
                  />
                </div>
                <h2 className="articles__article--title text-xl">
                  {articleDetails.title}&nbsp; &nbsp;
                  <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                    className="cursor-pointer"
                    onClick={() => {
                      speak(parse(article.Description));
                    }}
                  />
                </h2>
                <p className="articles__article--para overflow-y-auto max-h-[65%]">
                  {htmlToView(articleDetails.Description)}
                </p>
                {articleDetails?.FilePath.length > 0 && (
                  <>
                    <h2 className="articles__article--title text-xl text-decoration-underline">
                      Attachments
                    </h2>
                    <div className="articles__attachments">
                      <div className="flex flex-col gap-2">
                        {articleDetails?.FilePath?.map((row, i) => {
                          let fileExt = row.FileName.split(".")
                            .pop()
                            .toLowerCase();
                          const isImage = [
                            "png",
                            "jpg",
                            "jpeg",
                            "svg",
                          ].includes(fileExt);

                          return (
                            <div key={i}>
                              {isImage ? (
                                <a
                                  href={
                                    process.env.REACT_APP_IMG_PATH +
                                    row.FilePath
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={
                                      process.env.REACT_APP_IMG_PATH +
                                      row.FilePath
                                    }
                                    className=" inline-flex object-contain max-h-64 w-80"
                                    alt={row.FileName}
                                  />
                                </a>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  {fileExt === "pdf" ? (
                                    <img
                                      src={PDFIcon}
                                      className="articles__attachments--img"
                                      alt="PDF"
                                    />
                                  ) : fileExt === "xlsx" ||
                                    fileExt === "csv" ||
                                    fileExt === "xls" ? (
                                    <img
                                      src={XLIcon}
                                      className="articles__attachments--img"
                                      alt="Excel"
                                    />
                                  ) : (
                                    <img
                                      src={GalleryIcon}
                                      className="articles__attachments--img"
                                      alt="Image"
                                    />
                                  )}
                                  <a
                                    style={{
                                      color: "#6d1acd",
                                      textAlign: "center",
                                    }}
                                    download={true}
                                    href={
                                      process.env.REACT_APP_IMG_PATH +
                                      row.FilePath
                                    }
                                    target="_blank"
                                  >
                                    {row.FileName}
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                <h4></h4>
              </div>
            </div>
            {showCommentList && (
              <div className="items-center justify-between mtb1">
                <div className="commentsSection">
                  {commentList.length > 0 ? (
                    <Card className="commentCard">
                      <Card.Body className="commentCardBody">
                        {commentList.map((comment, index) => (
                          <>
                            <div key={index}>
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    comment.profile
                                      ? comment.profile
                                      : ProfilePic
                                  }
                                  alt="Profile"
                                  className="maincontent__card--kmDashboard-contributorsPic commentorProfile"
                                />
                                <p className="flex flex-col">
                                  <span className="font-semibold commentor">
                                    {comment.Author}
                                  </span>
                                  <span className="clrPrimaryBlue commentor">
                                    {datetimeClockFormat(comment.CreatedAt)}
                                  </span>
                                </p>
                              </div>

                              <div class="comments">
                                <p
                                  style={{
                                    marginLeft: "50px",
                                    display: "inline-flex",
                                  }}
                                  className="commentsList"
                                >
                                  {comment.Comments}
                                </p>
                                <br />
                                <span
                                  className="cursor-pointer reply_space font_small"
                                  onClick={toggleAccordionFunc}
                                >
                                  Reply
                                  {logUserId === comment.CommentedBy ||
                                  isAdmin ? (
                                    <>
                                      {" "}
                                      |{" "}
                                      <FontAwesomeIcon
                                        className="cursor-pointer font_small"
                                        style={{
                                          color: "red",
                                        }}
                                        onClick={() =>
                                          deletePostComment(
                                            comment.Id,
                                            comment.ArticleId
                                          )
                                        }
                                        icon={faTrash}
                                      />
                                    </>
                                  ) : null}
                                </span>
                                <div className="w-2/4 hide_sub_reply_box">
                                  <textarea
                                    type="text"
                                    rows="1"
                                    id={"subcmd_" + comment.Id}
                                    className="maincontent__card--kmArticles-articleResponse"
                                    placeholder="Type your comments here ....."
                                  />
                                  <button
                                    id="sub_replay_cmt"
                                    className="maincontent__card--kmArticles-articleBtn"
                                    onClick={() =>
                                      handlesubcomment(
                                        index,
                                        comment.Id,
                                        comment.Id
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            {comment.subcomments.length > 0
                              ? comment.subcomments.map((row, i) => {
                                  return (
                                    <>
                                      <div key={i} className="ml-10">
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={
                                              row.profile
                                                ? row.profile
                                                : ProfilePic
                                            }
                                            alt="Profile"
                                            className="maincontent__card--kmDashboard-contributorsPic commentorProfile"
                                          />
                                          <p className="flex flex-col">
                                            <span className="font-semibold commentor">
                                              {row.Author}
                                            </span>
                                            <span className="clrPrimaryBlue commentor">
                                              {datetimeClockFormat(
                                                row.CreatedAt
                                              )}
                                            </span>
                                          </p>
                                        </div>

                                        <div class="comments">
                                          <p class="commentsList reply_space inline-flex	">
                                            {row.Comments}
                                          </p>

                                          <br />
                                          <span
                                            className="cursor-pointer reply_space font_small"
                                            onClick={toggleAccordionFunc}
                                          >
                                            Reply
                                            {logUserId === row.CommentedBy ||
                                            isAdmin ? (
                                              <>
                                                {" "}
                                                |{" "}
                                                <FontAwesomeIcon
                                                  className="cursor-pointer font_small"
                                                  style={{
                                                    color: "red",
                                                  }}
                                                  onClick={() =>
                                                    deletePostComment(
                                                      row.Id,
                                                      row.ArticleId
                                                    )
                                                  }
                                                  icon={faTrash}
                                                />
                                              </>
                                            ) : null}
                                          </span>
                                          <div className="w-2/4 hide_sub_reply_box">
                                            <textarea
                                              type="text"
                                              rows="1"
                                              id={"subcmd_" + row.Id}
                                              className="maincontent__card--kmArticles-articleResponse"
                                              placeholder="Type your comments here ....."
                                            />
                                            <button
                                              id="sub_replay_cmt"
                                              className="maincontent__card--kmArticles-articleBtn"
                                              onClick={() =>
                                                handlesubcomment(
                                                  i,
                                                  row.Id,
                                                  comment.Id
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faPaperPlane}
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                              : null}
                          </>
                        ))}

                        <p
                          className="cursor-pointer font-semibold float-right"
                          style={{
                            color: "blue",
                            fontSize: "12px",
                          }}
                          onClick={() => expandToViewComments()}
                        >
                          View Lesss
                        </p>
                      </Card.Body>
                    </Card>
                  ) : null}
                </div>
              </div>
            )}
            <div className="articles__comments">
              <textarea
                className="articles__comments--input"
                style={{ backgroundColor: "#f2f2f4" }}
                placeholder="Type your comments here..."
                value={articleDetails.response}
                onChange={(e) => responseChange(e)}
              ></textarea>
              <button
                type="button"
                className="articles__comments--btn"
                onClick={() => submtComment()}
              >
                <img src={CommentIcon} alt="Comment Icon" />
              </button>
            </div>
          </div>
          <div className="">
            {" "}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  isAdminState: state.isAdmin,
  rewardsData: state.rewards,
});

export default connect(mapStateToProps)(ViewArticle);
