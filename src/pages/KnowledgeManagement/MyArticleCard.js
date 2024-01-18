import React, { useState, useEffect } from "react";
import ProfilePic from "../../assets/img/profile.jpg";
import apiClient from "../../common/http-common";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { truncateText, ddmmyyyyFormat, getPoints } from "../../common/Helper";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "../../components/Alert";
import addRewardPoints from "../../common/AddRewardPoints";
import HeartIcon from "../../assets/img/heart.svg";

const MyArticleCard = ({ changeData, viewArticle, user, rewards, register }) => {
  const [logUserId] = useState(user.Id);
  const [popularArticle, setPopularArticle] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [myarticleList, setMyarticleList] = useState([]);
  const navigate = useNavigate();
  const [cardValue, setCardValue] = useState({
    level: "",
    Points: 0,
    myarticle: 0,
    published: 0,
    totalDraft: 0,
    totalLike: 0,
  });
  const [eventLoading, setEventLoading] = useState({});

  function getEvntList() {
    apiClient
      .get("kmarticle/event_list_register/" + logUserId)
      .then((res) => {
        let adata = [];
        res.data.map((row, i) => {
          if (i < 4) {
            adata[i] = row;
          }
        });
        setOriginalData(adata);
      })
      .catch(() => {});
  }

  useEffect(() => {
    getEvntList();
    apiClient
      .post("kmarticle/kmarticledashboard", { UserId: logUserId })
      .then((res) => {
        let resData = res.data[0];
        cardValue.level = resData.level || 0;
        cardValue.myarticle = resData.totalArticle || 0;
        cardValue.published = resData.published || 0;
        cardValue.totalLike = resData.totalLike || 0;
        cardValue.totalDraft = resData.totalDraft || 0;
        cardValue.Points = getPoints(res.data[0].level);
        setCardValue(cardValue);
      });

    const currentDate = new Date();

    apiClient
      .post("kmarticle/latestArticlenew", {
        UserId: logUserId,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        sort: 2,
        limit: 4,
        start: 0,
        des: null,
        articleId: null,
      })
      .then((res) => {
        setPopularArticle(res.data.data);
      })
      .catch(() => {});
    apiClient
      .post("kmarticle/myarticle", { UserId: logUserId, limit: 4 })
      .then((res) => {
        setMyarticleList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changeData]);
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
      .then(() => {
        Alert("succ", "Registered Successfully");
        getEvntList();
        addRewardPoints(
          rewards[10].Points,
          logUserId,
          rewards[10].Id,
          logUserId
        );
        setEventLoading((prevLoading) => ({
          ...prevLoading,
          [eventid]: false,
        }));
        setLoading(false);
      })
      .catch(() => {
        setEventLoading((prevLoading) => ({
          ...prevLoading,
          [eventid]: false,
        }));
      });
  }
  return (
    <>
      <div className="articles__rightcard articles__myarticles">
        <div className="articles__rightcard--content py-0 rounded-3xl w-full">
          <div className="w-full articles__tags">
            <div
              className="articles__tags--tag bg-[rgba(45,152,0,20%)]"
            >
              <span className="articles__tags--title">My Articles</span>
              <span className="articles__tags--line"></span>
              <span className="articles__tags--data">
                {cardValue.myarticle}
              </span>
            </div>
            <div
              className="articles__tags--tag bg-[rgba(159,73,163,20%)]"
            >
              <span className="articles__tags--title">Published</span>
              <span className="articles__tags--line"></span>
              <span className="articles__tags--data">
                {cardValue.published}
              </span>
            </div>
            <div
              className="articles__tags--tag bg-[rgba(255,49,105,20%)]"
            >
              <span className="articles__tags--title">Submitted</span>
              <span className="articles__tags--line"></span>
              <span className="articles__tags--data">
                {cardValue.totalDraft}
              </span>
            </div>
            <div className="articles__tags--tag bg-[rgba(0,160,207,20%)]"
s            >
              <span className="articles__tags--title">Likes</span>
              <span className="articles__tags--line"></span>
              <span className="articles__tags--data">
                {cardValue.totalLike}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[rgba(212,224,235,0.6)] card__container card__container--articles h-[260px]">
        <div className="articles__rightcard--header articles__myarticles--header">
          My Articles
        </div>
        <ul className="articles__rightcard--lists">
          {myarticleList.map((row, i) => {
            return (
              <>
                <li className="articles__rightcard--list" key={i}>
                  <div className="articles__rightcard--left" key={i}>
                    <span className="articles__rightcard--date">
                      {/* {ddmmyyyyFormat(row.CreatedAt)} */}
                    </span>
                    <span
                      className="cursor-pointer articles__rightcard--title"
                      onClick={() =>
                        navigate(Routes.KMViewArticle, {
                          state: { user: row },
                        })
                      }
                    >
                      {truncateText(row.title, 20)}
                    </span>
                  </div>
                  <div className="articles__rightcard--right">
                    <span
                      className={`articles__rightcard--status ${
                        row.StatusId === 1
                          ? "articles__rightcard--published"
                          : row.StatusId === 2
                          ? "text-blue-600"
                          : row.StatusId === 3
                          ? "text-yellow-600"
                          : "articles__rightcard--draft"
                      }`}
                    >
                      {row.StatusId === 1
                        ? "Published"
                        : row.StatusId === 2
                        ? "Submitted"
                        : row.StatusId === 3
                        ? "ReWork"
                        : "Draft"}
                    </span>
                  </div>
                </li>
              </>
            );
          })}
        </ul>
        {myarticleList.length > 0 ? (
          <button
            className="articles__readmorebtn articlesread"
            onClick={() => navigate(Routes.MyArticle)}
          >
            Read More <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </button>
        ) : (
          <button className="articles__readmorebtn">No Artifact</button>
        )}
      </div>
      <div className="articles__rightcard articles__events h-[335px]">
        <div className="articles__rightcard--header articles__events--header">
          Events
        </div>
        <div className="articles__rightcard--content">
          <ul className="articles__rightcard--lists">
            {originalData.map((row, i) => {
              return (
                <>
                  <li className="articles__rightcard--list">
                    <div className="articles__rightcard--left">
                      <span className="articles__rightcard--date">
                        {ddmmyyyyFormat(row.Start_Date)}
                      </span>
                      <span
                      className="articles__rightcard--title cursor-pointer"
                      onClick={() => {
                        navigate(Routes.ViewEventRegister, {
                          state: {
                            user: row,
                            page: "newarticles",
                            register: true,
                          },
                        });
                      }}
                    >
                      {row.Title}
                    </span>
                    </div>
                    <div className="articles__rightcard--right">
                      {row.regStatus ? (
                        <span className="articles__rightcard--status articles__rightcard--published">
                          Registered &nbsp;
                        </span>
                      ) : (
                        <button
                          className="articles__article--readmorebtn article-events eventsregister"
                          onClick={() => EventRegister(row.Id)}
                          disabled={eventLoading[row.Id]}
                        >
                          {eventLoading[row.Id] ? "Registering..." : "Register"}
                        </button>
                      )}
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
        </div>

        {originalData.length > 0 ? (
          <button
            className="articles__readmorebtn articlesread"
            onClick={() => navigate(Routes.EventRegister)}
          >
            Read More <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </button>
        ) : (
          <button className="articles__readmorebtn">No Event</button>
        )}
      </div>

      {/* <div className="bg-[#d4e0eb] card__container card__container--articles ">
        <div className="bg-[#c2cdd7] card__header">Popular Articles</div>
        <div className="pb-3 round-3xl">
          <div className="card__articles--listsec">
            {popularArticle.map((row, i) => {
              return (
                <>
                  <div className="card__articles--listsec" key={i}>
                    <div className="grid grid-cols-3 px-4 py-2" key={i}>
                      <div className="flex items-center col-span-2 gap-2">
                        <img
                          src={row.Profile ? row.Profile : ProfilePic}
                          className="card__profilepic"
                        />
                        <div
                          className="card__articles--title cursor-pointer text-[13px]"
                          title={row.title}
                          onClick={(e) => viewArticle(row)}
                        >
                          {row.title.length > 25
                            ? row.title.substring(0, 25) + "..."
                            : row.title}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <img src={HeartIcon} />
                        <span className="text-purple-500">{row.Likes}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div> */}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  rewards: state.rewards,
  register : state.register
});

export default connect(mapStateToProps)(MyArticleCard);
