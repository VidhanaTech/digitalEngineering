import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Routes } from "../../routes";
import { connect } from "react-redux";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
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
import { Alert } from "../../components/Alert";
import MyEditor from "../components/MyCkEditor";
import ThumbIcon from "../../components/ThumbImg";
import addRewardPoints from "../../common/AddRewardPoints";

const addevent = (state) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logUserId] = useState(state.user.Id);
  const [eventname, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventendDate, setEventEndDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndTime] = useState();
  const [eventlocation, setEventLocation] = useState();
  const [speakername, setSpeakerName] = useState();
  const [eventdescription, setEventDescription] = useState();
  const [image, setImage] = useState([]);
  const [editorValue, setEditorValue] = useState();
  const [bannerimage, setBannerImage] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
      if (!editorValue) {
        errors.editorValue = "Event Description is required";
      }
      if (!image || image.length === 0) {
        errors.image = "Thumbnail is required";
      }
      if (!bannerimage || bannerimage.length === 0) {
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
          title: eventname,
          date: eventDate,
          endDate: eventendDate,
          start_time: starttime,
          end_time: endtime,
          speaker: speakername,
          location: eventlocation,
          description: editorValue,
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
                        addRewardPoints(
                          state.rewards[11].Points,
                          logUserId,
                          state.rewards[11].Id,
                          logUserId
                        );
                        Alert("succ", "Event Added successfully");
                        navigate(Routes.EventList);
                      }
                      setTimeout(() => {
                        setIsDisabled(false);
                      }, 4000);
                      }
                  })
                  .catch(() => {
                    err++;
                  });
              });
            } else {
              addRewardPoints(
                state.rewards[11].Points,
                logUserId,
                state.rewards[11].Id,
                logUserId
              );
              Alert("succ", "Event Added successfully");
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
            addRewardPoints(
              state.rewards[11].Points,
              logUserId,
              state.rewards[11].Id,
              logUserId
            );
            Alert("succ", "Event Added successfully");
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
        <span className="maincontent__breadcrumb--active">Add Event</span>
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ display: "inline-block" }}
          >
            ADD EVENT
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
                <Form.Label>Description</Form.Label>
                <MyEditor
                  data={editorValue}
                  setState={setEditorValue}
                  clearDescErr={() => clearFieldError("editorValue")}
                />
                {formErrors.editorValue && (
                  <div className="text-danger">
                    {formErrors.editorValue}
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
                    {image.length === 0 && (
                      <ThumbIcon
                        image={image}
                        setImage={setImage}
                        className="maincontent__postarticle--attachicon"
                      />
                    )}
                  </div>
                  {image &&
                    image.length === 0 &&
                    formErrors.image && (
                      <div className="text-danger">{formErrors.image}</div>
                    )}
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
                    {bannerimage.length === 0 && (
                      <ThumbIcon
                        image={bannerimage}
                        setImage={setBannerImage}
                        className="maincontent__postarticle--attachicon"
                      />
                    )}
                  </div>
                  {bannerimage &&
                    bannerimage.length === 0 &&
                    formErrors.bannerimage && (
                      <div className="text-danger">
                        {formErrors.bannerimage}
                      </div>
                    )}
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
export default connect(mapStateToProps)(addevent);