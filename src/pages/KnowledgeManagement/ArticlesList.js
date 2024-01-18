import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { Modal, Card } from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  faCertificate,
  faChevronCircleDown,
  faCirclePlus,
  faHeart,
  faHome,
  faLayerGroup,
  faMessage,
  faNewspaper,
  faUpload,
  faUserPlus,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import { relativeTimeRounding } from "moment-timezone";
import { getPoints } from "../../common/Helper";
const ArticlesList = () => {
  const navigate = useNavigate();
  let [latestArticle, setLatestArticle] = useState([]);
  let [topContributorslist, setTopContributorslist] = useState([]);
  let [myarticleList, setMyarticleList] = useState([]);
  let [myresponse, setMyresponse] = useState([]);
  let [cardValue, setCardValue] = useState({
    level: "",
    Points: 0,
    myarticle: 0,
    published: 0,
    totalLike: 0,
  });
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [updatedComments, setUpdatedComments] = useState([]);

  const [selectedCommentsList, setSelectedCommentsList] = useState([]);

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  useEffect(() => {
    apiClient
      .post("kmarticle/articleList", { UserId: 1 })
      .then((res) => {
        if (res.data.length > 0) {
          let arr = [];
          res.data.map((row) => {
            arr.push({ Id: row.Id, response: "", like: row.likestatus });
          });
          setMyresponse(arr);
          setLatestArticle(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    apiClient
      .post("kmarticle/kmarticledashboard", { UserId: 1 })
      .then((res) => {
        cardValue.level = res.data[0].level;
        // if(res.data[0].Points) cardValue.Points = res.data[0].level;
        // else cardValue.Points =0;
        if (res.data[0].totalArticle)
          cardValue.myarticle = res.data[0].totalArticle;
        else cardValue.myarticle = 0;
        if (res.data[0].published) cardValue.published = res.data[0].published;
        else cardValue.published = 0;
        if (res.data[0].totalLike) cardValue.totalLike = res.data[0].totalLike;
        else cardValue.totalLike = 0;
        if ((cardValue.Points = getPoints(res.data[0].level)))
        setCardValue(cardValue);
      });
    apiClient
      .post("kmarticle/topContributors")
      .then((res) => {
        setTopContributorslist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    apiClient
      .post("kmarticle/myarticle", { UserId: 1 })
      .then((res) => {
        setMyarticleList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function responseChange(e, i) {
    const list = [...myresponse];
    list[i]["response"] = e.target.value;
    setMyresponse(list);
  }

  const submitLike = (i) => {
    if (myresponse[i].Id) {
      let data = {
        articalId: myresponse[i].Id,
        likedBy: 1,
        UserId: 1,
      };
      apiClient
        .post("kmarticle/addlike", data)
        .then(() => {
          const list = [...myresponse];
          list[i]["like"] = true;
          setMyresponse(list);
          const latestlist = [...latestArticle];
          latestlist[i]["Likes"] = latestlist[i]["Likes"] + 1;
          setLatestArticle(latestlist);
          Alert("succ", "Your Like has been submitted successfully");
        })
        .catch(() => {
          Alert("error", "Please Try Again");
        });
    } else Alert("error", "Please Try Again");
  };

  const submtComment = (i) => {
    if (myresponse[i].Id && myresponse[i].response) {
      let data = {
        articalId: myresponse[i].Id,
        comments: myresponse[i].response,
        commentby: 1,
        UserId: 1,
      };
      apiClient
        .post("/kmarticle/addcomment", data)
        .then(() => {
          const list = [...myresponse];
          list[i]["response"] = "";
          setMyresponse(list);
          const latestlist = [...latestArticle];
          latestlist[i]["Comments"] = latestlist[i]["Comments"] + 1;
          setLatestArticle(latestlist);

          const newComment = { Comments: myresponse[i].response };
          setSelectedComments((prevComments) => [...prevComments, newComment]);

          Alert("succ", "Your Comment has been submitted successfully");
        })
        .catch((err) => {
          Alert("error", "Please Try Again");
        });
    } else {
      Alert("error", "Please Try Again");
    }
  };

  const expandToView = (i) => {
    if (latestArticle[i].Id) {
      apiClient
        .post("/kmarticle/articlecomments", { id: latestArticle[i].Id })
        .then((res) => {
          const comments = res.data;
          setShowDefault(true);
          setSelectedArticle(latestArticle[i]);
          setSelectedArticleIndex(i);
          setSelectedComments(comments);
          if (myresponse[i].response) {
            submtComment(i);
          }
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <div className="maincontent__breadcrumb">
        <img
          className="cursor_pointer"
          src={HomeOutlineIcon}
          alt="home"
          onClick={() => {
            navigate(Routes.KMArticles);
          }}
        />
        <span className="maincontent__breadcrumb--divider">/</span>
        <span
          className="cursor_pointer"
          onClick={() => {
            navigate(Routes.SearchClient);
          }}
        >
          Dashboard
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">All Articles</span>
      </div>

      {/************** Article cards starts here ***********/}
      <div className="flex justify-between mt-4">
        {/************** Left side article section starts here ***********/}
        <div className="flex-1 maincontent__card">
          {/* <div className="maincontent__card--header">
                        <p className="maincontent__card--header-title">Top Contributors</p>
                    </div> */}
          <div className="maincontent__card--content">
            <div className="flex flex-col gap-4">
              {latestArticle.map((row, i) => {
                return (
                  <>
                    <div
                      key={row.Id}
                      className="maincontent__card--kmArticles-article"
                    >
                      <div className="flex justify-between">
                        <p className="text-sm clrGray">{row.postdate}</p>
                        <div className="flex justify-between gap-4">
                          <span className="flex items-center justify-between gap-2 clrGreen">
                            {myresponse[i].like ? (
                              <FontAwesomeIcon icon={faHeart} />
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 512 512"
                                  id="IconChangeColor"
                                  onClick={() => submitLike(i)}
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
                            {row.Likes}
                          </span>
                          <span className="flex items-center justify-between gap-2 clrGreen">
                            <FontAwesomeIcon icon={faMessage} />
                            {row.Comments}
                          </span>
                          {/* <span className="flex items-center justify-between gap-2 clrGreen">
                      <FontAwesomeIcon icon={faShare} />
                      254
                    </span> */}
                        </div>
                      </div>
                      <div className="py-4">
                        <p className="text-xl font-semibold clrBlack">
                          {row.title}
                        </p>
                        <p>{truncateText(row.Description, 150)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={ProfilePic}
                          alt="Profile"
                          className="maincontent__card--kmDashboard-contributorsPic"
                        />
                        <p className="flex flex-col">
                          <span className="font-semibold">
                            {row.ArticleName}
                          </span>
                          <span className="clrPrimaryBlue">{row.level}</span>
                        </p>
                        <span className="maincontent__card--kmArticles-articleBorder"></span>
                        <FontAwesomeIcon icon={faUserPlus} />
                      </div>
                      <div className="flex items-center justify-between mtb1">
                        <div className="flex posRelative w50">
                          <input type="hidden" value={myresponse[i].Id} />
                          <input
                            type="text"
                            className="maincontent__card--kmArticles-articleResponse"
                            placeholder="Type your response"
                            value={myresponse[i].response}
                            onChange={(e) => responseChange(e, i)}
                          />
                          <button
                            className="maincontent__card--kmArticles-articleBtn"
                            onClick={() => submtComment(i)}
                          >
                            Post
                          </button>
                        </div>
                        <button
                          onClick={() => expandToView(i)}
                          className="maincontent__btn maincontent__btn--primaryblue"
                        >
                          Expand to view more
                          <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            className="ml05"
                          />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/************** Article Cards ends here ***********/}

      <Modal
        className="mdlclspop "
        id="article_popup"
        as={Modal.Dialog}
        centered
        show={showDefault}
        onHide={handleClose}
      >
        {selectedArticle && selectedArticleIndex !== null && (
          <Card style={{ width: "135%" }}>
            <Card.Header style={{ backgroundColor: "#eeeeee" }}>
              <FontAwesomeIcon
                icon={faClose}
                onClick={handleClose}
                style={{ borderRadius: "20px", backgroundColor: "grey" }}
                className="closeIcon"
              />
            </Card.Header>

            <Card.Body>
              {/* <div className="maincontent__card--kmArticles-article articlePopup"> */}
              <div className="flex justify-between">
                <p className="text-sm clrGray">{selectedArticle.postdate}</p>
                <div className="flex justify-between gap-4">
                  <span className="flex items-center justify-between gap-2 clrGreen">
                    {myresponse[selectedArticleIndex].like ? (
                      <FontAwesomeIcon icon={faHeart} />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 512 512"
                          id="IconChangeColor"
                          onClick={() => submitLike(selectedArticleIndex)}
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
                    {selectedArticle.Likes}
                  </span>
                  <span className="flex items-center justify-between gap-2 clrGreen">
                    <FontAwesomeIcon icon={faMessage} />
                    {selectedArticle.Comments}
                  </span>
                </div>
              </div>
              <div className="py-4">
                <p className="text-xl font-semibold clrBlack">
                  {selectedArticle.title}
                </p>
                <p>{selectedArticle.Description}</p>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={ProfilePic}
                  alt="Profile"
                  className="maincontent__card--kmDashboard-contributorsPic"
                />
                <p className="flex flex-col">
                  <span className="font-semibold">
                    {selectedArticle.ArticleName}
                  </span>
                  <span className="clrPrimaryBlue">
                    {selectedArticle.level}
                  </span>
                </p>
                <span className="maincontent__card--kmArticles-articleBorder"></span>
                <FontAwesomeIcon icon={faUserPlus} />
              </div>

              <div className="items-center justify-between mtb1">
                <div className="commentsSection">
                  <Card className="commentCard">
                    <Card.Header style={{ fontWeight: "600" }}>
                      Comments
                    </Card.Header>

                    <Card.Body className="commentCardBody">
                      {selectedComments.map((comment, index) => (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              src={ProfilePic}
                              alt="Profile"
                              className="maincontent__card--kmDashboard-contributorsPic commentorProfile"
                            />
                            <p className="flex flex-col">
                              <span className="font-semibold commentor">
                                Name here
                              </span>
                              <span className="clrPrimaryBlue commentor">
                                12/07/2023
                              </span>
                            </p>
                          </div>
                          <p className="commentsList" key={index}>
                            {comment.Comments}
                          </p>
                        </>
                      ))}

                      <div
                        className=" posRelative w50"
                        style={{ marginTop: "40px" }}
                      >
                        <input
                          type="hidden"
                          value={myresponse[selectedArticleIndex].Id}
                        />
                        <input
                          type="text"
                          className="maincontent__card--kmArticles-articleResponse moveDownInput"
                          placeholder="Type your response"
                          value={myresponse[selectedArticleIndex].response}
                          onChange={(e) =>
                            responseChange(e, selectedArticleIndex)
                          }
                        />
                        <button
                          className="maincontent__card--kmArticles-articleBtn moveDownBtn"
                          onClick={() => submtComment(selectedArticleIndex)}
                        >
                          Post
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Modal>
    </>
  );
};

export default ArticlesList;
