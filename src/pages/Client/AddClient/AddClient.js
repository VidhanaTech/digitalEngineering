import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { Alert } from "../../../components/Alert";
import { faUser, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./AddClient.css";
import {
  Col,
  Row,
  Card,
  Accordion,
  Form,
} from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DropzoneComponent from "../../../components/DropZoneComponent";
import apiClient from "../../../common/http-common";
import { Routes } from "../../../routes";
import ClientNameIcon from "../../../assets/img/icons/icon-client.svg";
import ClientCodeIcon from "../../../assets/img/icons/icon-client-code.svg";
import IndustryIcon from "../../../assets/img/icons/icon-industry.svg";
import CapabilityIcon from "../../../assets/img/icons/icon-capability.svg";
import ClientEffectCodeIcon from "../../../assets/img/icons/icon-client-effect-code.svg";
import ClientTypeIcon from "../../../assets/img/icons/icon-client-type.svg";
import ClientDesignationIcon from "../../../assets/img/icons/icon-client-designation.svg";
import EngagementLeaderIcon from "../../../assets/img/icons/icon-engagement-leader.svg";
import ServiceTypeIcon from "../../../assets/img/icons/icon-service-type.svg";
import POLocationIcon from "../../../assets/img/icons/icon-po-location.svg";
import DeliveryLocationIcon from "../../../assets/img/icons/icon-delivery-location.svg";
import { connect } from "react-redux";

const AddClient = (state) => {
  const [clientName, setClientName] = useState();
  const [clientCode, setClientCode] = useState();
  const [industry, setindustry] = useState();
  const [clientEffectiveDate, setclientEffectiveDate] = useState();
  const [aboutClient, setAboutClient] = useState();
  const [clientType, setClientType] = useState();
  const [clientPOC, setClientPOC] = useState();
  const [clientDesignation, setClientDesignation] = useState();
  const [engagementLeader, setEngagementLeader] = useState();
  const [serviceType, setServiceType] = useState();
  const [capability, setCapability] = useState();
  const [deliveryLocation, setDeliveryLocation] = useState();
  const [poLocation, setPoLocation] = useState();
  const [penaltyClause, setPenaltyClause] = useState(false);
  const [globalClient, setGlobalClient] = useState(false);
  const [image, setImage] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [clientTypeList, setClientTypeList] = useState([]);
  const [clientDesignationList, setClientDesignationList] = useState([]);
  const [engagementList, setEngagementList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [capabilityList, setCapabilityList] = useState([]);
  const [poLocationList, setPoLocationList] = useState([]);
  const [deliveryLocationList, setDeliveryLocationList] = useState([]);

  const [industryLookup, setIndustryLookup] = useState([]);

  const navigate = useNavigate();

  const optionList = [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "white", label: "White" },
  ];

  useEffect(() => {
    function convert(str) {
      var date = new Date(str),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }

    apiClient.get("/user/role/3").then((response) => {
      if (response.data.user.length > 0) {
        const arr = [];
        response?.data?.user?.map((user) => {
          arr.push({
            value: user.Id,
            label: `${user.FirstName} ${user.LastName}`,
            email: user.EmailId,
          });
          setEngagementList(arr);
        });
      }
    });
    apiClient.get("/lookup/domain/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };

          arr.push(obj);
          setIndustryLookup(arr);
        });
      }
    });
    apiClient.get("/lookup/clientType/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setClientTypeList(arr);
        });
      }
    });
    apiClient.get("/lookup/designation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setClientDesignationList(arr);
        });
      }
    });

    apiClient.get("/lookup/serviceType/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setServiceList(arr);
        });
      }
    });
    apiClient.get("/lookup/tower/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setCapabilityList(arr);
        });
      }
    });
    apiClient.get("/lookup/poLocation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setPoLocationList(arr);
        });
      }
    });
    apiClient.get("/lookup/deliveryLocation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);

          setDeliveryLocationList(arr);
        });
      }
    });
  }, []);
  useEffect(() => {
    if (
      clientName &&
      clientCode &&
      industry &&
      clientEffectiveDate &&
      aboutClient &&
      clientType &&
      clientPOC &&
      clientDesignation &&
      serviceType &&
      capability &&
      poLocation &&
      deliveryLocation
    ) {
      setIsDisabled(false);
    } else {
    }
  }, [
    clientCode,
    clientName,
    industry,
    clientEffectiveDate,
    aboutClient,
    clientType,
    clientPOC,
    clientDesignation,
    engagementLeader,
    serviceType,
    capability,
    poLocation,
    deliveryLocation,
  ]);
  const handleInputFocus = (fieldName) => {
    setFormErrors((errors) => ({
      ...errors,
      [fieldName]: "",
    }));
  };
  let handleSubmit = async (e) => {
    e.preventDefault();

    const SaveAddClient = () => {
      setIsDisabled(true);
      let globalClientVal = "";
      // let penaltyClauseVal = "";
      if (globalClient) {
        globalClientVal = "1";
      } else {
        globalClientVal = "0";
      }
      // if (penaltyClause) {
      //   penaltyClauseVal = "1";
      // } else {
      //   penaltyClauseVal = "2";
      // }
      const errors = {};
      let isValid = true;
      if (!clientName) {
        errors.clientName = "Client Name is required";
        isValid = false;
      }
      if (!clientCode) {
        errors.clientCode = "Client Code is required";
        isValid = false;
      }
      if (!industry) {
        errors.industry = "Industry is required";
        isValid = false;
      }
      if (!clientEffectiveDate) {
        errors.clientEffectiveDate = "Effective Date is required";
        isValid = false;
      }
      if (!aboutClient) {
        errors.aboutClient = "About the Client is required";
        isValid = false;
      }
      if (!clientType) {
        errors.clientType = "Client Type is required";
        isValid = false;
      }
      if (!clientPOC) {
        errors.clientPOC = "Client POC is required";
        isValid = false;
      }
      if (!clientDesignation) {
        errors.clientDesignation = "Client Designation is required";
        isValid = false;
      }
      if (!engagementLeader) {
        errors.engagementLeader = "Engagement Leader is required";
        isValid = false;
      }
      if (!serviceType) {
        errors.serviceType = "Service Type is required";
        isValid = false;
      }
      if (!capability) {
        errors.capability = "Capability is required";
        isValid = false;
      }
      if (!poLocation) {
        errors.poLocation = "PO Location is required";
        isValid = false;
      }
      if (!deliveryLocation || deliveryLocation.length === 0) {
        errors.deliveryLocation = "Delivery Location is required";
        isValid = false;
      }
      setFormErrors(errors);

      if (isValid) {
        apiClient
          .post("/client/add", {
            clientId: null,
            code: clientCode,
            clientName: clientName,
            about: aboutClient,
            effectiveDt: clientEffectiveDate,
            status: "1",
            endDt: "15-08-1986",
            poc: clientPOC,
            designationId: clientDesignation.value.toString(),
            engagementLead: engagementLeader.value,
            engagementEmail: engagementLeader.email,
            domainId: industry.value.toString(),
            organizationId: 1,
            clientType: clientType.value,
            globalClient: globalClientVal,
            towerId: capability.value,
            serviceTypeId: serviceType.value.toString(),
            poLocId: poLocation.value.toString(),
            penaltyClauseApplicable: "",
            userId: state.user.Id,
          })
          .then((response) => {
            if (response?.status == 200) {
              if (response.data.client[0].LV_Id) {
                deliveryLocation.forEach((row) => {
                  apiClient.post("/client/location/add", {
                    id: null,
                    clientId: response.data.client[0].LV_Id,
                    locationId: row.value,
                    userId: state.user.Id,
                  });
                });
                setTimeout(() => {
                  let serverPath = process.env.REACT_APP_API_URL;
                  if (image.length > 0) {
                    let err = 0;
                    let cnt = image.length - 1;
                    image.forEach((row, key) => {
                      let formData = new FormData();
                      formData.append("image", row);
                      formData.append("attachmentTypeId", 1);
                      formData.append(
                        "clientId",
                        response.data.client[0].LV_Id
                      );
                      formData.append("userId", state.user.Id);
                      axios
                        .post(serverPath + "/client/attachment/add", formData)
                        .then(() => {
                          if (cnt === key) {
                            if (err) {
                              Alert(
                                "warn",
                                "Client Added but Image not upload"
                              );
                            } else {
                              Alert("succ", "Client added successfully");
                              navigate(Routes.SearchClient);
                            }
                          }
                        })
                        .catch(() => {
                          err++;
                        });
                    });
                  } else {
                    Alert("succ", "Client added successfully");
                    navigate(Routes.SearchClient);
                  }
                }, 2000);
              }
            } else {
              Alert("error", "Please Try Again!...");
            }
          })
          .catch((err) => {
            Alert("error", err.message);
            setIsDisabled(false);
          });
      } else {
      }
    };
    SaveAddClient();
  };
  const removeFile = (i) => {
    let sno = 0;
    let resarr = [];
    image.map((row, key) => {
      if (i !== key) resarr[sno++] = row;
    });
    setImage(resarr);
  };
  return (
    <>
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
            navigate(Routes.SearchClient);
          }}
        >
          Client Management
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Add Client</span>
      </div>
      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Add Client</h2>
        </div>
        <div border="light" className="maincontent__card--content">
          <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Group id="clientName">
                    <Form.Label>Client Name</Form.Label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img src={ClientNameIcon} className="input-icon" />
                        </span>
                      </div>
                      <Form.Control
                        // required
                        type="text"
                        className="input-font"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        onFocus={() => handleInputFocus("clientName")}
                      />
                    </div>
                    {formErrors.clientName && (
                      <div className="text-danger">{formErrors.clientName}</div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Group id="clientCode">
                    <Form.Label>Client Code</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text icon-container">
                            <img src={ClientCodeIcon} className="input-icon" />
                          </span>
                        </div>
                        <Form.Control
                          // required
                          type="text"
                          value={clientCode}
                          onChange={(e) => setClientCode(e.target.value)}
                          onFocus={() => handleInputFocus("clientCode")}
                        />
                      </div>
                    </div>
                    {formErrors.clientCode && (
                      <div className="text-danger">{formErrors.clientCode}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="industry">
                    <Form.Label>Industry</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text icon-container">
                            <img src={IndustryIcon} className="input-icon" />
                          </span>
                        </div>
                        <Select
                          options={industryLookup}
                          value={industry}
                          onChange={(e) => setindustry(e)}
                          onFocus={() => handleInputFocus("industry")}
                        />
                      </div>
                    </div>
                    {formErrors.industry && (
                      <div className="text-danger">{formErrors.industry}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Group id="clientEffectiveDate">
                    <Form.Label>Client Effective Date</Form.Label>
                    <div className="dropdown-container">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text icon-container">
                            <img
                              src={ClientEffectCodeIcon}
                              className="input-icon"
                            />
                          </span>
                        </div>
                        <Form.Control
                          type="date"
                          value={clientEffectiveDate}
                          onChange={(e) =>
                            setclientEffectiveDate(e.target.value)
                          }
                          onFocus={() =>
                            handleInputFocus("clientEffectiveDate")
                          }
                        />
                      </div>
                    </div>
                    {formErrors.clientEffectiveDate && (
                      <div className="text-danger">
                        {formErrors.clientEffectiveDate}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>About The Client</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={aboutClient}
                      onChange={(e) => setAboutClient(e.target.value)}
                      onFocus={() => handleInputFocus("aboutClient")}
                    />
                    {formErrors.aboutClient && (
                      <div className="text-danger">
                        {formErrors.aboutClient}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Label>Client Type</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img src={ClientTypeIcon} className="input-icon" />
                        </span>
                      </div>
                      <Select
                        options={clientTypeList}
                        value={clientType}
                        onChange={(e) => {
                          setClientType(e);
                        }}
                        onFocus={() => handleInputFocus("clientType")}
                      />
                    </div>
                    {formErrors.clientType && (
                      <div className="text-danger">{formErrors.clientType}</div>
                    )}
                  </div>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Client POC</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </div>
                    <Form.Control
                      type="text"
                      value={clientPOC}
                      onChange={(e) => setClientPOC(e.target.value)}
                      onFocus={() => handleInputFocus("clientPOC")}
                    />
                  </div>
                  {formErrors.clientPOC && (
                    <div className="text-danger">{formErrors.clientPOC}</div>
                  )}
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Client Designation</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img
                            src={ClientDesignationIcon}
                            className="input-icon"
                          />
                        </span>
                      </div>
                      <Select
                        options={clientDesignationList}
                        value={clientDesignation}
                        onChange={(e) => {
                          setClientDesignation(e);
                        }}
                        onFocus={() => handleInputFocus("clientDesignation")}
                      />
                    </div>
                    {formErrors.clientDesignation && (
                      <div className="text-danger">
                        {formErrors.clientDesignation}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Engagement Leader</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img
                            src={EngagementLeaderIcon}
                            className="input-icon"
                          />
                        </span>
                      </div>
                      <Select
                        options={engagementList}
                        value={engagementLeader}
                        onChange={(e) => {
                          setEngagementLeader(e);
                        }}
                        onFocus={() => handleInputFocus("engagementLeader")}
                      />
                    </div>
                    {formErrors.engagementLeader && (
                      <div className="text-danger">
                        {formErrors.engagementLeader}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={3} className="mb-3">
                  <Form.Label>Service Type</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img src={ServiceTypeIcon} className="input-icon" />
                        </span>
                      </div>
                      <Select
                        options={serviceList}
                        value={serviceType}
                        onChange={(e) => {
                          setServiceType(e);
                        }}
                        onFocus={() => handleInputFocus("serviceType")}
                      />
                    </div>
                    {formErrors.serviceType && (
                      <div className="text-danger">
                        {formErrors.serviceType}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Capability</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img src={CapabilityIcon} className="input-icon" />
                        </span>
                      </div>
                      <Select
                        options={capabilityList}
                        value={capability}
                        onChange={(e) => {
                          setCapability(e);
                        }}
                        onFocus={() => handleInputFocus("capability")}
                      />
                    </div>
                  </div>
                  {formErrors.capability && (
                    <div className="text-danger">{formErrors.capability}</div>
                  )}
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>PO Location</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img src={POLocationIcon} className="input-icon" />
                        </span>
                      </div>
                      <Select
                        options={poLocationList}
                        value={poLocation}
                        onChange={(e) => {
                          setPoLocation(e);
                        }}
                        onFocus={() => handleInputFocus("poLocation")}
                      />
                    </div>
                    {formErrors.poLocation && (
                      <div className="text-danger">{formErrors.poLocation}</div>
                    )}
                  </div>
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Delivery Location</Form.Label>
                  <div className="dropdown-container">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text icon-container">
                          <img
                            src={DeliveryLocationIcon}
                            className="input-icon"
                          />
                        </span>
                      </div>
                      <Select
                        options={deliveryLocationList}
                        value={deliveryLocation}
                        onChange={(selectedOptions) => {
                          setDeliveryLocation(selectedOptions);
                        }}
                        onFocus={() => handleInputFocus("deliveryLocation")}
                        isMulti
                      />
                    </div>
                  </div>
                  {formErrors.deliveryLocation && (
                    <div className="text-danger">
                      {formErrors.deliveryLocation}
                    </div>
                  )}
                </Col>
              </Row>

              <div className="flex flex-col justify-start gap-4 mt-4 mb-4 md:flex-row">
                {/* <div className="flex items-center justify-start gap-4 cursor-pointer">
                  <p>Penalty Clause if applicable as per SOW</p>
                  <div class="form-check form-switch">
                    {!penaltyClause && (
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        No
                      </label>
                    )}
                    <input
                      class="form-check-input cursor-pointer"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      value={penaltyClause}
                      onChange={() => {
                        setPenaltyClause(!penaltyClause);
                      }}
                      checked={penaltyClause ? "checked" : ""}
                    />
                    {penaltyClause && (
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        Yes
                      </label>
                    )}
                  </div>
                </div> */}
                <div className="flex items-center justify-start gap-4">
                  <p>Global Client</p>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input cursor-pointer"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={globalClient}
                      onChange={() => {
                        setGlobalClient(!globalClient);
                      }}
                      checked={globalClient ? "checked" : ""}
                    />
                    {globalClient && (
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Yes
                      </label>
                    )}
                    {!globalClient && (
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        No
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <Accordion defaultActiveKey="0" className="mt-4">
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="accordionheader">
                    Add Attachments
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{
                      visibility: "visible",
                      color: "#1658a0",
                    }}
                  >
                    <div className="cursor-pointer">
                      <DropzoneComponent image={image} setImage={setImage} />
                    </div>

                    <div className="flex flex-col">
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
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <div className="flex gap-4 md:mt-8 lg:justify-end md:justify-center">
                <button
                  className="maincontent__btn maincontent__btn--primaryblue"
                  disabled={isDisabled}
                  type="submit"
                  // onClick={() => SaveAddClient()}
                >
                  Save
                </button>
                <button
                  className="maincontent__btn maincontent__btn--primaryblue"
                  onClick={() => {
                    navigate(Routes.SearchClient);
                  }}
                >
                  Back
                </button>
              </div>
          </Form>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(AddClient);
