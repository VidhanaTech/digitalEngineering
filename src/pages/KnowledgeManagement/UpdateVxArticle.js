import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../components/Alert";
import axios from "axios";
import ImgIcon from "../../components/ImageIcon";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../common/http-common";
import { Routes } from "../../routes";
import Swal from "sweetalert2";
import { isImageAttachment } from "../../common/Helper";
import { connect } from "react-redux";
import MyEditor from "../components/MyCkEditor";
import parse from "html-react-parser";

const UpdateVxArticle = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState();
  const [category, setCategory] = useState();
  const [clientError, setClientError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [logUserId] = useState(state.user.Id);
  const [selectVal, setSelectVal] = useState({
    type: "",
    project: "",
    source: "",
  });

  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  const [categoryList, setCategoryList] = useState([]);
  const [clientList, setClienttList] = useState([]);
  const [validTitleVal, setValidTtitleVal] = useState("");
  const [validDescpVal, setValidDescpVal] = useState("");
  const [attachmentList, setAttachmentList] = useState([]);
  const [isdisabled, setDisabled] = useState(false);
  const [Keyword, setKeywords] = useState("");
  const [statusId, SetStatusId] = useState("");
  const [article, setArticle] = useState({
    title: "",
    AuthorName: "",
    CategoryName: "",
    Description: "",
    type: "",
    ProjectName: "",
    Keywords: "",
    viewStatus: "",
  });
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
  let [clientSelect, setClientSelect] = useState({});
  let [sourceSelect, setSourceSelect] = useState({});
  const [typeError, setTypeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [viewStatus, setViewStatus] = useState(1);
  const [categoryselect, setCategoryselect] = useState({});
  const [editorValue, setEditorValue] = useState("");

  const handleEditorChange = () => {
    if (editorValue == "") {
      setContentError("Please Enter Business Case");
    } else {
      setContentError("");
    }
  };

  useEffect(() => {
    if (content) {
      setEditorValue(content);
      setContentError("");
    } else {
      setContentError("Please Enter Business Case");
    }
  }, [content]);

  useEffect(() => {
    apiClient
      .post("/vxarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        const resdata = res.data[0];
        autofill(resdata.SourceId);
        setArticle(resdata);
        setTitle(resdata.title);
        setContent(parse(resdata.Description));
        SetStatusId(resdata.StatusId);

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
        setViewStatus(resdata.ViewStatus);
        setAttachmentList(resdata.FilePath);
        setKeywords(resdata.KeyWords);
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
  const UpdateVXArtical = (e, draft = false) => {
    e.preventDefault();
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
    let revenueval = "";
    let costval = "";
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
    let hasError = false;

    if (!type) {
      setDisabled(false);
      setTypeError("Please Choose the Type");
      hasError = true;
    }

    if (clientSelect?.hasOwnProperty("value")) {
      if (!clientSelect.value) {
        setDisabled(false);
        setClientError("Please Choose the Client");
        hasError = true;
      }
    } else {
      setDisabled(false);
      setClientError("Please Choose the Client");
      hasError = true;
    }

    if (categoryselect?.hasOwnProperty("value")) {
      if (!categoryselect.value) {
        setDisabled(false);
        setCategoryError("Please Choose the Category");
        hasError = true;
      }
    } else {
      setDisabled(false);
      setCategoryError("Please Choose the Category");
      hasError = true;
    }
    if (sourceSelect?.hasOwnProperty("value")) {
      if (!sourceSelect.value) {
        setDisabled(false);
        setSourceError("Please Choose the Source");
        hasError = true;
      }
    } else {
      setDisabled(false);
      setSourceError("Please Choose the Source");
      hasError = true;
    }

    if (sourceTitle?.hasOwnProperty("value")) {
      if (!sourceTitle.value) {
        setDisabled(false);
        setSourceTitleError("Please Enter Source Title");
        hasError = true;
      }
    } else {
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
      if (content === "") {
        setDisabled(false);
        setContentError("Please Enter Business Case");
        hasError = true;
      }
    }
    if (hasError) {
      setDisabled(false);
      return;
    } else {
      let postStatus = state.approveReview ? 1 : 2;
      let statusId = draft ? 4 : postStatus;
      let details = {
        Id: location.state.user.Id,
        type: location.state.user.type,
        title: title,
        clientId: clientSelect.value,
        sourceId: sourceSelect.value,
        sourceTitle: sourceTitle.value,
        description: content,
        articalby: articleby,
        projectid: null,
        categoryid: categoryselect.value,
        statusid: statusId,
        UserId: logUserId,
        revenue: revenueval,
        revenueClient: revenueClient,
        revenueInternal: revenueInternal,
        cost: costval,
        costClient: costClient,
        costInternal: costInternal,
        viewstatus: viewStatus,
        Keywords: Keyword,
        personDays: personDays,
      };
      apiClient
        .post("/vxarticle/add", details)
        .then((res) => {
          if (image.length > 0) {
            let err = 0;
            let cnt = image.length - 1;
            let serverPath = process.env.REACT_APP_API_URL;
            image.forEach((row, key) => {
              let formData = new FormData();
              formData.append("image", row);
              formData.append("id", null);
              formData.append("articleId", location.state.user.Id);
              formData.append("userId", 1);
              axios
                .post(serverPath + "/kmarticle/attachment", formData)
                .then(() => {
                  if (cnt === key) {
                    if (err) {
                      Alert("warn", "Article Update but Image not upload");
                      setdisabled(false);
                    } else {
                      if (!draft) {
                        Alert("succ", "Save successfully");
                      } else {
                        Alert("succ", "Draft Saved");
                      }
                    }
                  }
                })
                .catch(() => {
                  err++;
                });
            });
          } else {
            if (!draft) {
              Alert("succ", "Submitted successfully");
            } else {
              Alert("succ", "Draft Saved");
            }
            navigate(Routes.MyArticle);
          }
          let ElasticPath = process.env.REACT_APP_ELASTIC_URL;
          axios
            .get(ElasticPath)
            .then((response) => {
              console.log("Request successful elastic: ", response);
            })
            .catch((error) => {
              console.error("Error occurred: ", error);
            });
        })
        .catch(() => {
          Alert("err", "please try again!");
        });
    }
  };

  const removeFile = (i) => {
    let sno = 0;
    let resarr = [];
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row;
    });
    setImage(resarr);
  };

  const deleteAttachment = (id, i) => {
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
        apiClient.delete(`/kmarticle/attachment/delete/${id}`).then((res) => {
          if (res.data.error) {
            Alert("error", res.data.error);
          } else {
            let sno = 0;
            let resarr = [];
            attachmentList.map((row, key) => {
              if (i !== key) resarr[sno++] = row;
            });
            setAttachmentList(resarr);
          }
        });
      }
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
            <span
              className="cursor_pointer"
              onClick={() => {
                navigate(Routes.MyArticle);
              }}
            >
              My Article
            </span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">
              Edit Article
            </span>
          </div>
        )}

        <div className="mt-4 maincontent__card">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">EDIT ARTICLE</h2>
          </div>
          <div className="maincontent__card--content">
            <form onSubmit={(e) => UpdateVXArtical(e, false)}>
              <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
                <div className="flex flex-col flex-1 gap-2">
                  <p>Type</p>
                  <Select
                    options={[
                      { value: 1, label: "Article" },
                      { value: 2, label: "Case Study" },
                      { value: 3, label: "Knowledge Management" },
                      { value: 4, label: "Value Xperience" },
                      { value: 5, label: "Customer Accolades" },
                    ]}
                    isDisabled={true}
                    placeholder="Select Type"
                    value={selectVal.type}
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, type: e });
                    }}
                  />
                  {typeError && <p className="error-message">{typeError}</p>}
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <p>Client</p>
                  <Select
                    options={clientList}
                    placeholder="Select Client"
                    value={clientSelect}
                    onChange={(e) => {
                      setClientSelect(e);
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
                    options={categoryList}
                    placeholder="Select Category"
                    value={categoryselect}
                    onChange={(e) => {
                      setCategoryselect(e);
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
                    options={categoryList.map((source) => ({
                      value: source.value,
                      label: source.label,
                    }))}
                    value={sourceSelect}
                    placeholder=""
                    onChange={(e) => {
                      setSourceSelect(e);
                      setSourceError("");
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
                <div className="flex flex-col flex-1 gap-2 md:col-span-3">
                  <p>Value Experience</p>
                  <input
                    type="text"
                    placeholder="Soft Skills that helped in Customer Retention"
                    className="maincontent__postarticle--input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleError("");
                    }}
                  />
                  {titleError && <p className="error-message">{titleError}</p>}
                </div>
                <div className="flex flex-col flex-1 col-span-3 gap-2 z-0">
                  <p>Business Case</p>

                  <MyEditor
                    data={content}
                    setState={setContent}
                    clearDescErr={handleEditorChange}
                  />
                  {contentError && (
                    <p className="error-message">{contentError}</p>
                  )}
                </div>
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
                        value={revenueClient}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (regex.test(inputText)) {
                            setRevenueClient(inputText);
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2 items-center col-span-2">
                      <p>Internal</p>
                      <input
                        type="text"
                        className="maincontent__postarticle--input w-9/12"
                        value={revenueInternal}
                        onChange={(e) => {
                          const inputText = e.target.value;
                          if (regex.test(inputText)) {
                            setRevenueInternal(inputText);
                          }
                        }}
                      />
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
                        value={costClient}
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
                        value={costInternal}
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
                <div className="flex flex-col flex-1 col-span-3 gap-2 ">
                  <p>Keywords</p>
                  <textarea
                    placeholder="Write a Caption"
                    className="maincontent__postarticle--input clrBlue"
                    value={Keyword}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="flex flex-1 gap-4 md:col-span-3">
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
                </div> */}
                <div className="flex flex-1 gap-4 md:col-span-3">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="flex items-center gap-2 col-span-1">
                      <ImgIcon
                        image={image}
                        setImage={setImage}
                        className="maincontent__postarticle--attachicon"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {attachmentList &&
                    attachmentList.map((attachment, i) => {
                      const attachmentName =
                        attachment.FilePath.split("/").pop();
                      const isImage = isImageAttachment(attachmentName);
                      return (
                        <div className="d-flex m-2" key={i}>
                          <a
                            href={serverImgPath + attachment.FilePath}
                            download={true} // Add the 'download' attribute
                            // target="_blank"
                          >
                            {isImage ? (
                              <img
                                className="max-h-64 inline-flex w-80 object-contain"
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
                          <FontAwesomeIcon
                            onClick={() => deleteAttachment(attachment.Id, i)}
                            icon={faTrashAlt}
                            style={{
                              marginLeft: "15px",
                              cursor: "pointer",
                              color: "red",
                            }}
                          />
                        </div>
                      );
                    })}
                  {image &&
                    image?.map((attachment, i) => (
                      <>
                        <div className="d-flex" key={i}>
                          <ul class="list-disc">
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
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="mt-4 maincontent__btn articles__search--postbtn w-fit md:m-0 draftsBtn"
                  onClick={(e) => UpdateVXArtical(e, true)}
                >
                  Draft
                </button>

                <button
                  disabled={isdisabled}
                  type="submit"
                  className="maincontent__btn maincontent__btn--primaryblue"
                >
                  {statusId === 4 ? "Submit" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate(Routes.MyArticle);
                  }}
                  className="maincontent__btn maincontent__btn--primaryblue"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(UpdateVxArticle);
