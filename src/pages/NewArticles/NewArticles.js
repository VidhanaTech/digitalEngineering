import React, { useState, useEffect } from "react";
import ProfilePic from "../../assets/img/profile.jpg";
import PostArtifact from "../components/PostArtifact";
import apiClient from "../../common/http-common";
import { connect } from "react-redux";
import { Alert } from "../../components/Alert";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import ViewArticle from "../KnowledgeManagement/ViewArticle";
import { Modal } from "@themesberg/react-bootstrap";
import {
  faArrowRight,
  faHeart,
  faMessage,
  faTimes,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import MyArticleCard from "../KnowledgeManagement/MyArticleCard";
import { getPoints, checkRolePermission } from "../../common/Helper";
import articleoftheweek from "../../assets/img/brand/articleoftheweek.svg";
import shootingstar from "../../assets/img/brand/shootingstar.svg";
import addRewardPoints from "../../common/AddRewardPoints";
import lifetimeachiever from "../../assets/img/brand/lifetimeachiever.svg";
import parse from "html-react-parser";
import axios from "axios";

const NewArticles = (state) => {
  let [searchQuery, setSearchQuery] = useState("");
  const [paginationcount, setPaginationCount] = useState();
  const [sortedArticleList, setSortedArticleList] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [logUserId] = useState(state.user.Id);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [askLoader, setAskLoader] = useState(false);
  const [articleViewDetails, setArticleViewDetails] = useState({});
  const [isLoader, setIsLoader] = useState(true);
  const [start, setStart] = useState(0);
  const [showDefault, setShowDefault] = useState(false);
  const [rightCardChange, setRightCardChange] = useState(0);
  const handleClose = () => (
    setShowDefault(false), setShowDef(false), setArticleViewDetails({})
  );
  const [ShowDef, setShowDef] = useState(false);
  const limit = 9;
  const [sortOption, setSortOption] = useState("recent");
  const [sortFeed, setSortFeed] = useState(1);
  const handlePageChange = (event, page) => {
    const newStart = (page - 1) * limit;
    setCurrentPage(page);
    setStart(newStart);
  };
  const [showChat, setShowChat] = useState(false);
  const [chatResponse, setChatResponse] = useState("");
  const currentYr = new Date().getFullYear();
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];

  function getPaginationCount(articleId = null) {
    apiClient
      .post("kmarticle/latestArticlenew", {
        UserId: logUserId,
        year: currentYr,
        month: currentMonth,
        sort: sortFeed,
        limit: null,
        start: 0,
        des: searchQuery,
        articleId: articleId,
      })
      .then((res) => {
        const articleList = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];
        const totalRecords = articleList.length;
        const recordsPerPage = 9;
        const paginationCount = Math.ceil(totalRecords / recordsPerPage);
        setPaginationCount(paginationCount);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getArticles();
  }, [sortFeed, start]);

  const emptyRecord = () => {
    setCurrentPage(1);
    setPaginationCount(0);
    setArticleList([]);
    setSortedArticleList([]);
    setIsLoader(false);
  };

  // const searchCount= () => {
  //   apiClient
  //     .post("kmarticle/searchcount", {
  //       userId:logUserId,
  //       question:searchQuery,
  //       type: 1
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };


  const [searchCountType, setSearchCountType] = useState();

  const handleSearchCount = async () => {
    setSearchCountType(chatResponse.includes('Sorry I don\'t know.' || "Sorry, I don't know.") ? 2 : 1);
    try {
      const searchCountResponse = await apiClient.post("kmarticle/searchcount", {
        userId: logUserId,
        question: searchQuery,
        type: searchCountType,
      });
      console.log(searchCountResponse);
    } catch (error) {
      console.log(error);
    }
  };
  

  const getArticles = () => {
    setIsLoader(true);
    setShowChat(false);
  
    if (searchQuery) {
      setAskLoader(true);
  
      let ChatPath = process.env.REACT_APP_CHAT_URL;
  
      axios
        .post(
          ChatPath,
          {
            input_text: searchQuery,
          },
          { headers: { "Content-type": "application/json" } }
        )
        .then((res) => {
          if (res.data.response) {
            const responses = "Sorry, I don't know.";
            const chatresponses = res.data.response;
            setChatResponse(res.data.response);
            let searchType = 2;
            console.log(chatResponse !== responses);
            if (chatresponses !== responses)  searchType = 1;
            apiClient
                .post("kmarticle/searchcount", {
                  userId: logUserId,
                  question: searchQuery,
                  type: searchType,
                })
                .then((searchCountResponse) => {
                  console.log(searchCountResponse);
                  setAskLoader(false);
                  setShowChat(true);
                })
                .catch((error) => {
                  console.log(error);
                  setAskLoader(false);
                  setShowChat(true); 
                });
  
          } else {
            setChatResponse("");
            setAskLoader(false);
            setShowChat(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setChatResponse("");
          setAskLoader(false);
          setShowChat(false);
        });
  
      let SearchPath = process.env.REACT_APP_SEARCH_URL;
      axios
        .post(
          SearchPath,
          {
            input_text: searchQuery,
          },
          { headers: { "Content-type": "application/json" } }
        )
        .then((res) => {
          if (res.data.message === "Results found") {
            if (res.data.results.length > 0) {
              let articleIds = [];
              res.data.results.map((item) => {
                if (item.article_id) {
                  let artVal = item.article_id.split("_");
                  articleIds.push(artVal[0]);
                }
              });
              const idString = `(${articleIds.join(", ")})`;
              getPaginationCount(idString);
              apiClient
                .post("kmarticle/latestArticlenew", {
                  UserId: logUserId,
                  sort: sortFeed,
                  year: currentYr,
                  month: currentMonth,
                  limit: limit,
                  start: start,
                  des: searchQuery,
                  articleId: idString,
                })
                .then((res) => {
                  const articles = Array.isArray(res.data.data)
                    ? res.data.data
                    : [res.data.data];
                  setArticleList(articles);
                  setSortedArticleList([...articles]);
                  setIsLoader(false);
                })
                .catch((err) => {
                  emptyRecord();
                });
            }
          } else {
            emptyRecord();
          }
        })
        .catch((err) => {
          emptyRecord();
        });
    } else {
      setShowChat(false);
      apiClient
        .post("kmarticle/latestArticlenew", {
          UserId: logUserId,
          sort: sortFeed,
          year: currentYr,
          month: currentMonth,
          limit: limit,
          start: start,
          des: searchQuery,
        })
        .then((res) => {
          const articles = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];
          setArticleList(articles);
          setSortedArticleList([...articles]);
          setIsLoader(false);
        })
        .catch((err) => {
          emptyRecord();
        });
      getPaginationCount();
    }
  };
  


  const handlePublishArtifact = () => {
    setRightCardChange(rightCardChange + 1);
  };
  const handleViewLikeCmd = (articleDetails) => {
    let foundObject = "";
    sortedArticleList.map((item, i) => {
      if (item.Id == articleDetails.Id) {
        foundObject = i;
      }
    });
    if (foundObject >= 0) {
      const letData = { ...sortedArticleList[foundObject] };
      letData.Likes = articleDetails.Likes;
      letData.Comments = articleDetails.Comments;
      letData.likestatus = articleDetails.likestatus;
      sortedArticleList[foundObject] = letData;
      setSortedArticleList(sortedArticleList);
    }
    setRightCardChange(rightCardChange + 1);
  };
  const handleSortChange = (option) => {
    setSortOption(option);
    if (option === "recent") {
      setSortFeed(1);
    } else if (option === "popular") {
      setSortFeed(2);
    }
  };

  useEffect(() => {
    handlePageChange(null, 1);
  }, []);

  const submitLike = async (i) => {
    if (articleList[i].Id) {
      let data = {
        articalId: articleList[i].Id,
        likedBy: logUserId,
        UserId: logUserId,
      };
      try {
        await apiClient.post("kmarticle/addlike", data);
        const updatedArticleList = [...articleList];
        updatedArticleList[i]["Likes"] = updatedArticleList[i]["Likes"] + 1;
        updatedArticleList[i]["likestatus"] = true;
        setArticleList(updatedArticleList);
        setRightCardChange(rightCardChange + 1);
        if (articleList[i].ArticleBy !== logUserId) {
          addRewardPoints(
            state.rewards[7].Points,
            logUserId,
            state.rewards[7].Id,
            logUserId
          );
          addRewardPoints(
            state.rewards[4].Points,
            articleList[i].ArticleBy,
            state.rewards[4].Id,
            logUserId
          );
        }
        if (articleList[i].Likes % 25 === 0) {
          addRewardPoints(
            state.rewards[14].Points,
            articleList[i].ArticleBy,
            state.rewards[14].Id,
            logUserId
          );
        }
      } catch (error) {
        Alert("error", "Please Try Again");
      }
    } else {
      Alert("error", "Please Try Again");
    }
  };

  const [dislikeDisabled, setDislikeDisabled] = useState(false);

  const disLike = async (i) => {
    if (articleList[i].Id) {
      if (!dislikeDisabled) {
        setDislikeDisabled(true);

        const updatedArticleList = [...articleList];
        const currentArticle = updatedArticleList[i];

        if (currentArticle.likestatus) {
          let data = {
            articalId: currentArticle.Id,
            likedBy: logUserId,
          };
          try {
            await apiClient.post("kmarticle/dislike", data);

            if (currentArticle.Likes > 0) {
              currentArticle.Likes--;
            }
            currentArticle.likestatus = false;
            setArticleList(updatedArticleList);
            setRightCardChange(rightCardChange + 1);
            setTimeout(() => {
              setDislikeDisabled(false);
            }, 5000);
          } catch (error) {
            Alert("error", "Please Try Again");
            setDislikeDisabled(false);
          }
        } else {
          Alert("warn", "You have already disliked this article.");
          setDislikeDisabled(false);
        }
      }
    } else {
      Alert("error", "Please Try Again");
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    getArticles();
  };

  useEffect(() => {
    if (articleViewDetails?.Id) {
      setShowDefault(true);
    }
  }, [articleViewDetails]);

  const htmlToView = (htmlText) => {
    htmlText = parse(htmlText);
    return (
      <div
        className="articles__article--para"
        dangerouslySetInnerHTML={{ __html: htmlText }}
      />
    );
  };
  return (
    <>
      <div className="articles__container pb-2">
        <div className="articles__left">
          <div>
            <div className="grid grid-cols-12 pb-[8px] articles__search">
              <div className="relative w-full md:col-span-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  {searchQuery && (
                    <div className="absolute top-0 mt-2 text-2xl left-2">
                      <FontAwesomeIcon
                        icon={faTimes}
                        onClick={(e) => {
                          searchQuery = null;
                          resetSearch();
                        }}
                        className="text-2xl cursor-pointer closeicon"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Ask Genie"
                    className="pl-10 articles__search--input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim() !== "") {
                        e.preventDefault();
                        getArticles();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="articles__search--btn articles__search--searchbtn"
                    onClick={(e) => getArticles()}
                  >
                    Ask Genie
                  </button>
                </form>
              </div>
              {checkRolePermission(Routes.KMUnpublished) && (
                <button
                  onClick={() => {
                    navigate(Routes.KMUnpublished);
                  }}
                  className="mb-0 maincontent__btn maincontent__btn--primaryblue btn md:col-span-2"
                >
                  Review
                </button>
              )}
              <PostArtifact
                design={false}
                postRender={handlePublishArtifact}
                getArticles={getArticles}
              />
              <Modal
                as={Modal.Dialog}
                centered
                show={showDefault}
                onHide={handleClose}
                backdrop="static"
              >
                <ViewArticle
                  article={articleViewDetails}
                  postRender={handleViewLikeCmd}
                  onClose={handleClose}
                />
              </Modal>
            </div>
            <div className="relative grid items-center w-full grid-cols-12 gap-4 md:w-auto">
              <span className="col-span-10 h-[1px] bg-gray-500"></span>
              <button
                type="button"
                className="col-span-2 articles__search--btn"
                id="padding-4"
              >
                Sort by :
                <select
                  className="cursor-pointer sortfeedSelect articles__sortfeedSelect"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option style={{ color: "black" }} value="recent">
                    Recent
                  </option>
                  <option style={{ color: "black" }} value="popular">
                    Popular
                  </option>
                </select>
              </button>
            </div>
            {askLoader ? (
              <>
                <div className="chat__loader items-center my-0 mx-auto">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`articles__searchresult ${
                    showChat ? "" : "hidden"
                  }`}
                >
                  <p>{chatResponse}</p>
                </div>
              </>
            )}
          </div>
          <div
            className={
              isLoader || !sortedArticleList.length
                ? `articles__articlelist grid-cols-1`
                : `articles__articlelist grid-cols-3`
            }
          >
            {isLoader ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <>
                {sortedArticleList.length > 0 ? (
                  sortedArticleList.map((article, i) => (
                    <div
                      key={i}
                      className={`articles__article articles__article--${
                        i % 2 === 0 ? "darkgray" : "lightgray"
                      }`}
                    >
                      <div className="flex flex-col gap-[5px] w-full">
                        <div className="articles__article--header">
                          <img
                            src={ProfilePic}
                            className="articles__article--profilepic"
                            alt={`Profile pic of ${article.Author}`}
                          />
                          <div className="flex flex-col w-[30%]">
                            <span className="articles__article--author">
                              {article.ArticleName}
                            </span>
                            <span className="articles__article--level">
                              {getPoints(
                                article.DepartmentId,
                                article.RewardPoints
                              )}
                            </span>
                          </div>
                          <span className="articles__article--line"></span>
                          <span className="articles__article--date">
                            {article.postdate}
                          </span>
                          <div className="flex gap-3">
                            <span className="articles__article--likes">
                              {article.likestatus ? (
                                <FontAwesomeIcon
                                  className="cursor-pointer activeHeart"
                                  icon={faHeart}
                                  onClick={() => disLike(i)}
                                />
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
                              <span className="articles__article--likescount">
                                {article.Likes}
                              </span>
                            </span>
                            <span className="articles__article--comments">
                              <FontAwesomeIcon
                                className="flex items-center justify-between gap-2 cursor-pointer commentBoxClr"
                                icon={faMessage}
                              />
                              <span className="articles__article--commentscount">
                                {article.Comments}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="badgeClass2">
                          {article.golden_star === "true" ? (
                            <FontAwesomeIcon
                              className="cursor-pointer"
                              style={{
                                color: "gold",
                              }}
                              title="Golden Star"
                              icon={faStar}
                            />
                          ) : (
                            ""
                          )}

                          {article.articleOfWeek === "true" ? (
                            <img
                              style={{ width: "20px" }}
                              className="cursor-pointer"
                              title="Article of the Week"
                              src={articleoftheweek}
                            />
                          ) : (
                            ""
                          )}

                          {article.shootingStart === "true" ? (
                            <img
                              style={{ width: "20px" }}
                              className="cursor-pointer"
                              title="Shooting Star"
                              src={shootingstar}
                            />
                          ) : (
                            ""
                          )}

                          {article.lifeTimeAchiver === "true" ? (
                            <img
                              style={{ width: "20px" }}
                              className="cursor-pointer"
                              title="Lifetime Achiever"
                              src={lifetimeachiever}
                            />
                          ) : (
                            ""
                          )}

                          <h2 className="text-[16px] articles__article--title">
                            {article.title}
                          </h2>
                        </div>
                        <p className="articles__article--para">
                          {htmlToView(article.Description).props
                            .dangerouslySetInnerHTML.__html.length > 150
                            ? htmlToView(
                                `${article.Description.substring(0, 150)}...`
                              )
                            : htmlToView(article.Description)}
                        </p>
                      </div>
                      <button
                        className="articles__article--readmorebtn"
                        onClick={() => {
                          setArticleViewDetails(article);
                          addRewardPoints(
                            state.rewards[9].Points,
                            logUserId,
                            state.rewards[9].Id,
                            logUserId,
                            article.Id
                          );
                        }}
                      >
                        Read More{" "}
                        <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center">No Record Found</div>
                )}
              </>
            )}
          </div>
          <div className="py-4">
          {!isLoader && sortedArticleList.length > 0 && (
            <Pagination
            count={paginationcount}
            color="primary"
            className="flex justify-center absolute left-0 right-0"
            size="large"
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
          />
          )}
        </div>
        </div>
        <div className="articles__right h-[100%]">
          <MyArticleCard
            changeData={rightCardChange}
            viewArticle={setArticleViewDetails}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(NewArticles);
