import React, { useEffect } from "react";
import "./AddProject.css";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import Select from "react-select";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandFist, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../common/http-common";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import ClientNameIcon from "../../assets/img/icons/project-management/icon-clientname.svg";
import ProjectNameIcon from "../../assets/img/icons/project-management/icon-projectname.svg";
import ProjectManagerIcon from "../../assets/img/icons/project-management/icon-projectmanager.svg";
import EngagementLeaderIcon from "../../assets/img/icons/project-management/icon-engagement-leader.svg";
import StartDateIcon from "../../assets/img/icons/project-management/icon-start-date.svg";
import EndDateIcon from "../../assets/img/icons/project-management/icon-end-date.svg";
import HeadCountIcon from "../../assets/img/icons/project-management/icon-head-count.svg";
import DeliveryTypeIcon from "../../assets/img/icons/project-management/icon-delivery-type.svg";
import EngagementTypeIcon from "../../assets/img/icons/project-management/icon-engagement-type.svg";
import ProjectTypeIcon from "../../assets/img/icons/project-management/icon-project-type.svg";
import ProjectStatusIcon from "../../assets/img/icons/project-management/icon-project-status.svg";
import { Alert } from "../../components/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { Routes } from "../../routes";
import Swal from "sweetalert2";
import { connect } from "react-redux";

const AddProject = (state) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentWeekPara, setcurrentWeekPara] = useState({
    currentWeek: "",
    currentMonth: "",
    currentYear: "",
  });
  const [editData, setEditData] = useState({
    id: "",
    clientId: "",
    name: "",
    managerId: "",
    startDate: "",
    endDate: "",
    capabilityId: "",
    techStackId: "",
    headCount: "",
    leadId: "",
    about: "",
    additionalDetails: "",
    deliveryTypeId: "",
    EngagementTypeId: "",
    projectStatusId: "",
    IndustryId: "",
    ProjectTypeId: "",
    userId: 1,
  });
  const [selectVal, setSelectVal] = useState({
    clientId: "",
    leadId: "",
    capabilityId: "",
    deliveryTypeId: "",
    EngagementTypeId: "",
    projectStatusType: "",
    techStackType: "",
    managerId: "",
    IndustryId: "",
    ProjectTypeId: "",
  });
  const [clientList, setclientList] = useState([]);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [leaderList, setLeaderList] = useState([]);
  const [title, setTitle] = useState("Add Project");
  const [ManagerList, setManagerList] = useState([]);
  const [capabilityList, setcapabilityList] = useState([]);
  const [deliverTypeList, setdeliverTypeList] = useState([]);
  const [engagementTypeList, setengagementTypeList] = useState([]);
  const [projectStatusType, setprojectStatusType] = useState([]);
  const [techStackType, settechStackType] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [skilList, setSkilList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [teamComposition, setTeamComposition] = useState([
    {
      id: "",
      technology: "",
      role: "",
      skill: "",
      Beginner: "",
      intermediate: "",
      expert: "",
      specialist: "",
    },
  ]);
  const [industryList, setindustryList] = useState([]);
  const [projectTypeList, setProjectTypeList] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [disabled, setdisabled] = useState(false);

  const handleInputFocus = (fieldName) => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !saveDisabled) {
      e.preventDefault();
      saveProject();
    }
  };

  const saveProject = () => {
    setSaveDisabled(true);
    const errors = {};
    let isValid = true;

    if (!selectVal.clientId) {
      errors.clientId = "Client Name is required";
      isValid = false;
    } else {
      errors.clientId = "";
    }

    if (!editData.name) {
      errors.name = "Project Name is required";
      isValid = false;
    }

    if (!selectVal.managerId) {
      errors.managerId = "Project Manager is required";
      isValid = false;
    }

    if (!selectVal.leadId) {
      errors.leadId = "Engagement Leader is required";
      isValid = false;
    }

    if (!editData.about) {
      errors.about = "About the Project is required";
      isValid = false;
    }

    if (!editData.startDate) {
      errors.startDate = "Start Date is required";
      isValid = false;
    }

    if (!editData.endDate) {
      errors.endDate = "End Date is required";
      isValid = false;
    }

    if (!selectVal.capabilityId) {
      errors.capabilityId = "Capability is required";
      isValid = false;
    }

    if (!editData.headCount) {
      errors.headCount = "Head Count is required";
      isValid = false;
    }

    if (!selectVal.deliveryTypeId) {
      errors.deliveryTypeId = "Delivery Type is required";
      isValid = false;
    }

    if (!selectVal.EngagementTypeId) {
      errors.EngagementTypeId = "Engagement Type is required";
      isValid = false;
    }

    if (!selectVal.ProjectTypeId) {
      errors.ProjectTypeId = "Project Type is required";
      isValid = false;
    }
    if (!selectVal.projectStatusType) {
      errors.projectStatusType = "Project Status is required";
      isValid = false;
    }

    setFormErrors(errors);

    if (isValid) {
      editData.clientId = selectVal.clientId.value;
      editData.capabilityId = selectVal.capabilityId.value;
      editData.deliveryTypeId = selectVal.deliveryTypeId.value;
      editData.EngagementTypeId = selectVal.EngagementTypeId.value;
      editData.projectStatusId = selectVal.projectStatusType.value;
      editData.managerId = selectVal.managerId.value;
      editData.IndustryId = selectVal.IndustryId.value;
      editData.ProjectTypeId = selectVal.ProjectTypeId.value;
      editData.leadId = selectVal.leadId.value;

          apiClient
          .post("project", editData)
          .then((res) => {
            return Promise.all([SaveTeamComposition(res.data.projectId.LV_Id), res]);
          })
          .then(() => {
            // Handle the responses as needed
            let msg = location?.state?.project?.id
              ? "Project Updated Successfully"
              : "Project Created Successfully";
            Alert("succ", msg);
            setSaveDisabled(false);
            navigate(Routes.SearchProjectSummary);
          })
          .catch((err) => {
            setSaveDisabled(false);
            Alert("error", "Please Try Again!...");
          });
    } else {
      setSaveDisabled(false);
    }
  };

  useEffect(() => {
    apiClient.get("user/role/3").then((res) => {
      const englead_arr = [];
      res.data.user.forEach((element) => {
        englead_arr.push({
          value: element.Id,
          label: element.FirstName + " " + element.LastName,
        });
      });
      setLeaderList(englead_arr);
    });
    apiClient.get("user/role/1").then((res) => {
      const englead_arr = [];
      if (res.data.user.length > 0) {
        res.data.user.map((element) => {
          englead_arr.push({
            value: element.Id,
            label: element.FirstName + " " + element.LastName,
          });
        });
      }
      setManagerList(englead_arr);
    });
    const currentDate = new Date();
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (currentDate - firstDayOfYear) / (24 * 60 * 60 * 1000);
    const currentWeek = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    currentWeekPara.currentWeek = currentWeek;
    currentWeekPara.currentMonth = currentDate.getMonth();
    currentWeekPara.currentYear = currentDate.getFullYear();
    setcurrentWeekPara(currentWeekPara);
    apiClient
      .post("master/getAddProjectFilter")
      .then((res) => {
        const clientarr = [];
        res.data.client.forEach((element) => {
          clientarr.push({ value: element.Id, label: element.Name });
        });
        setclientList(clientarr);

        //engagement Leader

        //Capability
        const arr = [];
        res.data.capability.forEach((element) => {
          arr.push({ value: element.Id, label: element.Name });
        });
        setcapabilityList(arr);

        //Project Status Type
        const status_arr = [];
        res.data.projectStatus.forEach((element) => {
          status_arr.push({ value: element.Id, label: element.Name });
        });
        setprojectStatusType(status_arr);
        //Delivery Type
        const delivery_arr = [];
        res.data.deliveryType.forEach((element) => {
          delivery_arr.push({ value: element.Id, label: element.Name });
        });
        setdeliverTypeList(delivery_arr);
        //Engagement Type
        const engag_arr = [];
        res.data.engagementType.forEach((element) => {
          engag_arr.push({ value: element.Id, label: element.Name });
        });
        setengagementTypeList(engag_arr);
        //Tech Stack Type
        const tech_arr = [];
        res.data.techStack.forEach((element) => {
          tech_arr.push({ value: element.Id, label: element.Name });
        });
        settechStackType(tech_arr);
        //Industry
        const industry_arr = [];
        res.data.industry.forEach((element) => {
          industry_arr.push({ value: element.Id, label: element.Name });
        });
        setindustryList(industry_arr);
        //Project Type
        const ptype_arr = [];
        res.data.project_type.forEach((element) => {
          ptype_arr.push({ value: element.Id, label: element.Name });
        });
        setProjectTypeList(ptype_arr);
      })
      .catch((err) => {});

    if (`${location?.state?.project?.id}`) {
      if (`${location?.state?.page}` === "view") {
        setdisabled(true);
        setTitle("View Project");
      } else if (`${location?.state?.page}` === "edit")
        setTitle("Edit Project");
      else return true;

      const changeDateFormat = (pdate) => {
        let dates = new Date(pdate);
        let date = dates.toLocaleString("default", { day: "2-digit" });
        const month = dates.toLocaleString("default", { month: "2-digit" });
        const year = dates.getFullYear();
        const formattedDate = `${year}-${month}-${date}`;
        if (formattedDate !== "Invalid Date" && formattedDate !== "1/1/1970") {
          return formattedDate;
        } else return true;
      };
      apiClient
        .get("/project/" + `${location?.state?.project?.id}`)
        .then((res) => {
          if (res.data.project.length > 0) {
            const result = res.data.project[0];
            editData.id = `${location?.state?.project?.id}`;
            editData.name = result.Name;
            editData.about = result.About;
            editData.headCount = result.HeadCount;
            editData.clientId = result.ClientId;
            editData.leadId = result.leadId;
            editData.capabilityId = result.CapabilityId;
            editData.deliveryTypeId = result.DeliveryTypeId;
            editData.EngagementTypeId = result.EngagmentTypeId;
            editData.projectStatusId = result.ProjectStatusId;
            editData.startDate = changeDateFormat(result.StartDate);
            editData.endDate = changeDateFormat(result.Endate);
            editData.managerId = result.ManagerId;
            editData.IndustryId = result.IndustryId;
            editData.ProjectTypeId = result.ProjectTypeId;
            editData.leadId = 1;

            selectVal.clientId = {
              value: result.ClientId,
              label: result.ClientName,
            };
            selectVal.leadId = {
              value: result.LeadId,
              label: result.EngagementLeaderName,
            };
            selectVal.capabilityId = {
              value: result.CapabilityId,
              label: result.CapabilityName,
            };
            selectVal.deliveryTypeId = {
              value: result.DeliveryTypeId,
              label: result.DeliveryName,
            };
            selectVal.EngagementTypeId = {
              value: result.EngagmentTypeId,
              label: result.EngagementName,
            };
            selectVal.projectStatusType = {
              value: result.ProjectStatusId,
              label: result.ProjectStatusName,
            };
            selectVal.managerId = {
              value: result.ManagerId,
              label: result.ManagerName,
            };
            selectVal.IndustryId = {
              value: result.IndustryId,
              label: result.ClientName,
            };
            selectVal.ProjectTypeId = {
              value: result.ProjectTypeId,
              label: result.ProjectTypeName,
            };
            setSelectVal(selectVal);
            setEditData(editData);
          }
        });
    }

    apiClient
      .get("/project/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          setProjectName(res.data.project[0].Name);
        }
      })
      .catch((err) => {});

    apiClient
      .get("/project/composition/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          const arr = [];
          const tech_stackName = [];
          res.data.project.map((val) => {
            tech_stackName.push(val.TechStackName);
            const obj = {
              id: val.Id,
              technology: { value: val.TechStackId, label: val.TechStackName },
              role: { value: val.Role_Id, label: val.RoleName },
              skill: { value: val.Skill_Id, label: val.SkillName },
              Beginner: val.Beginner,
              intermediate: val.Junior,
              expert: val.Senior,
              specialist: val.Specialist,
            };
            arr.push(obj);
            setTeamComposition(arr);
          });
        }
      });
  }, []);

  useEffect(() => {
    apiClient.get("/lookup/TechStack/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setTechnology(arr);
        });
      }
    });
    apiClient.get("/lookup/Skill/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setSkilList(arr);
        });
      }
    });
    apiClient.get("/lookup/TeamCompositionRole/1").then((response) => {
      const lookupData = response.data.lookup;
      if (Array.isArray(lookupData) && lookupData.length > 0) {
        const arr = lookupData.map((user) => ({
          value: user.Id,
          label: user.Name,
        }));
        setRoleList(arr);
      }
    });
  }, []);
  const handleTeamCompositionChange = (e, i) => {
    const { name, value } = e.target;
    const list = [...teamComposition];
    list[i][name] = value;
    setTeamComposition(list);
  };

  const handleChangeTechnology = (e, i) => {
    const list = [...teamComposition];
    list[i]["technology"] = e;
    setTeamComposition(list);
  };

  const handleChangeRole = (e, i) => {
    const list = [...teamComposition];
    list[i]["role"] = e;
    setTeamComposition(list);
  };

  const handleChangeSkill = (e, i) => {
    const list = [...teamComposition];
    list[i]["skill"] = e;
    setTeamComposition(list);
  };

  const addTeamCompositionChangeClick = () => {
    setTeamComposition([
      ...teamComposition,
      {
        id: "",
        technology: "",
        role: "",
        skill: "",
        Beginner: "",
        intermediate: "",
        expert: "",
        specialist: "",
      },
    ]);
  };

  const removeTeamCompositionChangeClick = (i, id) => {
    if (id) {
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
            .delete("/project/composition/deleteById/" + id)
            .then((res) => {
              handleremove(i);
            })
            .catch((err) => {
              alert("err", "Please Try Again");
            });
        }
      });
    } else {
      handleremove(i);
    }
  };
  function handleremove(i) {
    const list = [...teamComposition];
    list.splice(i, 1);
    setTeamComposition(list);
  }

  function SaveTeamComposition(projectId) {
    const promises = teamComposition.map((val) => {
      return new Promise((resolve, reject) => {
        let data = {};
        data.id = val.id;
        data.projectId = projectId ? projectId : location?.state?.project?.id;
        data.techStackId = val.technology.value;
        data.roleId = val.role.value;
        data.skillId = val.skill.value;
        data.beginner = val.Beginner;
        data.junior = val.intermediate;
        data.senior = val.expert;
        data.specialist = val.specialist;
        data.userId = 1;
  
        const apiRequest = val.id
          ? apiClient.put("/project/composition", data)
          : apiClient.post("/project/composition", data);
  
        apiRequest
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  
    return Promise.all(promises)
      .then((responses) => {
      })
      .catch((errors) => {
      });
  }
    return (
    <>
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
              navigate(Routes.SearchProjectSummary, {
                state: {
                  project: location?.state?.project,
                  week: currentWeekPara,
                },
              });
            }}
          >
            Project Management
          </span>
          <span className="maincontent__breadcrumb--active"> / {title}</span>
        </div>
        <div className="maincontent__card--body">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">{title} DETAILS</h2>
          </div>
          <div className="maincontent__card--content">
            <div>
              <div>
                <Form onKeyDown={handleKeyDown}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <Form.Group id="clientName">
                        <Form.Label>Client Name</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={ClientNameIcon}
                                alt="client name"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={clientList}
                            placeholder=""
                            value={selectVal.clientId}
                            onChange={(e) =>
                              setSelectVal({ ...selectVal, clientId: e })
                            }
                            isDisabled={disabled}
                            onFocus={() => handleInputFocus("clientId")}
                          />
                        </div>
                        {formErrors.clientId && (
                          <div className="text-danger">
                            {formErrors.clientId}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Project Name</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={ProjectNameIcon}
                                alt="project name"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text"
                            value={editData.name}
                            readOnly={disabled}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            onFocus={() => handleInputFocus("name")}
                          />
                        </div>
                        {formErrors.name && (
                          <div className="text-danger">{formErrors.name}</div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="industry">
                        <Form.Label>Project Manager</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={ProjectManagerIcon}
                                alt="project manager"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={ManagerList}
                            placeholder=""
                            value={selectVal.managerId}
                            isDisabled={disabled}
                            onChange={(e) =>
                              setSelectVal({ ...selectVal, managerId: e })
                            }
                            onFocus={() => handleInputFocus("managerId")}
                          />
                        </div>
                        {formErrors.managerId && (
                          <div className="text-danger">
                            {formErrors.managerId}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientEffectiveDate">
                        <Form.Label>Engagement Leader</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={EngagementLeaderIcon}
                                alt="client name"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={leaderList}
                            placeholder=""
                            value={selectVal.leadId}
                            isDisabled={disabled}
                            onChange={(e) =>
                              setSelectVal({ ...selectVal, leadId: e })
                            }
                            onFocus={() => handleInputFocus("leadId")}
                          />
                        </div>
                        {formErrors.leadId && (
                          <div className="text-danger">{formErrors.leadId}</div>
                        )}
                      </Form.Group>
                    </div>
                    <div className="lg:col-span-4 md:col-span-2">
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>About The Project</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editData.about}
                          readOnly={disabled}
                          onChange={(e) => {
                            setEditData({
                              ...editData,
                              about: e.target.value,
                            });
                          }}
                          onFocus={() => handleInputFocus("about")}
                        />
                        {formErrors.about && (
                          <div className="text-danger">{formErrors.about}</div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientEffectiveDate">
                        <Form.Label>Start Date</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={StartDateIcon}
                                alt="start date"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="date"
                            value={editData.startDate}
                            readOnly={disabled}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                startDate: e.target.value,
                              })
                            }
                            onFocus={() => handleInputFocus("startDate")}
                          />
                        </div>
                        {formErrors.startDate && (
                          <div className="text-danger">
                            {formErrors.startDate}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientEffectiveDate">
                        <Form.Label>End Date</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={EndDateIcon}
                                alt="end date"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="date"
                            value={editData.endDate}
                            readOnly={disabled}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                endDate: e.target.value,
                              })
                            }
                            onFocus={() => handleInputFocus("endDate")}
                          />
                        </div>
                        {formErrors.endDate && (
                          <div className="text-danger">
                            {formErrors.endDate}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <Form.Group id="capalitiycode">
                      <Form.Label>Capability</Form.Label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text icon-container">
                            <FontAwesomeIcon icon={faHandFist} />
                          </span>
                        </div>
                        <Select
                          options={capabilityList}
                          placeholder=""
                          value={selectVal.capabilityId}
                          isDisabled={disabled}
                          onChange={(e) =>
                            setSelectVal({ ...selectVal, capabilityId: e })
                          }
                          onFocus={() => handleInputFocus("capabilityId")}
                        />
                      </div>
                      {formErrors.capabilityId && (
                        <div className="text-danger">
                          {formErrors.capabilityId}
                        </div>
                      )}
                    </Form.Group>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Head Count</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={HeadCountIcon}
                                alt="head count"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Form.Control
                            type="number"
                            style={{ fontSize: "16px", color: "black" }}
                            value={editData.headCount}
                            readOnly={disabled}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                headCount: e.target.value,
                              })
                            }
                            required
                            onFocus={() => handleInputFocus("headCount")}
                          />
                        </div>
                        {formErrors.headCount && (
                          <div className="text-danger">
                            {formErrors.headCount}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Delivery Type</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={DeliveryTypeIcon}
                                alt="delivery type"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={deliverTypeList}
                            placeholder=""
                            value={selectVal.deliveryTypeId}
                            isDisabled={disabled}
                            onChange={(e) =>
                              setSelectVal({ ...selectVal, deliveryTypeId: e })
                            }
                            required
                            onFocus={() => handleInputFocus("deliveryTypeId")}
                          />
                        </div>
                        {formErrors.deliveryTypeId && (
                          <div className="text-danger">
                            {formErrors.deliveryTypeId}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Engagement Type</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={EngagementTypeIcon}
                                alt="engagement type"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={engagementTypeList}
                            placeholder=""
                            value={selectVal.EngagementTypeId}
                            isDisabled={disabled}
                            onChange={(e) =>
                              setSelectVal({
                                ...selectVal,
                                EngagementTypeId: e,
                              })
                            }
                            required
                            onFocus={() => handleInputFocus("EngagementTypeId")}
                          />
                        </div>
                        {formErrors.EngagementTypeId && (
                          <div className="text-danger">
                            {formErrors.EngagementTypeId}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Project Type</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={ProjectTypeIcon}
                                alt="project type"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={projectTypeList}
                            isDisabled={disabled}
                            placeholder=""
                            value={selectVal.ProjectTypeId}
                            onChange={(e) =>
                              setSelectVal({ ...selectVal, ProjectTypeId: e })
                            }
                            required
                            onFocus={() => handleInputFocus("ProjectTypeId")}
                          />
                        </div>
                        {formErrors.ProjectTypeId && (
                          <div className="text-danger">
                            {formErrors.ProjectTypeId}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group id="clientCode">
                        <Form.Label>Project Status</Form.Label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text icon-container">
                              <img
                                src={ProjectStatusIcon}
                                alt="project status"
                                className="input-icon"
                              />
                            </span>
                          </div>
                          <Select
                            options={projectStatusType}
                            isDisabled={disabled}
                            placeholder=""
                            value={selectVal.projectStatusType}
                            onChange={(e) =>
                              setSelectVal({
                                ...selectVal,
                                projectStatusType: e,
                              })
                            }
                            required
                          />
                        </div>
                        {formErrors.projectStatusType && (
                          <div className="text-danger">
                            {formErrors.projectStatusType}
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            {location?.state?.page !== "view" ? (
              <>
                <Accordion
                  defaultActiveKey="0"
                  style={{ margin: "20px 0px 30px 0px" }}
                >
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="accordionheader">
                      TEAM COMPOSITION
                    </Accordion.Header>
                    <Accordion.Body
                      className="accordionnew"
                      style={{
                        visibility: "visible",
                        color: "#1658a0",
                        backgroundColor: "aliceblue",
                        padding: "0px",
                      }}
                    >
                      <Card className="accordionnew">
                        <table className="table">
                          <thead>
                            <tr className="bg-[#d7d9e0]">
                              <th style={{ width: "25%" }}>Technology</th>
                              <th style={{ width: "25%" }}>Role</th>
                              <th style={{ width: "25%" }}>Skill</th>
                              <th style={{ width: "5%" }}>Entry</th>
                              <th style={{ width: "5%" }}>Intermediate</th>
                              <th style={{ width: "5%" }}>Expert</th>
                              <th style={{ width: "5%" }}>Specialist</th>
                              <th style={{ width: "5%" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamComposition.length > 0 ? (
                              teamComposition.map((x, i) => {
                                return (
                                  <tr className="team_compos_tab" key={i}>
                                    <td id="team_compos">
                                      <Form.Control
                                        type="hidden"
                                        value={teamComposition[i].id}
                                        name="id"
                                      />
                                      <Select
                                        options={technology}
                                        name="techStackId"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].technology}
                                        onChange={(e) =>
                                          handleChangeTechnology(e, i)
                                        }
                                      />
                                    </td>
                                    <td id="team_compos">
                                      <Select
                                        options={roleList}
                                        name="role"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].role}
                                        onChange={(e) => handleChangeRole(e, i)}
                                      />
                                    </td>
                                    <td id="team_compos">
                                      <Select
                                        options={skilList}
                                        name="skill"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].skill}
                                        onChange={(e) =>
                                          handleChangeSkill(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        id="team_compos"
                                        readOnly={disabled}
                                        name="Beginner"
                                        type="number"
                                        value={teamComposition[i].Beginner}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        id="team_compos"
                                        readOnly={disabled}
                                        name="intermediate"
                                        value={teamComposition[i].intermediate}
                                        type="number"
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        id="team_compos"
                                        type="number"
                                        readOnly={disabled}
                                        name="expert"
                                        value={teamComposition[i].expert}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        id="team_compos"
                                        type="number"
                                        readOnly={disabled}
                                        name="specialist"
                                        value={teamComposition[i].specialist}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    {location?.state?.page !== "view" ? (
                                      <td>
                                        {teamComposition.length !== 1 && (
                                          <Button
                                            className="bg-[#050346] hover:bg[#050346] p-1"
                                            variant="danger"
                                            onClick={() =>
                                              removeTeamCompositionChangeClick(
                                                i,
                                                teamComposition[i].id
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon icon={faMinus} />
                                          </Button>
                                        )}
                                        {teamComposition.length - 1 === i && (
                                          <Button
                                            variant="info"
                                            className="bg-[#050346] hover:bg-[#050346] p-1"
                                            onClick={
                                              addTeamCompositionChangeClick
                                            }
                                          >
                                            <FontAwesomeIcon icon={faPlus} />
                                          </Button>
                                        )}
                                      </td>
                                    ) : null}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <h3>
                                    Team Composition not available or not
                                    entered.
                                  </h3>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Card>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            ) : location?.state?.page === "view" ? (
              <>
                <Accordion
                  defaultActiveKey="0"
                  style={{ margin: "20px 0 30px 0" }}
                >
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="accordionheader">
                      TEAM COMPOSITION
                    </Accordion.Header>
                    <Accordion.Body
                      className="accordionnew"
                      style={{
                        visibility: "visible",
                        color: "#1658a0",
                        backgroundColor: "aliceblue",
                      }}
                    >
                      <Card>
                        <table className="table">
                          <thead>
                            <tr className="bg-[#d7d9e0]">
                              <th style={{ width: "25%" }}>Technology</th>
                              <th style={{ width: "25%" }}>Role</th>
                              <th style={{ width: "25%" }}>Skill</th>
                              <th style={{ width: "5%" }}>Entry</th>
                              <th style={{ width: "5%" }}>Intermediate</th>
                              <th style={{ width: "5%" }}>Expert</th>
                              <th style={{ width: "5%" }}>Specialist</th>
                              <th style={{ width: "20%" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamComposition.some(
                              (item) =>
                                item.technology !== "" ||
                                item.role !== "" ||
                                item.skill !== "" ||
                                item.Beginner !== "" ||
                                item.intermediate !== "" ||
                                item.expert !== "" ||
                                item.specialist !== ""
                            ) ? (
                              teamComposition.map((x, i) => {
                                return (
                                  <tr className="team_compos_tab" key={i}>
                                    <td>
                                      <Form.Control
                                        type="hidden"
                                        value={teamComposition[i].id}
                                        name="id"
                                      />
                                      <Select
                                        options={technology}
                                        name="techStackId"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].technology}
                                        onChange={(e) =>
                                          handleChangeTechnology(e, i)
                                        }
                                      />
                                    </td>
                                    <td>
                                      <Select
                                        options={roleList}
                                        name="role"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].role}
                                        onChange={(e) => handleChangeRole(e, i)}
                                      />
                                    </td>
                                    <td>
                                      <Select
                                        options={skilList}
                                        name="skill"
                                        isDisabled={disabled}
                                        placeholder=""
                                        value={teamComposition[i].skill}
                                        onChange={(e) =>
                                          handleChangeSkill(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        readOnly={disabled}
                                        name="Beginner"
                                        type="number"
                                        value={teamComposition[i].Beginner}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        readOnly={disabled}
                                        name="intermediate"
                                        value={teamComposition[i].intermediate}
                                        type="number"
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        type="number"
                                        readOnly={disabled}
                                        name="expert"
                                        value={teamComposition[i].expert}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    <td
                                      id="team_compos"
                                      style={{ width: "5%" }}
                                    >
                                      <Form.Control
                                        min={0}
                                        type="number"
                                        readOnly={disabled}
                                        name="specialist"
                                        value={teamComposition[i].specialist}
                                        onChange={(e) =>
                                          handleTeamCompositionChange(e, i)
                                        }
                                      />
                                    </td>
                                    {location?.state?.page === "edit" ? (
                                      <td>
                                        {teamComposition.length !== 1 && (
                                          <Button
                                            style={{
                                              padding: "4px",
                                              backgroundColor: "#fa5252",
                                            }}
                                            variant="danger"
                                            onClick={() =>
                                              removeTeamCompositionChangeClick(
                                                i,
                                                teamComposition[i].id
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon icon={faMinus} />
                                          </Button>
                                        )}
                                        {teamComposition.length - 1 === i && (
                                          <Button
                                            style={{
                                              padding: "4px",
                                              marginLeft: "4px",
                                              backgroundColor: "#073686",
                                            }}
                                            variant="info"
                                            onClick={
                                              addTeamCompositionChangeClick
                                            }
                                          >
                                            <FontAwesomeIcon icon={faPlus} />
                                          </Button>
                                        )}
                                      </td>
                                    ) : null}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <h3>
                                    Team Composition not available or not
                                    entered.
                                  </h3>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Card>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Row className="">
                  <Col md={4}></Col>
                  <Col md={4}></Col>
                  <Col md={4} className="d-flex justify-content-end">
                    <Button
                      className="maincontent__btn maincontent__btn--primaryblue"
                      style={{ marginRight: "4px" }}
                      onClick={() => {
                        navigate(Routes.SearchProjectSummary);
                      }}
                    >
                      Back
                    </Button>
                  </Col>
                </Row>
              </>
            ) : null}

            {disabled ? null : (
              <div className="flex justify-center gap-4 mt-8 lg:justify-end">
                <button
                  onClick={saveProject}
                  disabled={saveDisabled}
                  className="maincontent__btn maincontent__btn--primaryblue"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    navigate(Routes.SearchProjectSummary);
                  }}
                  className="maincontent__btn maincontent__btn--primaryblue space_btn"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(AddProject);
