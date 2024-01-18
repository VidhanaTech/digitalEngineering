import React, { useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg";
import { useState } from "react";
import "./ViewClient.css";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../../common/http-common";
import { Routes } from "../../../routes";
import ClientCodeIcon from "../../../assets/img/icons/icon-client-code.svg";
import IndustryIcon from "../../../assets/img/icons/icon-industry.svg";
import ClientEffectCodeIcon from "../../../assets/img/icons/icon-client-effect-code.svg";
import ClientTypeIcon from "../../../assets/img/icons/icon-client-type.svg";
import ClientDesignationIcon from "../../../assets/img/icons/icon-client-designation.svg";
import EngagementLeaderIcon from "../../../assets/img/icons/icon-engagement-leader.svg";
import ServiceTypeIcon from "../../../assets/img/icons/icon-service-type.svg";
import POLocationIcon from "../../../assets/img/icons/icon-po-location.svg";
import DeliveryLocationIcon from "../../../assets/img/icons/icon-delivery-location.svg";
import { connect } from "react-redux";

const ViewClient = (state) => {
  const [clientDetails, setClientDetails] = useState({});
  const [projectDetails, setProjectDetails] = useState([]);
  const [serviceType, setServiceType] = useState();
  const [capability, setCapability] = useState();
  const [poLocation, setPoLocation] = useState();
  const [deliveryLocation, setDeliveryLocation] = useState([]);
  const [aboutClient, setAboutClient] = useState();
  const [penaltyClause, setPenaltyClause] = useState(false);
  const [globalClient, setGlobalClient] = useState(false);
  const [clientCode, setClientCode] = useState();
  const [attachmentList, setAttachmentList] = useState([]);
  let serverImgPath = process.env.REACT_APP_IMG_PATH;

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    function convert(str) {
      var date = new Date(str),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
  });

  useEffect(() => {
    if (location?.state?.client) {
      const client = location.state.client;
      apiClient
        .get(`/client/attachment/${location?.state?.client?.Id}`)
        .then((response) => {
          if (response.data.client) {
            setAttachmentList(response.data.client);
          }
        });
    }
  }, []);


  const filteredAttachmentList = attachmentList.filter(
    (attachment) => attachment.FilePath.length !== 0
  );

  useEffect(() => {
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
        }
      })
      .catch((err) => {
      });

    setClientDetails(location.state.client);
    apiClient.get(`/project/${location?.state?.client.Id}`).then((response) => {
      if (response.data.project.length > 0) {
        setProjectDetails(response.data.project);
      }
    });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
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
          <span className="maincontent__breadcrumb--active">View Client</span>
        </div>
      </div>
      <div className="maincontent__card--body">
        <div className="maincontent__card--header  d-flex justify-content-between align-items-center pt-2">
          <h2 className="maincontent__card--header-title">Client Details</h2>
          <h2 className="maincontent__card--header-title">
            Client Name - {clientDetails.Name}
          </h2>
        </div>
        <div className="maincontent__card--content">
          <Form>
                <Row>
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
                            required
                            type="text"
                            value={clientDetails?.Code}
                            disabled
                          />
                        </div>
                      </div>
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
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.DomainName}
                            disabled
                          />
                        </div>
                      </div>
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
                            required
                            type="date"
                            value={
                              clientDetails?.EffectiveDate
                                ? clientDetails.EffectiveDate.slice(0, 10)
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="capability">
                      <Form.Label>Capability</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <FontAwesomeIcon icon={faUser} />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.TowerName}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <div className="lg:col-span-4 md:col-span-2">
                    <Form.Group controlId="exampleForm. ControlTextarea1">
                      <Form.Label>About The Client</Form.Label>
                      <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        value={clientDetails?.About}
                        disabled
                      />
                    </Form.Group>
                  </div>
                </Row>

                <Row>
                  <Col md={3} className="mb-3">
                    <Form.Group id="clientType">
                      <Form.Label>Client Type</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img src={ClientTypeIcon} className="input-icon" />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.ClientTypeDesc}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="clientPoc">
                      <Form.Label>Client POC</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <FontAwesomeIcon icon={faUser} />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.POC}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="clientDesignation">
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
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.DesignationName}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="engagementLeader">
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
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.EngagementLeader}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} className="mb-3">
                    <Form.Group id="serviceType">
                      <Form.Label>Service Type</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img src={ServiceTypeIcon} className="input-icon" />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.ServiceTypeName}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="poLocation">
                      <Form.Label>PO Location</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img src={POLocationIcon} className="input-icon" />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.PoLocationName}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="deliveryLocation">
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
                          <Form.Control
                            required
                            type="text"
                            value={deliveryLocation
                              .map((location) => location.label)
                              .join(", ")}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group id="globalClient">
                      <Form.Label>Global Client</Form.Label>

                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={clientDetails?.GlobalClient ? "Yes" : "No"}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={3} className="mb-3">
                    {/* <Form.Group id="penalty">
                      <Form.Label>PenaltyClauseApplicable</Form.Label>
                      <div className="dropdown-container">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={
                              clientDetails?.PenaltyClauseApplicable
                                ? "Yes"
                                : "No"
                            }
                            disabled
                          />
                        </div>
                      </div>

                    </Form.Group> */}
                  </Col>
                </Row>
                <div className=" mt-2">
                  {filteredAttachmentList.length > 0 && (
                    <Accordion
                      defaultActiveKey="0"
                      style={{ margin: "10px 0px 20px 0px" }}
                    >
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="accordionheader">
                          View Attachments
                        </Accordion.Header>
                        <Accordion.Body
                          className="text-blue-700 accordionnew"
                          style={{
                            visibility: "visible",
                            color: "#1658a0",
                          }}
                        >
                          <Row className="mt-2">
                            <div className="flex flex-col">
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
                                          <a
                                            href={serverImgPath + attachment.FilePath}
                                            download
                                            style={{
                                              marginLeft: "15px",
                                              cursor: "pointer",
                                            }}
                                          >
                                          </a>
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
                  )}

                  <Row className="mb-3">
                    <Col md={4}></Col>
                    <Col md={4}></Col>
                    <Col md={4} className="d-flex justify-content-end">
                      <Button
                        className="maincontent__btn maincontent__btn--primaryblue"
                        style={{ marginRight: "4px", marginBottom: "8px" }}
                        onClick={() => {
                          navigate(Routes.SearchClient);
                        }}
                      >
                        Back
                      </Button>
                    </Col>
                  </Row>
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
export default connect(mapStateToProps)(ViewClient);
