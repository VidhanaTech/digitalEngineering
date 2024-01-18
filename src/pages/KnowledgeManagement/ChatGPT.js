import React, { useState, useEffect } from "react";
import ProfilePic from "../../assets/img/team/profile-picture-1.jpg";
import chatgptPic from "../../assets/img/icons/chatgpt.png";
import { connect } from "react-redux";
import axios from "axios";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
const ChatGPT = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryResult, setSearchQueryResult] = useState([]);
  const getchatgptAnswer = () => {
    let exitlist = searchQueryResult;
    exitlist.push({ question: searchQuery, answer: "" });
    setSearchQueryResult(exitlist);
    let data = {
      queryInput: {
        text: {
          text: searchQuery,
        },
        languageCode: "en",
      },
    };
    setSearchQuery("");
    axios
      .post(
        `https://dialogflow.cloud.google.com/v1/cx/integrations/messenger/webhook/1d136133-1fc6-40f7-87a8-6e5635442cd6/sessions/dfInfobot-f411e2e9-3703-4e3b-95eb-d0631767bff6`,
        data
      )
      .then((res) => {
        let result = JSON.parse(res.data.slice(4));
        let cnt = searchQueryResult.length;
        let resultList = [...searchQueryResult];
        if (result?.queryResult?.responseMessages[0]?.text?.text[0]) {
          resultList[cnt - 1].answer =
            result?.queryResult?.responseMessages[0]?.text?.text[0];
        } else {
          resultList[cnt - 1].answer =
            "Is there anything else I can help you with?";
        }
        setSearchQueryResult(resultList);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="flex items-center justify-between">
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
            <span className="maincontent__breadcrumb--active">ChatGPT</span>
          </div>
        )}
      </div>
      <div className="container">
        <div className="fixed-box-container">
          {searchQueryResult.map((row, key) => {
            return (
              <>
                <div className="question">
                  <div className="flex gap-4">
                    <img
                      src={ProfilePic}
                      alt="Profile Picture"
                      className="maincontent__card--kmDashboard-contributorsPic"
                    />
                    <div className="flex flex-col w-full">
                      <span className="font-semibold chatgpt-question">
                        {row.question}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="question">
                  <div className="flex gap-4">
                    <img
                      src={chatgptPic}
                      alt="Profile Picture"
                      className="maincontent__card--kmDashboard-contributorsPic"
                    />
                    {row.answer ? (
                      <>
                        <div className="flex flex-col w-full">
                          <span className="font-semibold chatgpt-answer">
                            {row.answer}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="dot-typing-loader">
                          <span className="dot_loader"></span>
                          <span className="dot_loader"></span>
                          <span className="dot_loader"></span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>

        <div className="mt-2">
          <div className="flex gap-4">
            <div className="flex flex-col w-full items-center justify-start gap-y-4 md:flex-row md:justify-between">
              <div className="relative flex w-full">
                <textarea
                  rows="1"
                  className="maincontent__card--kmArticles-articleResponse"
                  style={{ backgroundColor: "white" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      getchatgptAnswer();
                    }
                  }}
                  placeholder="Ask your question"
                ></textarea>
                <button className="maincontent__card--kmArticles-articleBtn">
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    onClick={() => {
                      if (searchQuery !== "") {
                        getchatgptAnswer();
                      }
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ChatGPT);
