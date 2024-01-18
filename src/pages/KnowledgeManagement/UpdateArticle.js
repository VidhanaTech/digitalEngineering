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
import parse from "html-react-parser";
import MyEditor from "../components/MyCkEditor";

const UpdateArticle = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const navigate = useNavigate();
  const location = useLocation();
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const [type, setType] = useState();
  const [project, setProject] = useState();
  const [category, setCategory] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [logUserId] = useState(state.user.Id);
  const [selectVal, setSelectVal] = useState({
    type: "",
    project: "",
    category: "",
  });
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  const [projectList, setProjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [validTitleVal, setValidTtitleVal] = useState("");
  const [validDescpVal, setValidDescpVal] = useState("");
  const [attachmentList, setAttachmentList] = useState([]);
  const [isdisabled, setdisabled] = useState(false);
  const [Keyword, setKeywords] = useState("");
  const [viewStatus, setViewStatus] = useState(1);
  const [statusId, setStatusId] = useState("");

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

  const [editorValue, setEditorValue] = useState("");
  const handleEditorChange = () => {
    const textContent = editorValue.replace(/<[^>]*>/g, "");
    if (textContent == "") {
      setValidDescpVal("Please Enter Description");
    } else {
      setValidDescpVal("");
    }
  };
  useEffect(() => {
    if (content) {
      setEditorValue(content);
      setValidDescpVal("");
    } else {
      setValidDescpVal("Please Enter Description");
    }
  }, [content]);

  useEffect(() => {
    apiClient
      .post("/kmarticle/article_getbyid", { id: location.state.user.Id })
      .then((res) => {
        let resdata = res.data[0];
        setArticle(resdata);
        setTitle(resdata.title);
        setContent(parse(resdata.Description));
        setKeywords(resdata.KeyWords);
        setViewStatus(resdata.ViewStatus);
        setStatusId(resdata.StatusId);
        let typen = "";
        if (resdata.type === 1) {
          typen = "Article";
          setType("Article");
        } else if (resdata.type === 2) {
          typen = "Case Study";
          setType("Case Study");
        } else if (resdata.type === 3) {
          typen = "Knowledge Management";
          setType("Knowledge Management");
        } else {
          typen = "Customer Accolades";
          setType("Customer Accolades");
        }
        selectVal.type = { value: resdata.type, label: typen };
        selectVal.project = {
          value: resdata.ProjectId,
          label: resdata.ProjectName,
        };
        selectVal.category = {
          value: resdata.CategoryId,
          label: resdata.CategoryName,
        };
        setSelectVal(selectVal);
        setProject(resdata.ProjectName);
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
      .post("project/searchall", {})
      .then((response) => {
        let arr = [];
        if (response.data.project.length > 0) {
          response.data.project.forEach((element) => {
            arr.push({ value: element.id, label: element.Name });
          });
        }
        setProjectList(arr);
      })
      .catch(() => {});
  }, []);
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

  const UpdateArtical = (e, draft = false) => {
    e.preventDefault();
    if (draft || (validDescTitle(content) && validationTitle(title))) {
      let postStatus = state.approveReview ? 1 : 2;
      let statusId = draft ? 4 : postStatus;
      apiClient
        .post("/kmarticle/add", {
          Id: location.state.user.Id,
          type: selectVal.type.value,
          title: title,
          description: content,
          articalby: location.state.user.ArticleBy,
          projectid: selectVal.project.value,
          categoryid: selectVal.category.value,
          statusid: statusId,
          Keywords: Keyword,
          viewstatus: viewStatus,
          UserId: logUserId,
        })
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
                        Alert("succ", "Submitted successfully");
                      } else {
                        Alert("succ", "Draft Saved");
                      }
                      navigate(Routes.MyArticle, {
                        state: {
                          selectedProject: project,
                          selectedCategory: category,
                        },
                      });
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
            navigate(Routes.MyArticle, {
              state: { selectedProject: project, selectedCategory: category },
            });
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

  function validDescTitle(val) {
    if (!val) {
      setValidDescpVal("Please Enter Description");
      return false;
    } else {
      setValidDescpVal("");
      return true;
    }
  }

  function validationTitle(val) {
    if (val && val.length > 2) {
      setValidTtitleVal("");
      return true;
    } else if (!val) {
      setValidTtitleVal("Please Fill Title");
      return false;
    } else {
      setValidTtitleVal("Please Enter Atleast 3 Characters");
      return false;
    }
  }
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
            <form onSubmit={(e) => UpdateArtical(e, false)}>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <p>Type</p>
                  <Select
                    options={[
                      { value: 1, label: "Article" },
                      { value: 2, label: "Case Study" },
                      { value: 3, label: "Knowledge Management" },
                      { value: 5, label: "Customer Accolades" },
                    ]}
                    isDisabled={true}
                    placeholder="Select Type"
                    value={selectVal.type}
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, type: e });
                    }}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <p>Project</p>
                  <Select
                    options={projectList}
                    placeholder="Select Project"
                    value={selectVal.project}
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, project: e });
                    }}
                  />
                </div>

                <div className="flex flex-col flex-1 gap-2">
                  <p>Category</p>
                  <Select
                    options={categoryList}
                    placeholder="Select Category"
                    value={selectVal.category}
                    onChange={(e) => {
                      setSelectVal({ ...selectVal, category: e });
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1 col-span-4 gap-2">
                  <p>Title</p>
                  <input
                    type="text"
                    placeholder="Soft Skills that helped in Customer Retention"
                    className="maincontent__postarticle--input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      validationTitle(e.target.value);
                    }}
                  />
                </div>
                {validTitleVal && (
                  <div className="flex flex-col flex-1 col-span-4 gap-2">
                    <span className="errorsignin position-absolute">
                      <p>{validTitleVal}</p>
                    </span>
                  </div>
                )}
                <div className="flex flex-col flex-1 col-span-4 gap-2 z-0">
                  <p>Description</p>

                  <MyEditor
                    data={content}
                    setState={setContent}
                    clearDescErr={handleEditorChange}
                  />
                  {validDescpVal && (
                    <div className="flex flex-col flex-1 col-span-4 gap-2">
                      <span className="errorsignin position-relative">
                        <p>{validDescpVal}</p>
                      </span>
                    </div>
                  )}
                </div>
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
              {/* <div className="mt-2">
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
                </div>
              </div> */}

              <div className="flex justify-between w-full mt-4">
                <div className="flex items-center flex-1 gap-2">
                  <div className="flex gap-2 ml05">
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
                    const attachmentName = attachment.FilePath.split("/").pop();
                    const isImage = isImageAttachment(attachmentName);
                    return (
                      <div className="d-flex m-2" key={i}>
                        <a
                          href={serverImgPath + attachment.FilePath}
                          download={true}
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
                  image.map((attachment, i) => (
                    <div className="d-flex" key={i}>
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
                    </div>
                  ))}
              </div>
              <div className="flex justify-end gap-4">
                <label
                  className="maincontent__btn articles__search--postbtn cursor-pointer"
                  onClick={(e) => UpdateArtical(e, true)}
                >
                  Draft
                </label>
                  {/* {statusId === 4 ? (
                    <button
                    disabled={isdisabled}
                    type="submit"
                    className="maincontent__btn maincontent__btn--primaryblue"
                  >
                    Submit
                  </button>
                  ): (
                <button
                  disabled={isdisabled}
                  type="submit"
                  className="maincontent__btn maincontent__btn--primaryblue"
                >
                  Save
                </button>
                  )} */}
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
export default connect(mapStateToProps)(UpdateArticle);
