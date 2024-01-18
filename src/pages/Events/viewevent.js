import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { yyyymmdd, isImageAttachment } from "../../common/Helper";
import { Routes } from '../../routes';
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from '@themesberg/react-bootstrap';
import { faCalendarAlt, faClock, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import apiClient from "../../common/http-common";
import axios from "axios";
import Swal from 'sweetalert2';
import { Alert } from '../../components/Alert';
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from 'html-react-parser';

const viewevent = (state) => {
  const location = useLocation();
  const navigate = useNavigate();
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  const [logUserId] = useState(state.user.Id);
  const [eventname, setEventName] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventendDate, setEventEndDate] = useState();
  const [starttime, setStarttime] = useState();
  const [endtime, setEndTime] = useState();
  const [eventlocation, setEventLocation] = useState()
  const [eventdescription, setEventDescription] = useState('');
  const [image, setImage] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [bannerimage, setBannerImage] = useState ([]);
  const [thumbImageList, setthumbImageList] = useState([]);
  const [banImageList, setBanImageList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editorData, setEditorData] = useState("");
  const removeFile = (i) => {
    let sno = 0
    let resarr = []
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row
    })
    setImage(resarr)
  }

  const removeBannerFile = (i) => {
    let sbno = 0
    let resbarr = []
    bannerimage.map((row, key) => {
      if (i !== key) resbarr[sbno++] = row
    })
    setBannerImage(resbarr)
  }

  const clearFieldError = (fieldName) => {
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  useEffect(() => {
    apiClient.get('/kmarticle/getEventById/'+location.state.user.Id).then((res)=>{
      const user = res.data[0];
      setEventName(user.Title);
      setEventDate(yyyymmdd(user.Start_Date));
      setEventEndDate(yyyymmdd(user.End_Date));
      setStarttime(user.Start_Time);
      setEndTime(user.End_Time);
      setEventLocation(user.Location);
      setEventDescription(parse(user.Description));
      setthumbImageList(user.thumbImg);
      setBanImageList(user.bannerImg);
    }).catch(()=>{

    })
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
      errors.eventname = 'Event Name is required';
    }
    if (!eventDate) {
      errors.eventDate = 'Event Start Date is required';
    }
    if (!eventendDate) {
      errors.eventendDate = 'Event End Date is required';
    }
    if (!starttime) {
      errors.starttime = 'Start Time is required';
    }
    if (!endtime) {
      errors.endtime = 'End Time is required';
    }
    if (!eventlocation) {
      errors.eventlocation = 'Event Location is required';
    }
    if (!eventdescription) {
      errors.eventdescription = 'Event Description is required';
    }
    
    const imageObjects = image.map((blob) => ({ blob, type: 1 }));

    const bannerimageObjects = bannerimage.map((blob) => ({ blob, type: 2 }));
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
  
    if (isValid) {
      try {
        const combinedImages = [...imageObjects, ...bannerimageObjects];
  
        apiClient.post('/kmarticle/addevent', {
          Id: null,
          title: eventname,
          date: eventDate,
          endDate: eventendDate,
          start_time: starttime,
          end_time: endtime,
          location: eventlocation,
          description: eventdescription,
          userId: logUserId,
        }).then((res)=>{
          if(res.data[0].LV_Id)
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
                  
                      let errorMessage = "Event Updated but the following images are not uploaded: " + missingImages.join(", ");
                      Alert("warn", errorMessage);
                    } else {
                      Alert("succ", "Event Updated successfully");
                      navigate(Routes.EventList);
                    }
                    setIsDisabled(false);
                  }
                })
                .catch(() => {
                  err++;
                });
            });
          } else {
            Alert("succ", "Event Updated successfully");
            navigate(Routes.EventList);
            setIsDisabled(false);
          }
        
        });
      } catch (error) {
      }
    } else {
      setIsDisabled(false);
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);

    setEventDescription(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SaveAddEvent();

  }

  return (
    <div>
      <div className="maincontent__breadcrumb">
        <img
          className="cursor_pointer"
          src={HomeOutlineIcon}
          alt="home"
        />
        <span className="maincontent__breadcrumb--divider">/</span>
        <span
          className="cursor_pointer"
          onClick={() => {
            if (location.state.fromFirstPage === true) {
              navigate(Routes.EventRegister);
            } else {
              navigate(Routes.EventList);
            }
          }}
        >
          Events{" "}
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">View Event</span>
      </div>

      <div className="mt-4 maincontent__card--header">
        <h2
          className="maincontent__card--header-title"
          style={{ display: "inline-block" }}
        >
          VIEW EVENT
        </h2>
      </div>
      <div className='maincontent__card--content'>
        <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <FontAwesomeIcon className="input-icon" icon={faUserFriends} />
                  </span>
                </div>
              <Form.Control
                value={eventname}
                onChange={(e) => { setEventName(e.target.value); clearFieldError('eventname'); }}
                disabled
              />
              </div>
              {formErrors.eventname && (
                <div className="text-danger">{formErrors.eventname}</div>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Event Start Date</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <FontAwesomeIcon className="input-icon" icon={faCalendarAlt} />
                  </span>
                </div>
                <Form.Control
                  type="date"
                  style={{ fontSize: "12px" }}
                  value={eventDate}
                  onChange={(e) => { setEventDate(e.target.value); clearFieldError('eventDate'); }}
                  disabled
                />
              </div>
              {formErrors.eventDate && (
                <div className="text-danger">{formErrors.eventDate}</div>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Event End Date</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <FontAwesomeIcon className="input-icon" icon={faCalendarAlt} />
                  </span>
                </div>
                <Form.Control
                  type="date"
                  style={{ fontSize: "12px" }}
                  value={eventendDate}
                  onChange={(e) => { setEventEndDate(e.target.value); clearFieldError('eventendDate'); }}
                  disabled
                />
              </div>
              {formErrors.eventendDate && (
                <div className="text-danger">{formErrors.eventendDate}</div>
              )}
            </Form.Group> <br/>

            <Form.Group>
              <Form.Label>Event Start Time</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <FontAwesomeIcon className="input-icon" icon={faClock} />
                  </span>
                </div>
              <Form.Control
                type="time"
                value={starttime}
                onChange={(e) => { setStarttime(e.target.value); clearFieldError('starttime'); }}
                disabled
              />
              </div>
              {formErrors.starttime && (
                <div className="text-danger">{formErrors.starttime}</div>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Event End Time</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text icon-container">
                    <FontAwesomeIcon className="input-icon" icon={faClock} />
                  </span>
                </div>
              <Form.Control
                type='time'
                value={endtime}
                onChange={(e) => { setEndTime(e.target.value); clearFieldError('endtime'); }}
                disabled
              />
              </div>
              {formErrors.endtime && (
                <div className="text-danger">{formErrors.endtime}</div>
              )}
            </Form.Group>

            <div className="lg:col-span-4 md:col-span-2">
              <Form.Group>
                <Form.Label>Event Location</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={eventlocation}
                  onChange={(e) => { setEventLocation(e.target.value); clearFieldError('eventlocation'); }}
                  disabled
                />
                {formErrors.eventlocation && (
                  <div className="text-danger">{formErrors.eventlocation}</div>
                )}
              </Form.Group>
            </div>

            <div className="lg:col-span-4 md:col-span-2">
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Event Description</Form.Label>
              <CKEditor
                editor={ClassicEditor}
                data={editorData}
                onChange={handleEditorChange}
                disabled
              />
              {formErrors.eventdescription && (
                <div className="text-danger">{formErrors.eventdescription}</div>
              )}
            </Form.Group>
          </div>
          <div className="flex items-center justify-between gap-4 mt-8">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="uploadThumbnail">Event Thumbnail</label><br/>
              <div className="flex gap-2 imgiconKMD">
              </div>
              {formErrors.image && (
                <div className="text-danger">{formErrors.image}</div>
              )}
              {thumbImageList && thumbImageList.length === 0 && (
                <div className='text-xs'>No Image Available</div>
              )}
              {thumbImageList &&
                thumbImageList.map((attachment, i) => {
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
                              color: "red"
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

          <div className="flex items-center justify-between gap-4 mt-8">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="uploadBanner">Event Banner</label><br/>
              <div className="flex gap-2 imgiconKMD">
              </div>
              {formErrors.bannerimage && (
                <div className="text-danger">{formErrors.bannerimage}</div>
              )}
              {banImageList && banImageList.length === 0 && (
                <div className='text-xs'>No Image Available</div>
              )}
              {banImageList &&
                  banImageList.map((attachment, i) => {
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
                              color: "red"
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
          <div className="flex justify-center gap-4 mt-8 lg:justify-end">
            <button
              onClick={() => {
                if (location.state.fromFirstPage === true) {
                  navigate(Routes.EventRegister);
                } else {
                  navigate(Routes.EventList);
                }
              }}
              className="maincontent__btn maincontent__btn--primaryblue space_btn"
            >
              Back
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
};


const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(viewevent);