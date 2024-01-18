import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../components/Alert";
import axios from "axios";
import { Col, Row, Card } from "@themesberg/react-bootstrap";
import ImgIcon from "../../components/ImageIcon";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../common/http-common";
import { Routes } from "../../routes";
import Swal from "sweetalert2";
const VxArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const [type, setType] = useState();
  const [project, setProject] = useState();
  const [category, setCategory] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);
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
  const [article, setArticle] = useState({
    title: "",
    AuthorName: "",
    CategoryName: "",
    Description: "",
    type: "",
    ProjectName: "",
  });

  useEffect(() => {
    //for category dropdown
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

  const UpdateArtical = (e) => {
    e.preventDefault();
    let statusId = 2;

    if (validDescTitle(content) && validationTitle(title)) {
      if (logUserId === 1) {
        statusId = 1;
      }

      apiClient
        .post("/kmarticle/add", {
          Id: "",
          type: selectVal.type.value,
          title: title,
          description: content,
          articalby: "",
          projectid: selectVal.project.value,
          categoryid: selectVal.category.value,
          statusid: statusId,
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
              formData.append("articleId", "");
              formData.append("userId", 1);
              axios
                .post(serverPath + "/kmarticle/attachment", formData)
                .then(() => {
                  if (cnt === key) {
                    if (err) {
                      Alert("warn", "Article Update but Image not upload");
                      setdisabled(false);
                    } else {
                      Alert("succ", "Save successfully");
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
            Alert("succ", "Save successfully");
            navigate(Routes.MyArticle, {
              state: { selectedProject: project, selectedCategory: category },
            });
          }
        })
        .catch(() => {
          Alert("err", "please try again!");
        });
    }
  };

  function validDescTitle(val) {
    if (val && val.length > 20) {
      setValidDescpVal("");
      return true;
    } else if (!val) {
      setValidDescpVal("Please Fill Description");
      return false;
    } else {
      setValidDescpVal("Please Enter Atleast 20 Characters");
      return false;
    }
  }

  function validationTitle(val) {
    if (val && val.length > 3) {
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
        <div className="maincontent__breadcrumb">
          <img
            className="cursor_pointer"
            src={HomeOutlineIcon}
            alt="home"
            onClick={() => {
              navigate(Routes.KMDashboard);
            }}
          />
          <span className="maincontent__breadcrumb--divider">/</span>
          <span className="maincontent__breadcrumb--active">VX Article</span>
        </div>
        <div className="mt-4 maincontent__card">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">Add VX ARTICLE</h2>
          </div>
          <div className="maincontent__card--content">
            <form onSubmit={UpdateArtical}>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col flex-1 gap-2">
                  <p>Type</p>
                  <Select
                    options={[
                      { value: 1, label: "Article" },
                      { value: 2, label: "Case Study" },
                      { value: 3, label: "Knowledge Management" },
                    ]}
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
                <div className="flex flex-col flex-1 col-span-4 gap-2">
                  <p>Description</p>
                  <textarea
                    rows="10"
                    type="text"
                    placeholder="Type here.."
                    className="maincontent__postarticle--input"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      validDescTitle(e.target.value);
                    }}
                  />
                </div>
              </div>
              {validDescpVal && (
                <div className="flex flex-col flex-1 col-span-4 gap-2">
                  <span className="errorsignin position-absolute">
                    <p>{validDescpVal}</p>
                  </span>
                </div>
              )}
              <div className="flex justify-between w-full mt-4">
                <div className="flex items-center flex-1 gap-2">
                  <p>Attach</p>
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
                  attachmentList?.map((attachment, i) => (
                    <>
                      <div className="d-flex" key={i}>
                        <ul class="list-disc">
                          <li>
                            <a
                              target="_blank"
                              href={serverImgPath + attachment.FilePath}
                            >
                              {attachment.FilePath}
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
                          </li>
                        </ul>
                      </div>
                    </>
                  ))}
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
              <div className="flex justify-end gap-4">
                <button
                  disabled={isdisabled}
                  type="submit"
                  className="maincontent__btn maincontent__btn--primaryblue"
                >
                  Save
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

export default VxArticles;
