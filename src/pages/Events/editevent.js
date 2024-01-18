import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import {
  yyyymmdd,
  isImageAttachment,
} from "../../common/Helper";
import { Routes } from "../../routes";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row, Form } from "@themesberg/react-bootstrap";
import {
  faCalendarAlt,
  faClock,
  faTrashAlt,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../common/http-common";
import axios from "axios";
import Swal from "sweetalert2";
import { Alert } from "../../components/Alert";
import ThumbIcon from "../../components/ThumbImg";
import parse from "html-react-parser";
import MyEditor from "../components/MyCkEditor";

const editevent = (state) => {
  const location = useLocation();
  const navigate = useNavigate();
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  const [logUserId] = useState(state.user.Id);
  const [eventname, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventendDate, setEventEndDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndTime] = useState();
  const [eventlocation, setEventLocation] = useState();
  const [speakername, setSpeakerName] = useState();
  const [eventdescription, setEventDescription] = useState("");
  const [image, setImage] = useState([]);
  const [bannerimage, setBannerImage] = useState([]);
  const [thumbImageList, setthumbImageList] = useState([]);
  const [banImageList, setBanImageList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editorData, setEditorData] = useState("");

  const removeFile = (i) => {
    let sno = 0;
    let resarr = [];
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row;
    });
    setImage(resarr);
  };

  const removeBannerFile = (i) => {
    let sbno = 0;
    let resbarr = [];
    bannerimage.map((row, key) => {
      if (i !== key) resbarr[sbno++] = row;
    });
    setBannerImage(resbarr);
  };

  const clearFieldError = (fieldName) => {
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  useEffect(() => {
    apiClient
      .get("/kmarticle/getEventById/" + location.state.user.Id)
      .then((res) => {
        const user = res.data[0];
        setEventName(user.Title);
        setEventDate(yyyymmdd(user.Start_Date));
        setEventEndDate(yyyymmdd(user.End_Date));
        setStarttime(user.Start_Time);
        setEndTime(user.End_Time);
        setSpeakerName(user.SpeakerName);
        setEventLocation(user.Location);
        setEventDescription(parse(user.Description));
        setthumbImageList(user.thumbImg);
        setBanImageList(user.bannerImg);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (eventdescription) {
      setEditorData(eventdescription);
    }
  }, [eventdescription]);

  const SaveAddEvent = async () => {
    setIsDisabled(true);

      const errors = {};
      if (!eventname) {
        errors.eventname = "Event Name is required";
      }
      if (!eventDate) {
        errors.eventDate = "Event Start Date is required";
      }
      if (!eventendDate) {
        errors.eventendDate = "Event End Date is required";
      }
      if (!starttime) {
        errors.starttime = "Start Time is required";
      }
      if (!endtime) {
        errors.endtime = "End Time is required";
      }
      if (!eventlocation) {
        errors.eventlocation = "Event Location is required";
      }
      if (!speakername) {
        errors.speakername = "Speaker Name is required";
      }
      if (!editorData) {
        errors.eventdescription = "Event Description is required";
      }
      if (thumbImageList.length === 0 && image.length === 0) {
        errors.image = "Thumbnail is required";
      }
      if (banImageList.length === 0 && bannerimage.length === 0) {
        errors.bannerimage = "Banner is required";
      }
  
      const imageObjects = image.map((blob) => ({ blob, type: 1 }));
  
      const bannerimageObjects = bannerimage.map((blob) => ({ blob, type: 2 }));

      setFormErrors(errors);

      const isValid = Object.keys(errors).length === 0;
  
    if (isValid) {
      try {
        const combinedImages = [...imageObjects, ...bannerimageObjects];
        const eventData = {
          Id : location.state.user.Id,
          title: eventname,
          date: eventDate,
          endDate: eventendDate,
          start_time: starttime,
          end_time: endtime,
          speaker: speakername,
          location: eventlocation,
          description: editorData,
          userId: logUserId,
        };
  
        const eventResponse = await apiClient.post("/kmarticle/addevent", eventData)
        .then((res) => {
          if (res.data[0].LV_Id)
            if (combinedImages.length > 0) {
              let err = 0;
              let cnt = combinedImages.length - 1;
              let serverPath = process.env.REACT_APP_API_URL;
              combinedImages.forEach((item, key) => {
                const { blob, type } = item;
                let formData = new FormData();
                formData.append("image", blob);
                formData.append("eventId", res.data[0].LV_Id);
                formData.append("type", type);
                formData.append("userId", logUserId);
                axios
                  .post(serverPath + "/kmarticle/eventattachment", formData)
                  .then(() => {
                    if (cnt === key) {
                      if (err) {
                        let missingImages = [];

                        if (image.length === 0) {
                          missingImages.push("Thumbnail");
                        }

                        if (bannerimage.length === 0) {
                          missingImages.push("Banner");
                        }

                        let errorMessage =
                          "Event Added but the following images are not uploaded: " +
                          missingImages.join(", ");
                        Alert("warn", errorMessage);
                      } else {
                        Alert("succ", "Event Update successfully");
                        navigate(Routes.EventList);
                      }
                      setTimeout(() => {
                        setIsDisabled(false);
                      }, 4000);                    }
                  })
                  .catch(() => {
                    err++;
                  });
              });
            } else {
              Alert("succ", "Event Update successfully");
              navigate(Routes.EventList);
              setTimeout(() => {
                setIsDisabled(false);
              }, 4000);
            }
        });
  
        if (eventResponse.data[0].LV_Id) {
          const savedEventId = eventResponse.data[0].LV_Id;
          
          const combinedImages = [...imageObjects, ...bannerimageObjects];
          const imagePromises = combinedImages.map((item) => {
            const { blob, type } = item;
            const formData = new FormData();
            formData.append("image", blob);
            formData.append("eventId", savedEventId);
            formData.append("type", type);
            formData.append("userId", logUserId);
  
            return axios.post(`${serverPath}/kmarticle/eventattachment`, formData);
          });
  
          const imageResponses = await Promise.all(imagePromises);
  
          if (imageResponses.every((response) => response.status === 200)) {
            Alert("succ", "Event Update  successfully");
            navigate(Routes.EventList);
          } else {
            Alert("warn", "Some images failed to upload.");
          }
        }
      } catch (error) {
      } finally {
        setTimeout(() => {
          setIsDisabled(false);
        }, 4000);
      }
    } else {
      setTimeout(() => {
        setIsDisabled(false);
      }, 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SaveAddEvent();
  };


  const deleteAttachment = (id, type) => {
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
        apiClient
          .delete(`/kmarticle/attachment/event/delete/${id}`)
          .then((res) => {
            if (res.data.error) {
              Alert("error", res.data.error);
            } else {
              if (type === 1) setthumbImageList([]);
              else setBanImageList([]);
            }
          });
      }
    });
  };

  return (
    <div>
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
            navigate(Routes.EventList);
          }}
        >
          Events{" "}
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Edit Event</span>
      </div>
      <div className="maincontent__card--body">
        <div className="mt-4 maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ display: "inline-block" }}
          >
            EDIT EVENT
          </h2>
        </div>
        <div className="maincontent__card--content">
          <Form onSubmit={handleSubmit}>
            <div className="">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon className="input-icon" icon={faUserFriends} />
                      </span>
                    </div>
                    <Form.Control
                      value={eventname}
                      onChange={(e) => {
                        setEventName(e.target.value);
                        clearFieldError('eventname');
                      }}
                    />
                  </div>
                  {formErrors.eventname && (
                    <div className="text-danger">{formErrors.eventname}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon className="input-icon" icon={faCalendarAlt} />
                      </span>
                    </div>
                    <Form.Control
                      type="date"
                      style={{ fontSize: '12px' }}
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        clearFieldError('eventDate');
                      }}
                    />
                  </div>
                  {formErrors.eventDate && (
                    <div className="text-danger">{formErrors.eventDate}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon className="input-icon" icon={faCalendarAlt} />
                      </span>
                    </div>
                    <Form.Control
                      type="date"
                      style={{ fontSize: '12px' }}
                      value={eventendDate}
                      onChange={(e) => {
                        setEventEndDate(e.target.value);
                        clearFieldError('eventendDate');
                      }}
                    />
                  </div>
                  {formErrors.eventendDate && (
                    <div className="text-danger">{formErrors.eventendDate}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon className="input-icon" icon={faClock} />
                      </span>
                    </div>
                    <Form.Control
                      type="time"
                      value={starttime}
                      onChange={(e) => {
                        setStarttime(e.target.value);
                        clearFieldError('starttime');
                      }}
                    />
                  </div>
                  {formErrors.starttime && (
                    <div className="text-danger">{formErrors.starttime}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon className="input-icon" icon={faClock} />
                      </span>
                    </div>
                    <Form.Control
                      type="time"
                      value={endtime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        clearFieldError('endtime');
                      }}
                    />
                  </div>
                  {formErrors.endtime && (
                    <div className="text-danger">{formErrors.endtime}</div>
                  )}
                </Form.Group>
              </Col>
            </Row> {""}
            <br/>
            <div className="lg:col-span-4 md:col-span-2">
              <Row>
                <Col lg={6} md={6}>
                  <Form.Group>
                    <Form.Label>Speaker Name</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={speakername}
                      onChange={(e) => {
                        setSpeakerName(e.target.value);
                        clearFieldError('speakername');
                      }}
                    />
                    {formErrors.speakername && (
                      <div className="text-danger">{formErrors.speakername}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6}>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={1}
                      value={eventlocation}
                      onChange={(e) => {
                        setEventLocation(e.target.value);
                        clearFieldError('eventlocation');
                      }}
                    />
                    {formErrors.eventlocation && (
                      <div className="text-danger">{formErrors.eventlocation}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <br/>
              <div className="lg:col-span-4 md:col-span-2">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Event Description</Form.Label>
                  <MyEditor
                    data={editorData}
                    setState={setEditorData}
                    clearDescErr={clearFieldError}
                  />
                  {formErrors.eventdescription && (
                    <div className="text-danger">
                      {formErrors.eventdescription}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="flex justify-start gap-10 mt-8 col-span-4 items-start">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <label htmlFor="uploadThumbnail">Upload Thumbnail</label>
                    <br />
                    <div className="flex gap-2 imgiconKMD">
                      {thumbImageList.length === 0 && image.length === 0 && (
                        <ThumbIcon
                          image={image}
                          setImage={setImage}
                          className="maincontent__postarticle--attachicon"
                        />
                      )}
                    </div>
                    {thumbImageList.length === 0 && image.length === 0 && (
                      <div className="text-danger">{formErrors.image}</div>
                    )}
                    {thumbImageList &&
                      thumbImageList.map((attachment, i) => {
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
                              onClick={() => deleteAttachment(attachment.Id, 1)}
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
                      ))}
                    {image && image.length > 0 && (
                      <div>
                        {image.map((attachment, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(attachment)}
                            alt={`Selected Image ${i + 1}`}
                            width="100"
                            height="100"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <label htmlFor="uploadBanner">Upload Banner</label>
                    <br />
                    <div className="flex gap-2 imgiconKMD">
                      {banImageList.length === 0 && bannerimage.length === 0 && (
                        <ThumbIcon
                          image={bannerimage}
                          setImage={setBannerImage}
                          className="maincontent__postarticle--attachicon"
                        />
                      )}
                    </div>
                    {banImageList.length === 0 && bannerimage.length === 0 && (
                      <div className="text-danger">{formErrors.bannerimage}</div>
                    )}
                    {banImageList &&
                      banImageList.map((attachment, i) => {
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
                              onClick={() => deleteAttachment(attachment.Id, 2)}
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

                    {bannerimage &&
                      bannerimage.map((attachment, i) => (
                        <div className="d-flex" key={i}>
                          <ul className="list-disc">
                            <li>
                              <span>
                                {attachment.name}
                                <FontAwesomeIcon
                                  onClick={() => removeBannerFile(i)}
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
                      ))}
                    {bannerimage && bannerimage.length > 0 && (
                      <div>
                        {bannerimage.map((attachment, i) => (
                          <img
                            key={i}
                            src={URL.createObjectURL(attachment)}
                            alt={`Selected Image ${i + 1}`}
                            width="100"
                            height="100"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-8 lg:justify-end">
              <button
                type="submit"
                onClick={() => handleSubmit}
                disabled={isDisabled}
                className="maincontent__btn maincontent__btn--primaryblue "
              >
                Save
              </button>
              <button
                onClick={() => {
                  navigate(Routes.EventList);
                }}
                className="maincontent__btn maincontent__btn--primaryblue space_btn"
              >
                Back
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(editevent);