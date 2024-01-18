import React from "react";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import Select from "react-select";
import axios from "axios";
import "./EditClient.css";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DropzoneComponent from "../../../components/DropZoneComponent";
import { useLocation } from "react-router-dom";
import apiClient from "../../../common/http-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrashAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Alert } from "../../../components/Alert";
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
import Swal from "sweetalert2";
import { connect } from "react-redux";

const EditClient = (state) => {
  const [clientName, setClientName] = useState();
  const [clientId, setClientId] = useState();
  const [clientCode, setClientCode] = useState();
  const [industry, setIndustry] = useState();
  const [clientEffectiveDate, setclientEffectiveDate] = useState();
  const [aboutClient, setAboutClient] = useState();
  const [clientType, setClientType] = useState();
  const [clientPOC, setClientPOC] = useState();
  const [clientDesignation, setClientDesignation] = useState();
  const [engagementLeader, setEngagementLeader] = useState();
  const [serviceType, setServiceType] = useState();
  const [capability, setCapability] = useState();
  const [poLocation, setPoLocation] = useState();
  const [deliveryLocation, setDeliveryLocation] = useState([]);
  const [compareDeliveryLocation, setCompareDeliveryLocation] = useState([]);
  const [penaltyClause, setPenaltyClause] = useState(false);
  const [globalClient, setGlobalClient] = useState(false);
  const [image, setImage] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [clientTypeList, setClientTypeList] = useState([]);
  const [clientDesignationList, setClientDesignationList] = useState([]);
  const [engagementList, setEngagementList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [capabilityList, setCapabilityList] = useState([]);
  const [poLocationList, setPoLocationList] = useState([]);
  const [deliveryLocationList, setDeliveryLocationList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [industryLookup, setIndustryLookup] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  let serverImgPath = process.env.REACT_APP_IMG_PATH;
  useEffect(() => {
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    if (location?.state?.client) {
      const client = location.state.client;
      setClientName(client.Name);
      setClientCode(client.Code);
      setClientId(client.Id);
      setclientEffectiveDate(convert(client?.EffectiveDate));
      setAboutClient(client.About);
      setEngagementLeader({
        label: client.EngagementLeader,
        value: client.EngagementLead,
      });
      setIndustry({ label: client.DomainName, value: client.DomainId });
      setClientDesignation({
        label: client.DesignationName,
        value: client.DesignationId,
      });
      setServiceType({
        label: client.ServiceTypeName,
        value: client.ServiceTypeId,
      });
      setClientType({ label: client.ClientTypeDesc, value: client.ClientType });
      setCapability({ label: client.TowerName, value: client.TowerId });
      setPoLocation({
        label: client.PoLocationName,
        value: client.PoLocationId,
      });
      setClientPOC(client.POC);
      // setPenaltyClause(client.PenaltyClauseApplicable === 1);
      setGlobalClient(client.GlobalClient === 1);

      apiClient
        .get(`/client/attachment/${location?.state?.client?.Id}`)
        .then((response) => {
          if (response.data.client) {
            setAttachmentList(response.data.client);
          }
        });
      apiClient
        .post("/client/location/get", {
          clientId: location?.state?.client?.Id,
          userId: null,
        })
        .then((res) => {
          if (res.data.client.length > 0) {
            let loca_arr = [];
            res.data.client.forEach((element) => {
              loca_arr.push({
                label: element.DeliveryLocationName,
                value: element.DeliveryLocationId,
              });
            });
            setDeliveryLocation(loca_arr);
            setCompareDeliveryLocation(loca_arr);
          }
        })
        .catch((err) => {});
    }

    apiClient
      .get(`/client/engagement/${location?.state?.client?.Id}`)
      .then((response) => {
        if (response.data.client) {
        }
      });

    apiClient.get("/lookup/designation/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          arr.push({ value: user.Id, label: user.Name });
        });
        setClientDesignationList(arr);
      }
    });

    apiClient.get("/lookup/serviceType/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          arr.push({ value: user.Id, label: user.Name });
        });
        setServiceList(arr);
      }
    });
    apiClient.get("/lookup/tower/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response?.data?.lookup?.map((user) => {
          arr.push({ value: user.Id, label: user.Name });
        });
        setCapabilityList(arr);
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
    apiClient.get("/user/role/3").then((response) => {
      if (response.data.user.length > 0) {
        const arr = [];
        response?.data?.user?.map((user) => {
          arr.push({
            value: user.Id,
            label: `${user.FirstName} ${user.LastName}`,
          });
          setEngagementList(arr);
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

  const handleInputFocus = (fieldName) => {
    setFormErrors((errors) => ({
      ...errors,
      [fieldName]: "",
    }));
  };
  let handleSubmit = async (e) => {
    setIsDisabled(true);
    e.preventDefault();
    let difference = compareDeliveryLocation.filter(
      (itemA) => !deliveryLocation.some((itemB) => itemB.value === itemA.value)
    );

    let newDeliveryLocation = deliveryLocation.filter(
      (itemA) =>
        !compareDeliveryLocation.some((itemB) => itemB.value === itemA.value)
    );

    const editClient = () => {
      setIsDisabled(true);

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
          .post("/client/update", {
            clientId: clientId,
            code: clientCode,
            clientName: clientName,
            about: aboutClient,
            effectiveDt: clientEffectiveDate,
            status: "1",
            endDt: "31-12-9999",
            poc: clientPOC,
            designationId: clientDesignation.value,
            engagementLead: engagementLeader.value,
            engagementEmail: location?.state?.client?.EngagementLeadEmail,
            domainId: industry.value,
            organizationId: 1,
            clientType: clientType.value,
            globalClient: globalClient,
            towerId: capability.value,
            serviceTypeId: serviceType.value,
            poLocId: poLocation.value,
            penaltyClauseApplicable: "",
            userId: state.user.Id,
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error);
              setIsDisabled(false);
            } else {
              newDeliveryLocation.forEach((row) => {
                apiClient.post("/client/location/add", {
                  id: null,
                  clientId: clientId,
                  locationId: row.value,
                  userId: state.user.Id,
                });
              });
              if (difference.length) {
                let articleIds = [];
                difference.map((item) => {
                  if (item.value) {
                    articleIds.push(item.value);
                  }
                });
                const idString = `(${articleIds.join(", ")})`;
                let deliveryData = {
                  clientId: location.state.client.Id,
                  locationId: idString,
                };

                apiClient
                  .post("/client/location/delete", deliveryData)
                  .then((res) => {
                  })
                  .catch((err) => {
                  });
              }
              setTimeout(() => {
                if (image.length > 0) {
                  let err = 0;
                  let cnt = image.length - 1;
                  let serverPath = process.env.REACT_APP_API_URL;
                  image.forEach((row, key) => {
                    let formData = new FormData();
                    formData.append("image", row);
                    formData.append("attachmentTypeId", 1);
                    formData.append("clientId", clientId);
                    formData.append("userId", state.user.Id);
                    axios
                      .post(serverPath + "/client/attachment/add", formData)
                      .then(() => {
                        if (cnt === key) {
                          if (err) {
                            Alert("warn", "Client Update but Image not upload");
                            setIsDisabled(false);
                          } else {
                            Alert("succ", "Client Updated successfully");
                            navigate(Routes.SearchClient);
                          }
                        }
                      })
                      .catch(() => {
                        err++;
                      });
                  });
                } else {
                  Alert("succ", "Client Updated successfully");
                  navigate(Routes.SearchClient);
                }
              }, 2000);
            }
          })
          .catch(() => {
            setIsDisabled(false);
          });
      }
    };
    editClient();
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
        apiClient.delete(`/client/attachment/delete/${id}`).then((res) => {
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
    <div>
      <div className="flex-wrap d-flex justify-content-between flex-md-nowrap align-items-center">
        <div
          className="maincontent__breadcrumb"
        >
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
          <span className="maincontent__breadcrumb--active">Edit Client</span>
        </div>
      </div>
      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Edit Client</h2>
        </div>
        <div border="light" className="px-4 shadow-sm">
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
                        type="text"
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
                          placeholder="Select Industry"
                          value={industry}
                          onChange={(e) => setIndustry(e)}
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
                  </Form.Group>
                </Col>
              </Row>
              {formErrors.aboutClient && (
                <div className="text-danger">{formErrors.aboutClient}</div>
              )}
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
                  </div>
                </Col>
                {formErrors.clientType && (
                  <div className="text-danger">{formErrors.clientType}</div>
                )}
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
                      onChange={(e) => {
                        setClientPOC(e.target.value);
                      }}
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
                    {formErrors.capability && (
                      <div className="text-danger">{formErrors.capability}</div>
                    )}
                  </div>
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

              <div style={{ width: "100%" }}>
                {/* <Row style={{ width: "auto", display: "inline-flex" }}>
                  <Col style={{ width: "auto", flex: "none" }}>
                    <p>Penalty Clause if applicable as per SOW</p>
                  </Col>
                  <Col style={{ width: "auto", flex: "none" }}>
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
                  </Col>
                </Row> */}
                <Row
                  style={{
                    width: "auto",
                    display: "inline-flex",
                    marginLeft: "20px",
                  }}
                >
                  <Col style={{ width: "auto", flex: "none" }}>
                    <p>Global Client</p>
                  </Col>
                  <Col style={{ width: "auto", flex: "none" }}>
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
                  </Col>
                </Row>
              </div>

              <Accordion
                defaultActiveKey="0" className="my-8"
              >
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
                    <Row className="mt-2">
                      <div className="cursor-pointer">
                        <DropzoneComponent image={image} setImage={setImage} />
                      </div>
                      <div className="flex flex-col mt-4">
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
                                      onClick={() =>
                                        deleteAttachment(attachment.id, i)
                                      }
                                      icon={faTrashAlt}
                                      style={{
                                        marginLeft: "15px",
                                        cursor: "pointer",
                                        color: "red",
                                      }}
                                    />
                                    <a
                                      href={serverImgPath + attachment.FilePath}
                                      download
                                      style={{
                                        marginLeft: "15px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faDownload}
                                        style={{ color: "green" }}
                                      />
                                    </a>
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
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Row className="">
                <Col md={4}></Col>
                <Col md={4}></Col>
                <Col md={4} className="d-flex gap-4 justify-content-end">
                  <Button
                    className="maincontent__btn maincontent__btn--primaryblue"
                    type="submit"
                    disabled={isDisabled}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    className="maincontent__btn maincontent__btn--primaryblue"
                    style={{ marginRight: "4px" }}
                    onClick={() => {
                      navigate(Routes.SearchClient);
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
            </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(EditClient);
