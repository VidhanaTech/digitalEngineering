import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { Modal, Card, Accordion } from "@themesberg/react-bootstrap";
import { Route, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "react-redux";
import Select from "react-select";
import {
  faHeart,
  faPaperPlane,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faMessage,
  faSearch,
  faMedal,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import roles from "../usermanagement/Roles/roles";
import ImgIcon from "../../components/ImageIcon";
import cmtoptions from "../../assets/img/brand/3dots.svg";
import addRewardPoints from "../../common/AddRewardPoints";
import {
  ddmmyyyyFormat,
  datetimeClockFormat,
  isImageAttachment,
  getPoints,
} from "../../common/Helper";
import PostArtifact from "../components/PostArtifact";
import articleoftheweek from "../../assets/img/brand/articleoftheweek.svg";
import shootingstar from "../../assets/img/brand/shootingstar.svg";
import lifetimeachiever from "../../assets/img/brand/lifetimeachiever.svg";
// import reset from "../../assets/img/brand/reseticon.svg"

const KMArticles = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  let [latestArticle, setLatestArticle] = useState([]);
  const ApiUrl = process.env.REACT_APP_IMG_PATH;
  const [isdisabled, setDisabled] = useState(false);
  const [logUserId] = useState(state.user.Id);
  const [isAdmin] = useState(state.isAdmin);
  const [logUserName] = useState(
    state.user.FirstName + " " + state.user.LastName
  );

  const currentYr = new Date().getFullYear();
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];

  const [cardValue, setCardValue] = useState({
    level: "",
    Points: 0,
    myarticle: 0,
    published: 0,
    totalDraft: 0,
    totalLike: 0,
  });
  const [iscardloading, setIscardloading] = useState(true);
  const [pagination, setPagination] = useState(3);
  const [isLoader, setIsLoader] = useState(false);
  let [topContributorslist, setTopContributorslist] = useState([]);
  let [myarticleList, setMyarticleList] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const handleClose = () => setShowDefault(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [showResetField, setShowResetField] = useState(false);
  const [showCommentCard, setShowCommentCard] = useState(true);
  let [isLoading, setIsLoading] = useState(true);
  const [showSeeMore, setShowSeeMore] = useState(true);
  const [likerId, setLikerId] = useState();
  const [myarticleList1, setmyarticleList1] = useState([
    {
      Id: 159,
      type: 2,
      title: "test say",
      Description: "hhhhhhhhhhhhhhhhhhhhhh",
      StatusId: 1,
      Likes: 0,
      Comments: 0,
      ProjectName: "test pr",
      AuthorName: "Administrator  ",
      CategoryName: "Knowledge Transition",
      postdate: "Aug 23, 23",
      CreatedAt: "2023-08-23T11:00:05.000Z",
    },
    {
      Id: 157,
      type: 1,
      title: "dfasfsadfd",
      Description: "asfdasd  sad",
      StatusId: 1,
      Likes: 0,
      Comments: 0,
      ProjectName: "test pr",
      AuthorName: "Administrator  ",
      CategoryName: "Soft Skill",
      postdate: "Aug 23, 23",
      CreatedAt: "2023-08-23T09:49:38.000Z",
    },
    {
      Id: 155,
      type: 3,
      title: "categ asdfasd fas",
      Description: " fas asdf ",
      StatusId: 1,
      Likes: 0,
      Comments: 0,
      ProjectName: "test",
      AuthorName: "Administrator  ",
      CategoryName: "Soft Skill",
      postdate: "Aug 22, 23",
      CreatedAt: "2023-08-23T03:34:54.000Z",
    },
  ]);
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedArticleIndex, setExpandedArticleIndex] = useState(null);
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);

  const [showFirstCommentCard, setShowFirstCommentCard] = useState(true);
  const [showSecondCommentCard, setShowSecondCommentCard] = useState(false);

  const [sortOption, setSortOption] = useState("recent");
  let [searchQuery, setSearchQuery] = useState("");
  let [showcatcount, setShowcatCount] = useState(false);
  const [sortFeed, setSortFeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processCount, setProcessCount] = useState(0);
  const [technologyCount, setTechnologyCount] = useState(0);
  const [softskillCount, setSoftSkillCount] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);
  const [kmtCount, setKmtCount] = useState(0);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [noRecordsFound, setNoRecordsFound] = useState(false);

  const [category, setCategory] = useState();
  const toggleAccordion = () => {
    setIsAccordionOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setIscardloading(true);
    apiClient
      .post("kmarticle/kmarticledashboard", { UserId: logUserId })
      .then((res) => {
        // cardValue.level = res.data[0].level;
        // cardValue.Points = res.data[0].Points;
        cardValue.myarticle = res.data[0].totalArticle || 0;
        cardValue.published = res.data[0].published || 0;
        cardValue.totalLike = res.data[0].totalLike || 0;
        cardValue.totalDraft = res.data[0].totalDraft || 0;
        // cardValue.Points = getPoints(res.data[0].level);
        setCardValue(cardValue);
        setIscardloading(false);
      });
  }, []);

  const handleSortChange = (option) => {
    setIsLoading(true);
    setSortOption(option);
    if (option === "recent") {
      setSortFeed(1);
    } else if (option === "popular") {
      setSortFeed(2);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    getLatestArticle();
  }, [sortFeed, pagination]);

  const showResetting = () => {
    setShowResetField(true);
  };

  const backResetting = () => {
    setShowResetField(false);
  };

  const [categories, setCategories] = useState([
    {
      CategoryId: 1,
      name: "Published Artifacts",
      title: "Search by Published Artifacts",
      value: 0,
    },
    {
      CategoryId: 2,
      name: "My Project Artifacts",
      title: "Project Artifacts",
      value: 0,
    },
    // {
    //   CategoryId: 3,
    //   name: "Soft Skill",
    //   title: "Process by SoftSkill",
    //   value: 0,
    // },
    // { CategoryId: 4, name: "Business", title: "Search by Business", value: 0 },
    // {
    //   CategoryId: 5,
    //   name: "Knowledge Transition",
    //   title: "Knowledge Transition",
    //   value: 0,
    // },
  ]);

  let [selectedCategory, setSelcectedCategory] = useState(
    "Published Artifacts"
  );

  function truncateText(text, maxLength, expand, i) {
    if (text.length > maxLength && !expand) {
      return (
        <>
          {text.substring(0, maxLength)}
          {"..."}
          <span
            className="cursor-pointer clrBlue"
            style={{ float: "right" }}
            onClick={() => expandToViewArticle(i)}
          >
            Read More
          </span>
        </>
      );
    } else {
      return (
        <>
          {text}
          {text.length > maxLength && (
            <>
              <span
                className="cursor-pointer clrBlue"
                style={{ float: "right" }}
                onClick={() => expandToViewArticle(i)}
              >
                View Less
              </span>
            </>
          )}
        </>
      );
    }
  }

  useEffect(() => {
    apiClient
      .post("kmarticle/topContributors")
      .then((res) => {
        setTopContributorslist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    apiClient
      .post("kmarticle/myarticle", { UserId: logUserId, limit: 3 })
      .then((res) => {
        setMyarticleList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getLatestArticle();
  }, [pagination]);

  const getLatestArticle = () => {
    isLoader ? setLoading(false) : setLoading(true);
    let catId = 1;
    if (selectedCategory === "Published Artifacts") catId = 1;
    // else if (selectedCategory === "Technology") catId = 2;
    // else if (selectedCategory === "Soft Skill") catId = 3;
    // else if (selectedCategory === "Business") catId = 4;
    else catId = 2;

    apiClient
      .post("kmarticle/latestArticle", {
        UserId: logUserId,
        categoryId: catId,
        year: currentYr,
        month: currentMonth,
        sort: sortFeed,
        limit: pagination,
        des: searchQuery,
      })
      .then((res) => {
        const newLatestArticle = res.data.data.map((row) => ({ ...row }));
        setLatestArticle(newLatestArticle);
        setLikerId(newLatestArticle);
        const updatedCategories = categories.map((cat) => {
          const matchingCount = res.data.category.find(
            (c) => c.CategoryId === cat.CategoryId
          );
          if (matchingCount) {
            return { ...cat, value: matchingCount.count };
          } else {
            return { ...cat, value: 0 };
          }
        });
        setCategories(updatedCategories);
        if (searchQuery) {
          setShowcatCount(true);
        } else {
          setShowcatCount(false);
        }
        if (updatedCategories[catId - 1].value > newLatestArticle.length)
          setShowSeeMore(true);
        else setShowSeeMore(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function responseChange(e, i, cmdId = "") {
    const list = [...latestArticle];
    list[i]["response"] = e.target.value;
    setLatestArticle(list);
  }
  const submitLike = (i) => {
    if (latestArticle[i].Id) {
      let data = {
        articalId: latestArticle[i].Id,
        likedBy: logUserId,
        UserId: logUserId,
      };
      apiClient
        .post("kmarticle/addlike", data)
        .then(() => {
          const latestlist = [...latestArticle];
          latestlist[i]["Likes"] = latestlist[i]["Likes"] + 1;
          latestlist[i]["likestatus"] = true;
          setLatestArticle(latestlist);
          if (latestArticle[i].ArticleBy !== logUserId) {
            addRewardPoints(
              state.rewards[7].Points,
              logUserId,
              state.rewards[7].Id,
              logUserId
            );
            addRewardPoints(
              state.rewards[4].Points,
              latestArticle[i].ArticleBy,
              state.rewards[4].Id,
              logUserId
            );
          }
          if (latestArticle[i].Likes % 25 === 0) {
            addRewardPoints(
              state.rewards[14].Points,
              latestArticle[i].ArticleBy,
              state.rewards[14].Id,
              logUserId
            );
          }
        })
        .catch(() => {
          Alert("error", "Please Try Again");
        });
    } else Alert("error", "Please Try Again");
  };

  const disLike = (i) => {
    if (latestArticle[i].Id) {
      let data = {
        articalId: latestArticle[i].Id,
        likedBy: logUserId,
      };
      apiClient
        .post("kmarticle/dislike", data)
        .then(() => {
          const latestlist = [...latestArticle];
          latestlist[i]["Likes"] = latestlist[i]["Likes"] - 1;
          latestlist[i]["likestatus"] = false;
          setLatestArticle(latestlist);
        })
        .catch(() => {
          Alert("error", "Please Try Again");
        });
    } else Alert("error", "Please Try Again");
  };

  const handlesubcomment = (i, id, cmdId) => {
    const textarea = document.getElementById("subcmd_" + id);
    textarea.value && submtComment(i, cmdId, textarea.value, id);
  };

  const submtComment = (i, cmdId = null, textvalue = null, id = null) => {
    if (
      (latestArticle[i].Id && latestArticle[i].response) ||
      (textvalue && latestArticle[i].Id)
    ) {
      let cmdres = textvalue ? textvalue : latestArticle[i].response;
      let data = {
        articalId: latestArticle[i].Id,
        commentId: cmdId,
        comments: cmdres,
        commentby: logUserId,
        UserId: logUserId,
      };
      apiClient
        .post("/kmarticle/addcomment", data)
        .then(() => {
          commentlistbyarticle(latestArticle[i].Id);
          const latestlist = [...latestArticle];
          latestlist[i]["Comments"] = latestlist[i]["Comments"] + 1;
          if (latestArticle[i].commentList.length > 2) {
            latestArticle[i]["commentList"][0] = {
              Author: logUserName,
              Comments: latestArticle[i].response,
              postdate: latestArticle[i].commentList[0].postdate,
            };
          } else {
            latestlist[i]["commentList"].push({
              Author: logUserName,
              Comments: latestArticle[i].response,
              postdate: latestArticle[i].postdate,
            });
          }
          latestlist[i]["response"] = "";
          if (id) {
            const textarea = document.getElementById("subcmd_" + id);
            textarea.value = "";
          }
          setShowFirstCommentCard(true);
          setLatestArticle(latestlist);

          if (latestArticle[i].ArticleBy !== logUserId) {
            addRewardPoints(
              state.rewards[6].Points,
              logUserId,
              state.rewards[6].Id,
              logUserId
            );
            addRewardPoints(
              state.rewards[5].Points,
              latestArticle[i].ArticleBy,
              state.rewards[5].Id,
              logUserId
            );
          }

          if (latestArticle[i].Comments % 25 === 0) {
            addRewardPoints(
              state.rewards[13].Points,
              latestArticle[i].ArticleBy,
              state.rewards[13].Id,
              logUserId
            );
          }
        })
        .catch(() => {
          Alert("error", "Please Try Again");
        });
    } else {
      Alert("error", "Please Try Again");
    }
  };

  // useEffect(() => {
  //   submtComment;
  // }, []);

  // Function to handle "view more" article button click
  const expandToViewArticle = (i) => {
    if (expandedArticleIndex === i) {
      setExpandedArticleIndex(null);
      addRewardPoints(
        state.rewards[9].Points,
        logUserId,
        state.rewards[9].Id,
        logUserId
      );
    } else {
      setExpandedArticleIndex(i);
      setExpandedCommentIndex(null); // Reset the expanded comment index
    }
  };

  // Function to handle "view more comments" p tag click
  const expandToViewComments = async (i) => {
    if (expandedCommentIndex === i) {

      setShowSecondCommentCard(false);
      setSelectedComments([]);
      setExpandedCommentIndex(null);
    } else {

      setIsLoading(true);
      setSelectedComments([]);
      try {
        const response = await apiClient.post("/kmarticle/articlecomments", {
          id: latestArticle[i].Id,
        });
        setSelectedComments(response.data);
        setExpandedCommentIndex(i);
        setShowFirstCommentCard(false); // Hide the first comment card
        setShowSecondCommentCard(true);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
        setShowFirstCommentCard(true);
      }
    }
  };

  const commentlistbyarticle = (id) => {
    apiClient
      .post("/kmarticle/articlecomments", { id: id })
      .then((res) => {
        const comments = res.data;
        setSelectedComments(comments);
      })
      .catch(() => {});
  };

  // useEffect(() => {
  //   commentlistbyarticle;
  // }, []);

  const handleSearch = () => {
    setLoading(true);
    if (searchQuery.trim() === "") {
      // If search query is empty, reset the articles and show "No records found"
      setLatestArticle([]);
      setNoRecordsFound(false);
    } else {
      // Filter articles based on search query
      const filteredArticles = latestArticle.filter((article) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(lowerCaseQuery);
        const descriptionMatch =
          article.Description.toLowerCase().includes(lowerCaseQuery);
        return titleMatch || descriptionMatch;
      });

      // Update "No records found" status and the article list
      if (filteredArticles.length === 0) {
        setNoRecordsFound(true);
        setLatestArticle(filteredArticles);
      }
    }
    setLoading(false);
  };

  const resetSearch = () => {
    setSearchQuery("");
    getLatestArticle();
  };

  useEffect(() => {
    resetSearch();
  }, []);

  const handleKeyPress = (event, i, cmdId = null) => {
    if (event.key === "Enter") {
      submtComment(i, cmdId);
    }
  };

  const deletePostComment = (id, ArticleId, i) => {
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
              const latestlist = [...latestArticle];
              latestlist[i]["Comments"] = latestlist[i]["Comments"] - 1;
              setLatestArticle(latestlist);
              apiClient
                .post("/kmarticle/articlecomments", {
                  id: latestArticle[i].Id,
                })
                .then((response) => {
                  setSelectedComments(response.data);
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

  return (
    <>
      {/************** Article cards starts here ***********/}
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        {/************** Left side article section starts here ***********/}
        <div className="flex-1 maincontent__card">
          <div className="flex items-center justify-between">
            <div className="maincontent__breadcrumb">
              {HideHomeBreadCumb && (
                <>
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
                  // className="cursor_pointer"
                  // onClick={() => {
                  //   navigate(state.defaultpage);
                  // }}
                  >
                    KM Article
                  </span>
                </>
              )}
              <form
                className={
                  HideHomeBreadCumb
                    ? "search-containerKMArti kmarticle-seactform ml-10"
                    : "search-containerKMArti kmarticle-seactform ml-1"
                }
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <div style={{ display: "flex" }}>
                  <input
                    className="w-full searchArtiInput"
                    title="Search Artifacts using Title or Description"
                    placeholder="Search Artifacts using Title or Description.."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        getLatestArticle();
                      }
                    }}
                  />

                  {searchQuery && (
                    <div className="top_search_clear_icon">
                      <span
                        className="cursor-pointer search-icon"
                        onClick={(e) => {
                          searchQuery = null;
                          resetSearch();
                        }}
                      >
                        &times;
                      </span>
                    </div>
                  )}
                  <div className="searchIconKMArti">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="cursor-pointer search-icon"
                      onClick={getLatestArticle}
                    />
                  </div>
                </div>
                <button type="submit" style={{ display: "none" }} />
              </form>
            </div>

            <PostArtifact design={true} />
          </div>
          <div className="mt-2 mainArticleDiv">
            <div
              className="dataToggleArea"
              style={{ background: "#1658a0", color: "white" }}
            >
              {categories.map((category) => (
                <button
                  id={category.name}
                  style={{
                    paddingRight: "0px",
                    fontSize: "15px",
                    paddingLeft: "0px",
                    width: "50%",
                  }}
                  title={"Display Artifacts in " + category.name + " category"}
                  key={category.name}
                  onClick={(e) => {
                    selectedCategory = e.target.id;
                    setSelcectedCategory(e.target.id);
                    getLatestArticle();
                    setShowSecondCommentCard(false);
                    setSelectedComments([]);
                    setExpandedCommentIndex(null);
                  }}
                  className={
                    selectedCategory === category.name ? "selected" : ""
                  }
                >
                  {category.name}
                  {showcatcount && " (" + category.value + ") "}
                </button>
              ))}
            </div>

            {/* sort feed starts here */}
            <div className="sortFeedMain">
              <div className="sortfeedhr">
                <hr className="sortFeedLine"></hr>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  float: "right",
                  justifyContent: "end",
                  width: "150px",
                }}
              >
                Sort by :
                <select
                  className="cursor-pointer sortfeedSelect"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option
                    style={{ backgroundColor: "white", color: "black" }}
                    value="recent"
                  >
                    Recent{" "}
                  </option>
                  <option
                    style={{ backgroundColor: "white", color: "black" }}
                    value="popular"
                  >
                    Popular{" "}
                  </option>
                </select>
              </div>
            </div>

            {/* ends here */}
            {loading ? (
              <div class="circle__loader items-center my-0 mx-auto"></div>
            ) : (
              <div
                className="maincontent__card--content"
                style={{ padding: "0px", backgroundColor: "inherit" }}
              >
                <div className="flex flex-col gap-4">
                  {latestArticle.map((row, i) => {
                    return (
                      <>
                        <div
                          className="maincontent__card--kmArticles-article"
                          style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm clrGray">
                              <div className="flex gap-2 ">
                                <img
                                  src={ProfilePic}
                                  alt="Profile"
                                  className="maincontent__card--kmDashboard-contributorsPic"
                                />
                                <p className="flex flex-col">
                                  <span className="author_font_sm">
                                    <strong>{row.ArticleName}</strong>{" "}
                                    <span style={{ color: "#b60e0e" }}>
                                      {" "}
                                      |{" "}
                                    </span>
                                    {row.postdate}
                                  </span>
                                  {/* <span className="author_font">{row.level}</span> */}
                                  <span className="author_font">
                                    {getPoints(
                                      row.DepartmentId,
                                      row.RewardPoints
                                    )}
                                    {/* {row.level} */}
                                  </span>
                                </p>
                              </div>
                            </p>
                            <div className="flex justify-between gap-4">
                              <span className="flex items-center justify-between gap-2 postLikeCount">
                                {row.likestatus ? (
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
                                {row.Likes}
                              </span>
                              <span
                                onClick={() => expandToViewComments(i)}
                                className="flex items-center justify-between gap-2 cursor-pointer commentBoxClr"
                              >
                                <FontAwesomeIcon icon={faMessage} />
                                {row.Comments}
                              </span>
                            </div>
                          </div>
                          <div className="py-2">
                            <div className="badgeClass">
                              {row.golden_star === "true" ? (
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

                              {row.articleOfWeek === "true" ? (
                                <img
                                  style={{ width: "20px" }}
                                  className="cursor-pointer"
                                  title="Article of the Week"
                                  src={articleoftheweek}
                                />
                              ) : (
                                ""
                              )}

                              {row.shootingStart === "true" ? (
                                <img
                                  style={{ width: "20px" }}
                                  className="cursor-pointer"
                                  title="Shooting Star"
                                  src={shootingstar}
                                />
                              ) : (
                                ""
                              )}

                              {row.lifeTimeAchiver === "true" ? (
                                <img
                                  style={{ width: "20px" }}
                                  className="cursor-pointer"
                                  title="Lifetime Achiever"
                                  src={lifetimeachiever}
                                />
                              ) : (
                                ""
                              )}

                              <p className="text-xl font-semibold clrBlack">
                                {row.title}
                              </p>
                            </div>

                            <p className="ArticleDesc">
                              {truncateText(
                                row.Description,
                                150,
                                expandedArticleIndex === i,
                                i
                              )}
                            </p>
                            <div className="my-3 ">
                              {row.FilePath.map((filePath, index) => {
                                const attachmentName =
                                  filePath.FilePath.split("/").pop();
                                const isImage =
                                  isImageAttachment(attachmentName);

                                return (
                                  <div className="m-2 " key={index}>
                                    <ul>
                                      <a
                                        target="_blank"
                                        href={ApiUrl + "/" + filePath.FilePath}
                                        download={`image-${index}`}
                                      >
                                        {isImage ? (
                                          <img
                                            className="inline-flex object-contain max-h-64 w-80"
                                            src={
                                              ApiUrl + "/" + filePath.FilePath
                                            }
                                            alt={`Image ${index}`}
                                          />
                                        ) : (
                                          <div className="block">
                                            <a
                                              className="filepath"
                                              href={
                                                ApiUrl + "/" + filePath.FilePath
                                              }
                                            >
                                              {filePath.FileName}
                                            </a>
                                          </div>
                                        )}
                                      </a>
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {showSecondCommentCard &&
                            expandedCommentIndex === i && (
                              <div className="items-center justify-between mtb1">
                                <div className="commentsSection">
                                  {selectedComments.length > 0 ? (
                                    <Card className="commentCard">
                                      <Card.Body className="commentCardBody">
                                        {selectedComments.map(
                                          (comment, index) => (
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
                                                      {datetimeClockFormat(
                                                        comment.CreatedAt
                                                      )}
                                                    </span>
                                                  </p>
                                                </div>
                                                {/* <p
                                                      style={{
                                                        marginLeft: "50px",
                                                        display:"inline-flex"
                                                      }}
                                                      className="commentsList"
                                                    >
                                                      {comment.Comments}<img className="w-5 ml-2.5" src={cmtoptions}></img>
                                                    </p> */}

                                                <div class="comments">
                                                  <p
                                                    // style="marginLeft: 50px; display: inline-flex;"
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
                                                    onClick={
                                                      toggleAccordionFunc
                                                    }
                                                  >
                                                    Reply
                                                    {logUserId ===
                                                      comment.CommentedBy ||
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
                                                              comment.ArticleId,
                                                              i
                                                            )
                                                          }
                                                          icon={faTrash}
                                                        />
                                                      </>
                                                    ) : null}
                                                  </span>
                                                  <div className="w-2/4 hide_sub_reply_box">
                                                    <input
                                                      type="hidden"
                                                      value={
                                                        latestArticle[i].Id
                                                      }
                                                    />
                                                    <textarea
                                                      type="text"
                                                      rows="1"
                                                      id={
                                                        "subcmd_" + comment.Id
                                                      }
                                                      className="maincontent__card--kmArticles-articleResponse"
                                                      placeholder="Type your comments here ....."
                                                      // onKeyPress={(e) =>
                                                      //   handleKeyPress(
                                                      //     e,
                                                      //     i,
                                                      //     comment.Id
                                                      //   )
                                                      // }
                                                    />
                                                    <button
                                                      id="sub_replay_cmt"
                                                      className="maincontent__card--kmArticles-articleBtn"
                                                      onClick={() =>
                                                        handlesubcomment(
                                                          i,
                                                          comment.Id,
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
                                              {comment.subcomments.length > 0
                                                ? comment.subcomments.map(
                                                    (row, i) => {
                                                      return (
                                                        <>
                                                          <div
                                                            key={i}
                                                            className="ml-10"
                                                          >
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
                                                                onClick={
                                                                  toggleAccordionFunc
                                                                }
                                                              >
                                                                Reply
                                                                {logUserId ===
                                                                  row.CommentedBy ||
                                                                isAdmin ? (
                                                                  <>
                                                                    {" "}
                                                                    |{" "}
                                                                    <FontAwesomeIcon
                                                                      className="cursor-pointer font_small"
                                                                      style={{
                                                                        color:
                                                                          "red",
                                                                      }}
                                                                      onClick={() =>
                                                                        deletePostComment(
                                                                          row.Id,
                                                                          row.ArticleId,
                                                                          i
                                                                        )
                                                                      }
                                                                      icon={
                                                                        faTrash
                                                                      }
                                                                    />
                                                                  </>
                                                                ) : null}
                                                              </span>
                                                              <div className="w-2/4 hide_sub_reply_box">
                                                                <textarea
                                                                  type="text"
                                                                  rows="1"
                                                                  id={
                                                                    "subcmd_" +
                                                                    row.Id
                                                                  }
                                                                  className="maincontent__card--kmArticles-articleResponse"
                                                                  placeholder="Type your comments here ....."
                                                                  // onKeyPress={(e) =>
                                                                  //   handleKeyPress(
                                                                  //     e,
                                                                  //     i,
                                                                  //     row.Id
                                                                  //   )
                                                                  // }
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
                                                                    icon={
                                                                      faPaperPlane
                                                                    }
                                                                  />
                                                                </button>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </>
                                          )
                                        )}

                                        <p
                                          style={{
                                            float: "right",
                                            color: "blue",
                                            fontWeight: "600",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            expandToViewComments(i)
                                          }
                                        >
                                          {expandedCommentIndex === i
                                            ? "view less"
                                            : "view more"}
                                        </p>
                                      </Card.Body>
                                    </Card>
                                  ) : null}
                                </div>
                              </div>
                            )}

                          <div className="flex flex-col items-center justify-start w-full gap-y-4 md:flex-row md:justify-between">
                            <div className="relative flex w-2/4">
                              <input
                                type="hidden"
                                value={latestArticle[i].Id}
                              />
                              <textarea
                                rows={1}
                                className="maincontent__card--kmArticles-articleResponse"
                                placeholder="Type your comments here ....."
                                value={latestArticle[i].response}
                                onChange={(e) => responseChange(e, i)}
                                // onKeyPress={(e) => handleKeyPress(e, i)}
                              />
                              <button
                                className="maincontent__card--kmArticles-articleBtn"
                                onClick={() => submtComment(i)}
                              >
                                <FontAwesomeIcon icon={faPaperPlane} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  {noRecordsFound ||
                    (latestArticle.length === 0 && (
                      <p className="text-center">No records found</p>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {latestArticle.length > 0 && showSeeMore && (
              <button
                className="w-full mt-4 maincontent__btn maincontent__btn--primaryblue"
                onClick={() => {
                  setPagination((prevPagination) => prevPagination + 3);
                  setIsLoader(true);
                  // handleSearch();
                }}
                disabled={noRecordsFound || latestArticle.length === 0}
              >
                See more
              </button>
            )}
          </div>
        </div>
        <div>
          <Accordion
            id="KMArtiAccordion"
            activeKey={isAccordionOpen ? "1" : "0"}
          >
            <Accordion.Item eventKey="1">
              <Accordion.Header
                className="flex text-sm font-semibold text-center cursor-pointer "
                onClick={toggleAccordion}
              >
                <span>{isAccordionOpen ? "MY ARTICLES" : ""}</span>
                <FontAwesomeIcon
                  icon={isAccordionOpen ? faChevronRight : faChevronLeft}
                  className="ArtExpandIcons"
                />
              </Accordion.Header>

              <Accordion.Body
                style={{
                  visibility: "visible",
                  color: "#1658a0",
                }}
              >
                <div class="justify-between flex flex-col lg:flex-row">
                  <div
                    className="commonDivKMArti text-center"
                    style={{ border: "2px solid #9dc160" }}
                  >
                    <>
                      <span>
                        {" "}
                        <strong className="font_smaller">My Articles</strong>
                      </span>
                      <p>
                        <strong className="font_large">
                          {cardValue.myarticle}
                        </strong>
                      </p>
                    </>
                  </div>

                  <div
                    className="commonDivKMArti text-center"
                    style={{ border: "2px solid #c8ac6f" }}
                  >
                    <>
                      <span>
                        {" "}
                        <strong className="font_smaller">Published</strong>
                      </span>
                      <p>
                        <strong className="font_large">
                          {cardValue.published}
                        </strong>
                      </p>
                    </>
                  </div>
                </div>

                <div class="justify-between flex flex-col lg:flex-row">
                  <div
                    className="commonDivKMArti text-center"
                    style={{ border: "2px solid #77a9e8" }}
                  >
                    <>
                      <span>
                        {" "}
                        <strong className="font_smaller">Draft</strong>
                      </span>
                      <p>
                        <strong className="font_large">
                          {cardValue.totalDraft}
                        </strong>
                      </p>
                    </>
                  </div>

                  <div
                    className="commonDivKMArti text-center"
                    style={{ border: "2px solid #a8b8d8" }}
                  >
                    <>
                      <span>
                        {" "}
                        <strong className="font_smaller">Likes</strong>
                      </span>
                      <p>
                        <strong className="font_large">
                          {cardValue.totalLike}
                        </strong>
                      </p>
                    </>
                  </div>
                </div>
                <p
                  className="myArticleVM"
                  onClick={() => navigate(Routes.MyArticle)}
                >
                  View more
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          {isAccordionOpen && (
            <div className="maincontent__card">
              <div className="maincontent__card--header">
                <p className="maincontent__card--header-title">EVENTS</p>
              </div>
              <div className="maincontent__card--content">
                {myarticleList1.map((row, i) => {
                  return (
                    <>
                      <div className="flex flex-col gap-1 py-1 bb1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold clrGray">
                              {ddmmyyyyFormat(row.CreatedAt)}
                            </span>
                            <span className="text-sm font-semibold clrBlue cursor-pointer">
                              {i === 0
                                ? "Cloud Architect"
                                : i === 1
                                ? "Digital Marketing"
                                : "Adavace ChatGpt"}
                              {/* {row.title.length > 20
                              ? `${row.title.slice(0, 20)}...`
                              : row.title} */}
                            </span>
                          </div>
                          <span
                            id="myArticleStatus"
                            className={`flex items-center gap-2 ${
                              i === 1 ? "clrGreen" : ""
                            }`}
                          >
                            {i === 1 ? (
                              "Registered"
                            ) : (
                              <>
                                <span className="maincontent__card--kmDashboard-posttag">
                                  Register
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
                {myarticleList.length > 0 && (
                  <p
                    className="myArticleVM"
                    // onClick={() => navigate(Routes.MyArticle)}
                  >
                    View more
                  </p>
                )}
              </div>
            </div>
          )}
          {/* MY Article section*/}
          {/* {isAccordionOpen && (
            <div className="maincontent__card">
              <div className="maincontent__card--header">
                <p className="maincontent__card--header-title">MY ARTICLES</p>
              </div>
              <div className="maincontent__card--content">
                {myarticleList.map((row) => {
                  return (
                    <>
                      <div className="flex flex-col gap-1 py-1 bb1">
                        <span className="text-xs font-bold clrGray">
                          {ddmmyyyyFormat(row.CreatedAt)}
                        </span>
                        <div className="flex justify-between">
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(Routes.KMUpdateArticle, {
                                state: { user: row },
                              })
                            }
                            className="text-sm font-semibold clrBlue"
                          >
                            {row.title.length > 20
                              ? `${row.title.slice(0, 20)}...`
                              : row.title}
                          </span>
                          <span
                            id="myArticleStatus"
                            className={`flex items-center gap-2 ${
                              row.StatusId === 1
                                ? "clrGreen"
                                : row.StatusId === 2
                                ? "clrRed"
                                : ""
                            }`}
                          >
                            {row.StatusId === 1
                              ? "Published"
                              : row.StatusId === 2
                              ? "Draft"
                              : ""}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
                {myarticleList.length > 0 && (
                  <p
                    className="myArticleVM"
                    onClick={() => navigate(Routes.MyArticle)}
                  >
                    View more
                  </p>
                )}
              </div>
            </div>
          )} */}
          {/* Top Contributors section*/}
          {isAccordionOpen && (
            <div className="mt-4 maincontent__card">
              <div className="maincontent__card--header">
                <p className="maincontent__card--header-title">
                  Top Contributors
                </p>
              </div>
              <div className="maincontent__card--content">
                {topContributorslist.map((row) => {
                  return (
                    <>
                      <div className="maincontent__card--kmDashboard-contributors">
                        <div className="flex gap-4">
                          <img
                            src={row.profile ? row.profile : ProfilePic}
                            alt="Profile Picture"
                            className="maincontent__card--kmDashboard-contributorsPic"
                          />
                          <div className="flex flex-col">
                            <span className="mt-2 font-semibold clrBlue">
                              {row.ArticleName} {"  "}
                              <FontAwesomeIcon
                                icon={faMedal}
                                className={
                                  row.level === "Expert"
                                    ? "clrGreen"
                                    : row.level === "Intermediate"
                                    ? "clrAmber"
                                    : "clrPurple"
                                }
                              />
                            </span>
                          </div>
                        </div>
                        <span className="maincontent__card--kmDashboard-posttag">
                          {row.totalartical} posts
                        </span>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(KMArticles);
