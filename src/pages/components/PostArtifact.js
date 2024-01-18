import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import axios from "axios";
import ImgIcon from "../../components/ImageIcon";
import {
  faPenToSquare,
  faTrashAlt,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

import { Modal } from "@themesberg/react-bootstrap";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import addRewardPoints from "../../common/AddRewardPoints";
import MyEditor from "../components/MyCkEditor";

const PostArtifact = ({
  design,
  postRender,
  user,
  approveReview,
  getArticles,
  rewardsData,
}) => {
  const editorRef = useRef(null);
  const [editorReady, setEditorReady] = useState(false);
  const [removedFileName, setRemovedFileName] = useState("");
  const [showDefault, setShowDefault] = useState(false);
  const [ShowDef, setShowDef] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  const [charLimit, setCharLimit] = useState(200);
  const [remainingChar, setRemainingChar] = useState(200);

  const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
  const handleClose = () => (
    setShowDefault(false),
    setShowDef(false),
    setTitle(""),
    setContent(""),
    setKeywords(""),
    setRevenue(revenue),
    setRevenueClient(""),
    setRevenueInternal(""),
    setCost(cost),
    setCostClient(""),
    setCostInternal(""),
    setPersonDays(""),
    setImage([]),
    setTypeError(""),
    setProjectError(""),
    setClientError(""),
    setCategoryError(""),
    setTitleError(""),
    setContentError(""),
    setRevenueError(""),
    setRevenueClientError(""),
    setRevenueInternalError(""),
    setCostError(""),
    setCostClientError(""),
    setCostInternalError(""),
    setPersonDaysError(""),
    setSourceError(""),
    setSourceTitleError(""),
    setKeywordserror(""),
    setEditorValue("")
  );

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      if (editor.isInitialized) {
        setEditorReady(true);
      } else {
        editor.init().then(() => {
          setEditorReady(true);
        });
      }
    }
  }, []);

  const handleDestroEditor = () => {
    if (editorReady && editorRef.current) {
      const editor = editorRef.current.editor;
      editor.destroy();
    } else {
      console.error("CKEditor instance is not ready.");
    }
  };

  const navigate = useNavigate();
  const [logUserId] = useState(user.Id);
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState();
  const [type, setType] = useState();
  const [tableData, setTableData] = useState([]);
  const [isdisabled, setDisabled] = useState(false);
  const [categoryList, setCategoryList] = useState([
    { value: null, label: "All" },
  ]);

  const [postcategoryList, setPostCategoryList] = useState([]);
  const [project, setProject] = useState();
  const [clients, setClients] = useState();
  const [projectList, setProjectList] = useState([
    { value: null, label: "All" },
  ]);
  const [postProjectList, setPostProjectList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [Keyword, setKeywords] = useState("");
  const [clientList, setClientList] = useState([{ value: null, label: "All" }]);

  const [typeError, setTypeError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [clientError, setClientError] = useState("");
  const [Keywordserror, setKeywordserror] = useState("");
  const [editorValue, setEditorValue] = useState("");

  const handleEditorChange = (newEditorValue) => {
    const textContent = newEditorValue.replace(/<[^>]*>/g, "");
    if (textContent.length === 0) {
      setContentError("Please Enter Description");
    } else {
      setContentError("");
    }
  };

  const postArticle = (draft = false) => {
    let revenueval = "";
    let costval = "";

    if (type !== "4") {
      setDisabled(true);
      setTypeError("");
      setProjectError("");
      setCategoryError("");
      setTitleError("");
      setContentError("");
    } else {
      setTypeError("");
      setClientError("");
      setCategoryError("");
      setTitleError("");
      setContentError("");
      setRevenueError("");
      setRevenueClientError("");
      setRevenueInternalError("");
      setCostError("");
      setCostClientError("");
      setCostInternalError("");
      setPersonDaysError("");
      setSourceError("");
      setSourceTitleError("");
      if (revenue) {
        revenueval = 0;
      } else {
        revenueval = 1;
      }
      if (cost) {
        costval = 0;
      } else {
        costval = 1;
      }
    }

    setDisabled(true);
    let hasError = false;

    if (type === "4") {
      if (!type) {
        setDisabled(false);
        setTypeError("Please Choose the Type");
        hasError = true;
      }
      if (!clients) {
        setDisabled(false);
        setClientError("Please Choose the Client");
        hasError = true;
      }
      if (!category) {
        setDisabled(false);
        setCategoryError("Please Choose the Category");
        hasError = true;
      }
      if (!source) {
        setDisabled(false);
        setSourceError("Please Choose the Source");
        hasError = true;
      }
      if (!sourceTitle?.value) {
        setDisabled(false);
        setSourceTitleError("Please Enter Source Title");
        hasError = true;
      }
      if (!draft) {
        if (title === "" || title.length < 3) {
          setDisabled(false);
          setTitleError(
            "Enter Value Experience, must contain 3 characters atleast"
          );
          hasError = true;
        }
        if (editorValue === "") {
          setDisabled(false);
          setContentError("Please Enter Business Case");
          hasError = true;
        }
      }
    } else {
      if (!type) {
        setDisabled(false);
        setTypeError("Please Choose the Type");
        hasError = true;
      }
      if (!project) {
        setDisabled(false);
        setProjectError("Please Choose the Project");
        hasError = true;
      }
      if (!category) {
        setDisabled(false);
        setCategoryError("Please Choose the Category");
        hasError = true;
      }
      if (!draft) {
        if (title === "" || title.length < 3) {
          setDisabled(false);
          setTitleError("Enter title, must contain 3 characters atleast");
          hasError = true;
        }

        if (editorValue === "") {
          setDisabled(false);
          setContentError("Please Enter Description");
          hasError = true;
        }
      }
    }

    if (hasError) {
      setDisabled(false);
      return;
    } else {
      let postStatus = approveReview ? 1 : 2;
      let status = draft ? 4 : postStatus;
      if (type === "4") {
        let details = {
          Id: null,
          type: type,
          title: title,
          clientId: clients,
          sourceId: source,
          sourceTitle: sourceTitle.value,
          description: editorValue,
          articalby: logUserId,
          projectid: null,
          categoryid: category,
          statusid: status,
          UserId: logUserId,
          revenue: revenueval,
          revenueClient: revenueClient,
          revenueInternal: revenueInternal,
          cost: costval,
          costClient: costClient,
          costInternal: costInternal,
          personDays: personDays,
          Keywords: Keyword,
          viewstatus: 1,
        };
        const eventResponse = apiClient
          .post("/vxarticle/add", details)
          .then((response) => {
            if (response.data[0].Id) {
              setTimeout(() => {
                let serverPath = process.env.REACT_APP_API_URL;
                if (image.length > 0) {
                  let err = 0;
                  let cnt = image.length - 1;
                  image.forEach((row, key) => {
                    let formData = new FormData();
                    formData.append("image", row);
                    formData.append("id", null);
                    formData.append("articleId", response.data[0].Id);
                    formData.append("userId", logUserId);
                    axios
                      .post(serverPath + "/kmarticle/attachment", formData)
                      .then(() => {
                        if (cnt === key) {
                          if (err) {
                            Alert("warn", "Article Save but Image not upload");
                            setDisabled(false);
                            navigate(Routes.NewArticles);
                            if (details.statusid === 1) {
                              getArticles();
                            }
                          } else {
                            const successMessage = approveReview
                              ? "Artifacts Published"
                              : "Artifacts sent for Approval";
                            if (details.statusid === 1) {
                              getArticles();
                            }
                            if (!draft) {
                              Alert("succ", successMessage);
                            } else {
                              Alert("succ", "Draft Saved");
                            }
                            let ElasticPath = process.env.REACT_APP_ELASTIC_URL;
                            axios
                              .get(ElasticPath)
                              .then((elasticResponse) => {
                                console.log(
                                  "Elastic API Request successful: ",
                                  elasticResponse
                                );
                              })
                              .catch((elasticError) => {
                                console.error(
                                  "Elastic API Error occurred: ",
                                  elasticError
                                );
                              });
                            setDisabled(false);
                            if (approveReview) {
                              // isAdmin is true, add 75 reward points
                              // addRewardPoints(75, logUserId);
                              addRewardPoints(
                                rewardsData[3].Points,
                                logUserId,
                                rewardsData[3].Id,
                                logUserId,
                              );
                            }
                          }
                        }
                        // addRewardPoints(25, logUserId);
                      })
                      .catch(() => {
                        err++;
                      });
                  });
                } else {
                  let ElasticPath = process.env.REACT_APP_ELASTIC_URL;
                  axios
                    .get(ElasticPath)
                    .then((elasticResponse) => {
                      console.log("Elastic API Request successful: ", elasticResponse);
                    })
                    .catch((elasticError) => {
                      console.error("Elastic API Error occurred: ", elasticError);
                    });
                  setDisabled(false);
                  postRender();
                  if (!draft) {
                    if (approveReview) {
                      // addRewardPoints(100, logUserId);
                      addRewardPoints(
                        rewardsData[2].Points,
                        logUserId,
                        rewardsData[2].Id,
                        logUserId,
                      );
                      addRewardPoints(
                        rewardsData[3].Points,
                        logUserId,
                        rewardsData[3].Id,
                        logUserId,
                      );
                      Alert("succ", "Artifact Published");
                      getArticles();
                    } else {
                      // addRewardPoints(25, logUserId);
                      addRewardPoints(
                        rewardsData[2].Points,
                        logUserId,
                        rewardsData[2].Id,
                        logUserId,
                      );
                      Alert("succ", "Artifact sent for Approval");
                    }
                  } else {
                    Alert("succ", "Draft Saved");
                  }
                }
                setShowDefault(false);
                clearFields();
              }, 2000);
              // addRewardPoints(25, logUserId);
              addRewardPoints(
                rewardsData[2].Points,
                logUserId,
                rewardsData[2].Id,
                logUserId,
              );
            }
          })
          .catch((error) => {
            setDisabled(false);
            Alert("error", "Please Try Again");
          });
      } else {
        let details = {
          Id: null,
          type: type,
          title: title,
          description: editorValue,
          articalby: logUserId,
          projectid: project,
          categoryid: category,
          statusid: status,
          UserId: logUserId,
          Keywords: Keyword,
          viewstatus: 1,
        };
        apiClient
          .post("/kmarticle/add", details)
          .then((response) => {
            if (response.data[0].Id) {
              setTimeout(() => {
                let serverPath = process.env.REACT_APP_API_URL;
                if (image.length > 0) {
                  let err = 0;
                  let cnt = image.length - 1;
                  image.forEach((row, key) => {
                    let formData = new FormData();
                    formData.append("image", row);
                    formData.append("id", null);
                    formData.append("articleId", response.data[0].Id);
                    formData.append("userId", logUserId);
                    axios
                      .post(serverPath + "/kmarticle/attachment", formData)
                      .then(() => {
                        if (cnt === key) {
                          if (err) {
                            Alert("warn", "Article Save but Image not upload");
                            setDisabled(false);
                            navigate(Routes.NewArticles);
                          } else {
                            const successMessage = approveReview
                              ? "Artifacts Published"
                              : "Artifacts sent for Approval";
                            if (details.statusid === 1) {
                              getArticles();
                            }
                            if (!draft) {
                              Alert("succ", successMessage);
                            } else {
                              Alert("succ", "Draft Saved");
                            }

                            let ElasticPath = process.env.REACT_APP_ELASTIC_URL;
                            axios
                              .get(ElasticPath)
                              .then((elasticResponse) => {
                                console.log(
                                  "Elastic API Request successful: ",
                                  elasticResponse
                                );
                              })
                              .catch((elasticError) => {
                                console.error(
                                  "Elastic API Error occurred: ",
                                  elasticError
                                );
                              });

                            setDisabled(false);
                            if (approveReview) {
                              // addRewardPoints(75, logUserId);
                              addRewardPoints(
                                rewardsData[3].Points,
                                logUserId,
                                rewardsData[3].Id,
                                logUserId,
                              );
                            }
                          }
                        }
                        // addRewardPoints(25, logUserId);
                      })
                      .catch(() => {
                        err++;
                      });
                  });
                } else {
                  let ElasticPath = process.env.REACT_APP_ELASTIC_URL;
                  axios
                    .get(ElasticPath)
                    .then((elasticResponse) => {
                      console.log("Elastic API Request successful: ", elasticResponse);
                    })
                    .catch((elasticError) => {
                      console.error("Elastic API Error occurred: ", elasticError);
                    });
                  setDisabled(false);
                  postRender();
                  if (!draft) {
                    if (approveReview) {
                      // addRewardPoints(100, logUserId);
                      addRewardPoints(
                        rewardsData[2].Points,
                        logUserId,
                        rewardsData[2].Id,
                        logUserId,
                      );
                      addRewardPoints(
                        rewardsData[3].Points,
                        logUserId,
                        rewardsData[3].Id,
                        logUserId,
                      );
                      Alert("succ", "Artifact Published");
                      getArticles();
                    } else {
                      // addRewardPoints(25, logUserId);
                      // addRewardPoints(
                      //   rewardsData[2].Points,
                      //   logUserId,
                      //   rewardsData[2].Id,
                      //   logUserId,
                      // );
                      Alert("succ", "Artifact sent for Approval");
                    }
                  } else {
                    Alert("succ", "Draft Saved");
                  }
                }
                setShowDefault(false);
                clearFields();
              }, 2000);
              // addRewardPoints(25, logUserId);
              addRewardPoints(
                rewardsData[2].Points,
                logUserId,
                rewardsData[2].Id,
                logUserId,
              );
            }
          })
          .catch((error) => {
            setDisabled(false);
            Alert("error", "Please Try Again");
          });
      }
    }
  };

  useEffect(() => {
    isLoading = true;
    apiClient
      .get("/lookup/ArticalCategory/1")
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let carr = [];
        if (response.data.lookup.length > 0) {
          response.data.lookup.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
            carr.push({ value: element.Id, label: element.Name });
          });
        }
        setCategoryList(arr);
        setPostCategoryList(carr);
      })
      .catch(() => {
        Alert("error", "Please Try Again");
      });

    apiClient
      .post("project/searchall", {})
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let parr = [];
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name });
            parr.push({ value: element.id, label: element.Name });
          });
        }
        setProjectList(arr);
        setPostProjectList(parr);
      })
      .catch(() => {});

    apiClient
      .post("/client/search", {
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        userId: "0",
      })
      .then((response) => {
        let arr = [{ value: null, label: "All" }];
        let parr = [];
        if (response.data.client.length > 0) {
          response.data.client.forEach((element) => {
            arr.push({ value: element.Id, label: element.Name });
            parr.push({ value: element.Id, label: element.Name });
          });
        }
        setClientList(arr);
        setPostClientList(parr);
      })
      .catch((error) => {
        Alert("error", "Please Try Again");
      });
  }, []);

  const removeFile = (i) => {
    let sno = 0;
    let resarr = [];
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row;
    });
    setImage(resarr);
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

  const [source, setSource] = useState();

  const autofill = () => {
    if (source) {
      apiClient
        .get("/vxarticle/get_source_title/" + source)
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
          setDisabled(false);
          Alert("error", "Please Try Again");
        });
    }
  };

  const [sourceTitle, setSourceTitle] = useState();
  const [revenueError, setRevenueError] = useState("");
  const [revenueClientError, setRevenueClientError] = useState("");
  const [revenueInternalError, setRevenueInternalError] = useState("");
  const [costError, setCostError] = useState("");
  const [costClientError, setCostClientError] = useState("");
  const [costInternalError, setCostInternalError] = useState("");
  const [personDaysError, setPersonDaysError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [sourceTitleError, setSourceTitleError] = useState("");
  const [sourceTitleSugg, setSourceTitleSugg] = useState([]);
  const [revenue, setRevenue] = useState();
  const [cost, setCost] = useState();
  const [revenueClient, setRevenueClient] = useState("");
  const [revenueInternal, setRevenueInternal] = useState("");
  const [costClient, setCostClient] = useState("");
  const [costInternal, setCostInternal] = useState("");
  const [personDays, setPersonDays] = useState("");

  const [postClientList, setPostClientList] = useState([]);

  useEffect(() => {
    autofill();
  }, [source]);

  const clearFields = () => {
    setType("");
    setClients("");
    setCategory("");
    setSource("");
    setSourceTitle("");
    setTitle("");
    setContent("");
    setRevenue(true);
    setRevenueClient("");
    setRevenueInternal("");
    setCost(true);
    setCostClient("");
    setCostInternal("");
    setPersonDays("");
    setImage([]);
    setProject("");
    setEditorValue("");
    setKeywords("");

    setTypeError("");
    setClientError("");
    setCategoryError("");
    setSourceError("");
    setSourceTitleError("");
    setTitleError("");
    setContentError("");
    setRevenueError("");
    setRevenueClientError("");
    setRevenueInternalError("");
    setCostError("");
    setCostClientError("");
    setCostInternalError("");
    setPersonDaysError("");
    setProjectError("");
    setKeywordserror("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault;
      postArticle();
    }
  };
  return (
    <>
      <div className="md:w-auto w-full col-span-2">
        {design ? (
          <>
            <button
              className="maincontent__btn maincontent__btn--primarygreen bg-[#e0e0e0] w-full"
              onClick={() => setShowDefault(true)}
            >
              <FontAwesomeIcon className="mr-2" icon={faPenToSquare} />
              Post Artifact
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowDefault(true)}
              type="button"
              className="articles__search--btn articles__search--postbtn"
              style={{ color: "white", backgroundColor: "#441391" }}
            >
              <FontAwesomeIcon className="mr-2" icon={faPenToSquare} />
              Post Artifact
            </button>
          </>
        )}
      </div>
      <Modal
        as={Modal.Dialog}
        centered
        show={showDefault}
        onHide={handleClose}
        backdrop="static"
      >
        <div className="maincontent__postarticle py-0 px-0 ck-body-wrapper">
          <div className="bg-[#d0d2d9] rounded-[20px] p-2"
          >
            <FontAwesomeIcon
              icon={faClose}
              onClick={handleClose}
              style={{ borderRadius: "20px", backgroundColor: "#03022a" }}
              className="cursor-pointer closeIcon"
            />
            <p className="font-semibold text-black text-[17px]">Post</p>
          </div>
          {isdisabled ? (
            <>
              <div align="center">
                <div className="circle__loader"></div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-3 pt-2 pb-0 px-4">
                <div className="flex flex-col flex-1 gap-2">
                  <p>Type</p>
                  <Select
                    options={[
                      { value: "1", label: "Articles" },
                      { value: "2", label: "Case Study" },
                      { value: "3", label: "Knowledge Management" },
                      // { value: "4", label: "Value Xperience" },
                      { value: "5", label: "Customer Accolades" },
                    ]}
                    placeholder=""
                    onChange={(selectedOption) => {
                      setType(selectedOption.value);
                      setTypeError("");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {typeError && <p className="error-message">{typeError}</p>}
                </div>

                {type !== "4" ? (
                  <>
                    <div className="flex flex-col flex-1 gap-2">
                      <p>Project</p>
                      <Select
                        options={postProjectList.map((project) => ({
                          value: project.value,
                          label: project.label,
                        }))}
                        placeholder=""
                        onChange={(selectedOption) => {
                          setProject(selectedOption.value);
                          setProjectError("");
                        }}
                        onKeyDown={handleKeyDown}
                      />
                      {projectError && (
                        <p className="error-message">{projectError}</p>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <p>Category</p>
                      <Select
                        options={postcategoryList.map((category) => ({
                          value: category.value,
                          label: category.label,
                        }))}
                        placeholder=""
                        onChange={(selectedOption) => {
                          setCategory(selectedOption.value);
                          setCategoryError("");
                        }}
                        onKeyDown={handleKeyDown}
                      />
                      {categoryError && (
                        <p className="error-message">{categoryError}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col flex-1 gap-2">
                      <p>Client</p>
                      <Select
                        options={postClientList.map((client) => ({
                          value: client.value,
                          label: client.label,
                        }))}
                        placeholder=""
                        onChange={(selectedOption) => {
                          setClients(selectedOption.value);
                          setClientError("");
                        }}
                      />
                      {clientError && (
                        <p className="error-message">{clientError}</p>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <p>Category</p>
                      <Select
                        options={postcategoryList.map((category) => ({
                          value: category.value,
                          label: category.label,
                        }))}
                        placeholder=""
                        onChange={(selectedOption) => {
                          setCategory(selectedOption.value);
                          setCategoryError("");
                        }}
                      />
                      {categoryError && (
                        <p className="error-message">{categoryError}</p>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-2 md:col-span-1">
                      <p>Source</p>
                      <Select
                        options={postcategoryList.map((source) => ({
                          value: source.value,
                          label: source.label,
                        }))}
                        placeholder=""
                        onChange={(selectedOption) => {
                          setSource(selectedOption.value);
                          setSourceError("");
                          setSourceTitle({ value: "", label: "" });
                          autofill();
                        }}
                      />
                      {sourceError && (
                        <p className="error-message">{sourceError}</p>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-2 md:col-span-2">
                      <p>Source Title</p>
                      <Select
                        placeholder=""
                        options={sourceTitleSugg}
                        value={sourceTitle}
                        onChange={(e) => {
                          setSourceTitle(e);
                          setSourceTitleError("");
                        }}
                      />
                      {sourceTitleError && (
                        <p className="error-message">{sourceTitleError}</p>
                      )}
                    </div>
                  </>
                )} 

                <div className="flex flex-col flex-1 gap-2 md:col-span-3">
                  <p>{type === "4" ? "Value Exp" : "Title"}</p>
                  <input
                    type="text"
                    placeholder="Title"
                    className="maincontent__postarticle--input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleError("");
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {titleError && <p className="error-message">{titleError}</p>}
                </div>
                <div className="flex flex-col flex-1 col-span-3 gap-2 z-0">
                  <p>{type === "4" ? "Bus Case Exp" : "Description"}</p>

                  <MyEditor
                    data={editorValue}
                    setState={setEditorValue}
                    clearDescErr={handleEditorChange}
                  />

                  {contentError && (
                    <p className="error-message">{contentError}</p>
                  )}
                </div>

                 {type === "4" ? (
                  <>
                    <div className="flex flex-1 gap-4 md:col-span-3">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="flex items-center gap-2 col-span-1">
                          <p>Revenue</p>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input cursor-pointer"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              value={revenue}
                              onChange={() => {
                                setRevenue(!revenue);
                              }}
                              checked={revenue ? 0 : 1}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 items-center col-span-2">
                          <p>Client</p>
                          <input
                            type="text"
                            className="maincontent__postarticle--input w-9/12"
                            value={revenueClient.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                            placeholder="$ 0.00"
                            onChange={(e) => {
                              const inputText = e.target.value;
                              if (regex.test(inputText)) {
                                setRevenueClient(inputText);
                                setRevenueClientError("");
                              }
                            }}
                          />
                          {revenueClientError && (
                            <p className="error-message">
                              {revenueClientError}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 items-center col-span-2">
                          <p>Internal</p>
                          <input
                            type="text"
                            className="maincontent__postarticle--input w-9/12"
                            value={revenueInternal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                            placeholder="$ 0.00"
                            onChange={(e) => {
                              const inputText = e.target.value;
                              if (regex.test(inputText)) {
                                setRevenueInternal(inputText);
                                setRevenueInternalError("");
                              }
                            }}
                          />
                          {revenueInternalError && (
                            <p className="error-message">
                              {revenueInternalError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 gap-4 md:col-span-3">
                      <div className="grid grid-cols-5 gap-2">
                        <div className="flex gap-2 items-center col-span-1">
                          <p>Cost</p>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input cursor-pointer"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                              value={cost}
                              onChange={() => {
                                setCost(!cost);
                              }}
                              checked={cost ? 0 : 1}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 items-center col-span-2">
                          <p>Client</p>
                          <input
                            type="text"
                            className="maincontent__postarticle--input w-9/12"
                            value={costClient.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                            placeholder="$ 0.00"
                            onChange={(e) => {
                              const inputText = e.target.value;
                              if (regex.test(inputText)) {
                                setCostClient(inputText);
                                setCostClientError("");
                              }
                            }}
                          /> 
                           {costClientError && (
                            <p className="error-message">{costClientError}</p>
                          )}
                        </div>
                        <div className="flex gap-2 items-center col-span-2">
                          <p>Internal</p>
                          <input
                            type="text"
                            className="maincontent__postarticle--input w-9/12"
                            value={costInternal.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                            placeholder="$ 0.00"
                            onChange={(e) => {
                              const inputText = e.target.value;
                              if (regex.test(inputText)) {
                                setCostInternal(inputText);
                                setCostInternalError("");
                              }
                            }}
                          />
                          {costInternalError && (
                            <p className="error-message">{costInternalError}</p>
                          )}
                        </div>
                      </div>
                    </div> 
                     <div className="flex flex-1 gap-4 items-center md:col-span-3">
                      <p>Person Days</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input"
                        value={personDays}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (/^\d*$/.test(inputText)) {
                            setPersonDays(inputText);
                            setPersonDaysError("");
                          }
                        }}
                      />
                      {personDaysError && (
                        <p className="error-message">{personDaysError}</p>
                      )}
                    </div>
                  </>
                ) : null} 

                <div className="flex flex-col flex-1 col-span-3 gap-2">
                  <p>Keywords</p>
                  <textarea
                    placeholder="Write a Caption"
                    className="maincontent__postarticle--input clrBlue"
                    value={Keyword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4 items-center w-full p-4">
                <ImgIcon
                  image={image}
                  setImage={setImage}
                  removedFileName={removedFileName}
                  className="maincontent__postarticle--attachicon"
                />
                <div className="flex gap-4">
                  <button
                    className="mt-4 maincontent__btn articles__search--postbtn w-fit md:m-0 draftsBtn font-semibold text-[15px]"
                    onClick={() => postArticle(true)}
                  >
                    Draft
                  </button>

                  {type === "4" ? (
                    <>
                      <div className="flex flex-1 justifyEnd">
                        {design ? (
                          <button
                            type="button"
                            disabled={isdisabled}
                            className="articles__search--btn articles__search--postbtn font-semibold text-[15px]"
                            onClick={() => postArticle()}
                            style={{ backgroundColor: "#441391" }}
                          >
                            {" "}
                            Post Artifact{" "}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isdisabled}
                            className="articles__search--btn articles__search--postbtn font-semibold text-[15px]"
                            onClick={() => postArticle()}
                            style={{
                              backgroundColor: "#441391",
                              color: "white",
                            }}
                          >
                            {" "}
                            Post Artifact{" "}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {design ? (
                        <button
                          type="button"
                          disabled={isdisabled}
                          className="articles__search--btn articles__search--postbtn font-semibold text-[15px]"
                          onClick={() => postArticle()}
                          style={{ backgroundColor: "#441391" }}
                        >
                          {" "}
                          Post Artifact{" "}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isdisabled}
                          className="articles__search--btn articles__search--postbtn font-semibold text-[15px]"
                          onClick={() => postArticle()}
                          style={{ backgroundColor: "#441391", color: "white" }}
                        >
                          {" "}
                          Post Artifact{" "}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-4">
                {image &&
                  image?.map((attachment, i) => (
                    <>
                      <div className="d-flex" key={i}>
                        <ul className="list-disc">
                          <li>
                            <span>
                              {attachment.name}
                              <FontAwesomeIcon
                                onClick={() => removeFile(i)}
                                icon={faTrashAlt}
                                style={{
                                  marginLeft: "15px",
                                  cursor: "pointer",
                                  color: "red",
                                }}
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                    </>
                  ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  approveReview: state.approveReview,
  rewardsData: state.rewards,
});

export default connect(mapStateToProps)(PostArtifact);
