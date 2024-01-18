import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Accordion,
  Table,
  Form,
} from "@themesberg/react-bootstrap";
import Select from "react-select";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import FileImgIcon from "../../components/FileImgIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faFileEdit,
  faDesktopAlt,
  faLayerGroup,
  faCalendarAlt,
  faFlag,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import apiClient from "../../common/http-common";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Routes } from "../../routes";
import { ddmmyyyyFormat, yyyymmdd } from "../../common/Helper";
import { connect } from "react-redux";

const EditProjectStatus = (state) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [redimage, setRedImage] = useState([]);
  const [blueimage, setBlueImage] = useState([]);
  const [currentWeekPara, setcurrentWeekPara] = useState({
    currentWeek: "",
    currentMonth: "",
    currentYear: "",
  });
  const [projectDetails, setProjectDetails] = useState({
    Id: "",
    HeadCount: "",
    OpenDemand: "",
    StatusDate: "",
    RagStatus: "",
    GoGreenPlan: "",
    StatusUpdate: "",
    Accomplishment: "",
    ValueAddsInvovation: "",
    PotentialGrowth: "",
  });
  const [selectVal, setSelectVal] = useState({
    RagStatus: "",
  });
  const [isDisabled, setdisabled] = useState(false);
  const [archivalToggle, setArchivalToggle] = useState(true);
  const [clientCode, setClientCode] = useState();
  const [tableData, setTableData] = useState([]);
  const [teamComposition, setTeamComposition] = useState([]);
  const [ragStatusList, setRagStatusList] = useState([]);
  const [ragTypeList, setRagTypeList] = useState([]);
  const [techStackName, setTechStackName] = useState([]);
  const [goGreen, setGoGreen] = useState(false);
  const [thisWeekId, setThisWeek] = useState();
  const [ownerList, setOwnerList] = useState([]);
  const [impactList, setImpactList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [clientPocList, setclientPocList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [viewRaid, setViewRaid] = useState(false);

  const [raidData, setRaidData] = useState([
    {
      id: "",
      projectWeekId: "",
      raidTypeId: "",
      desc: "",
      mitigation: "",
      raidOwnerId: "",
      raidImpactId: "",
      raisedDate: "",
      targetDate: "",
      raidStatusId: "",
    },
  ]);

  const addRaidDataRow = () => {
    setRaidData([
      ...raidData,
      {
        id: "",
        projectWeekId: "",
        raidTypeId: "",
        desc: "",
        mitigation: "",
        raidOwnerId: "",
        raidImpactId: "",
        raisedDate: "",
        targetDate: "",
        raidStatusId: "",
      },
    ]);
  };
  const removeRaidDataRow = (i, id) => {
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
            .delete("/project/projectraid/" + id)
            .then((res) => {
              handleremove(i);
              Alert("succ", "Project RAID deleted successfully");
            })
            .catch((err) => {
              Alert("error", "Please Try Again");
            });
        }
      });
    } else {
      handleremove(i);
    }
  };
  function handleremove(i) {
    const list = [...raidData];
    list.splice(i, 1);
    setRaidData(list);
  }

  const handleChangeRaid = (e, i) => {
    const { name, value } = e.target;
    const list = [...raidData];
    list[i][name] = value;
    setRaidData(list);
  };

  const addRaidRow = () => {
    setRaidData([
      ...raidData,
      {
        id: "",
        projectWeekId: projectDetails.Id,
        raidTypeId: "",
        desc: "",
        mitigation: "",
        raidOwnerId: "",
        raidImpactId: "",
        raisedDate: "",
        targetDate: "",
        raidStatusId: "",
      },
    ]);
  };
  const changeRaidType = (e, i) => {
    const list = [...raidData];
    list[i]["raidTypeId"] = e;
    setRaidData(list);
  };
  const changeRaidOwner = (e, i) => {
    const list = [...raidData];
    list[i]["raidOwnerId"] = e;
    setRaidData(list);
  };
  const changeRaidImpact = (e, i) => {
    const list = [...raidData];
    list[i]["raidImpactId"] = e;
    setRaidData(list);
  };
  const changeRaidStatus = (e, i) => {
    const list = [...raidData];
    list[i]["raidStatusId"] = e;
    setRaidData(list);
  };
  const SaveRaidRow = (i) => {
    let data = {
      id: raidData[i].id,
      projectId: location?.state?.project?.id,
      projectWeekId: raidData[i].projectWeekId
        ? raidData[i].projectWeekId
        : projectDetails.Id,
      raidTypeId: raidData[i].raidTypeId.value,
      desc: raidData[i].desc,
      mitigation: raidData[i].mitigation,
      raidOwnerId: raidData[i].raidOwnerId.value,
      raidImpactId: raidData[i].raidImpactId.value,
      raisedDate: raidData[i].raisedDate,
      targetDate: raidData[i].targetDate,
      raidStatusId: raidData[i].raidStatusId.value,
      userId: 1,
    };
    apiClient
      .post("/project/projectraid", data)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  };

  const [redFlags, setRedFlags] = useState({
    id: "",
    date: "",
    client_poc: "",
    client_designation: "",
    recipient: "",
    summary: "",
  });

  const [blueFlags, setBlueFlags] = useState({
    id: "",
    date: "",
    client_poc: "",
    client_designation: "",
    recipient: "",
    summary: "",
  });

  function SaveProjectStatus() {
    setdisabled(true);
    let param = {
      id: projectDetails.Id,
      projectId: location?.state?.project?.id,
      headCount: projectDetails.HeadCount,
      openDemand: projectDetails.OpenDemand,
      date: projectDetails.StatusDate,
      week: currentWeekPara.currentWeek,
      year: currentWeekPara.currentYear,
      month: currentWeekPara.currentMonth,
      ragStatusId: selectVal.RagStatus.value,
      goGreenPlan: projectDetails.GoGreenPlan,
      statusUpdate: projectDetails.StatusUpdate,
      accomplishment: projectDetails.Accomplishment,
      valueAds: projectDetails.ValueAddsInvovation,
      potentialGrowth: projectDetails.PotentialGrowth,
      userId: 1,
    };
    apiClient
      .post("project/projectweek", param)
      .then((res) => {
        projectDetails.Id = res.data.weekId;
        setProjectDetails(projectDetails);
        if (projectDetails.Id) {
          raidData.map((row, i) => {
            SaveRaidRow(i);
          });
        }
        setTimeout(() => {
          if (!projectDetails.Id) projectweekHistory();
          getRaidDataList();
          SaveRedFlag();
          SaveBlueFlag();
          Alert("succ", "Project Status Updated");
          setdisabled(false);
        }, 3000);
        navigate(Routes.SearchProjectSummary)
      })
      .catch((err) => {
        setdisabled(false);
        Alert("err", "Please Try Again");
      });
  }

  function projectweekHistory() {
    let projectWeekPara = {
      id: location?.state?.project?.id,
      userId: null,
      Week: currentWeekPara.currentWeek,
      Year: currentWeekPara.currentYear,
      projectWeek: thisWeekId,
    };
    apiClient
      .post("/project/projectweekHistory", projectWeekPara)
      .then((res) => {
        if (res.data.project.length > 0) {
          const result = res.data.project[0];
          projectDetails.Id = result.Id;
          projectDetails.HeadCount = result.HeadCount;
          projectDetails.OpenDemand = result.OpenDemand;
          projectDetails.StatusDate = ddmmyyyyFormat(result.Date);
          projectDetails.GoGreenPlan = result.GoGreenPlan;
          projectDetails.RagStatus = result.RagStatusId;
          projectDetails.StatusUpdate = result.StatusUpdate;
          projectDetails.Accomplishment = result.Accomplishment;
          projectDetails.ValueAddsInvovation = result.ValueAddsInvovation;
          projectDetails.PotentialGrowth = result.PotentialGrowth;
          selectVal.RagStatus = {
            value: result.RagStatusId,
            label: result.RagStatusName,
          };
          result.RagStatusId == 3 ? setGoGreen(false) : setGoGreen(true);
          setProjectDetails(projectDetails);
          getRaidDataList();
          getRedFlagData();
          getBlueFlagData();
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    const cDate = new Date();
    const dayOfYear = new Date(cDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (cDate - dayOfYear) / (24 * 60 * 60 * 1000);
    const thisWeek = Math.ceil((pastDaysOfYear + dayOfYear.getDay() + 1) / 7);
    setThisWeek(thisWeek);
    currentWeekPara.currentWeek = location?.state?.week?.currentWeek;
    currentWeekPara.currentMonth = location?.state?.week?.currentMonth;
    currentWeekPara.currentYear = location?.state?.week?.currentYear;
    setProjectName(location?.state?.project.Name);
    setcurrentWeekPara(currentWeekPara);
    let projectWeekPara = {
      id: location?.state?.project?.id,
      userId: null,
      Week: currentWeekPara.currentWeek,
      Year: currentWeekPara.currentYear,
    };
    projectDetails.StatusDate = getStartDateOf(
      location?.state?.week?.currentWeek,
      location?.state?.week?.currentYear
    );
    setProjectDetails(projectDetails);
    getRaidDataList();
    apiClient
      .post("/project/projectweekHistory", projectWeekPara)
      .then((res) => {
        if (res.data.project.length > 0) {
          const result = res.data.project[0];
          projectDetails.Id = result.Id;
          projectDetails.HeadCount = result.HeadCount;
          projectDetails.OpenDemand = result.OpenDemand;
          projectDetails.StatusDate = getStartDateOf(
            location?.state?.week?.currentWeek,
            location?.state?.week?.currentYear
          );
          projectDetails.GoGreenPlan = result.GoGreenPlan;
          projectDetails.RagStatus = result.RagStatusId;
          projectDetails.StatusUpdate = result.StatusUpdate;
          projectDetails.Accomplishment = result.Accomplishment;
          projectDetails.ValueAddsInvovation = result.ValueAddsInvovation;
          projectDetails.PotentialGrowth = result.PotentialGrowth;
          selectVal.RagStatus = {
            value: result.RagStatusId,
            label: result.RagStatusName,
          };
          result.RagStatusId == 3 ? setGoGreen(false) : setGoGreen(true);
          setProjectDetails(projectDetails);
          getRedFlagData();
          getBlueFlagData();
        }
      })
      .catch((err) => {});
    let param = {
      id: location?.state?.project?.id,
      userId: null,
      Week: null,
      projectWeek: thisWeek,
      Year: null,
    };

    apiClient
      .get("/project/composition/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          const arr = [];
          const tech_stackName = [];
          res.data.project.map((val) => {
            tech_stackName.push(val.TechStackName);
            arr.push(val);
            setTeamComposition(arr);
            setTechStackName(tech_stackName);
          });
        }
      });

    apiClient.get("/lookup/Designation/1").then((res) => {
      if (res.data.lookup.length > 0) {
        const arr_design = [];
        res.data.lookup.map((val) => {
          arr_design.push({ value: val.Id, label: val.Name });
          setDesignationList(arr_design);
        });
      }
    });

    apiClient.post("/client/search").then((res) => {
      if (res.data.client.length > 0) {
        const arr_client = [];
        res.data.client.map((val) => {
          arr_client.push({ value: val.Id, label: val.Name });
          setclientPocList(arr_client);
        });
      }
    });

    apiClient
      .post("/project/projectweekHistory", param)
      .then((res) => {
        setTableData(res.data.project);
      })
      .catch((err) => {});

    // Rag Status List
    apiClient.get("/lookup/RagStatus/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setRagStatusList(arr);
        });
      }
    });

    // Raid Type List
    apiClient.get("/lookup/RaidType/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setRagTypeList(arr);
        });
      }
    });

    // Owner Status List
    apiClient.get("/lookup/RaidOwner/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setOwnerList(arr);
        });
      }
    });

    // Impact List
    apiClient.get("/lookup/RaidImpact/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setImpactList(arr);
        });
      }
    });

    // Raid Status List
    apiClient.get("/lookup/RaidStatus/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = [];
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name };
          arr.push(obj);
          setStatusList(arr);
        });
      }
    });
  }, []);
  function getRaidDataList() {
    //Raid Data List
    const id = location?.state?.project?.id;
    apiClient
      .get("/project/projectraid/" + id)
      .then((res) => {
        if (res.data.project.length > 0) {
          let arr = [];
          res.data.project?.map((data, i) => {
            const obj_arr = {
              id: data.Id,
              projectWeekId: data.ProjectWeekId,
              raidTypeId: { value: data.RaidTypeId, label: data.RaidTypeName },
              desc: data.Description,
              mitigation: data.Mitigation,
              raidOwnerId: { value: data.RaidOwnerId, label: data.OwnerName },
              raidImpactId: {
                value: data.RaidImpactId,
                label: data.RaidImpactNam,
              },
              raisedDate: changeStartDateFormat(data.RaisedDate),
              targetDate: changeStartDateFormat(data.TargetDate),
              raidStatusId: {
                value: data.RaidStatusId,
                label: data.RaidStatusName,
              },
            };
            arr.push(obj_arr);
          });
          setRaidData(arr);
          setViewRaid(true);
        }
      })
      .catch((err) => {});
  }
  function getRedFlagData() {
    let param = {
      id: null,
      projectId: location?.state?.project?.id,
      projectWeekId: projectDetails.Id,
      FlagType: 1,
      userId: 1,
    };
    apiClient
      .post("/project/getprojectFlag", param)
      .then((res) => {
        if (res.data.project.length > 0) {
          const result = res.data.project[0];
          let redfg = {};
          redfg.id = result.Id;
          redfg.date = yyyymmdd(result.Date);
          redfg.client_poc = {
            value: result.Client_Poc,
            label: result.ClientName,
          };
          redfg.client_designation = {
            value: result.Designation_Id,
            label: result.DesignationName,
          };
          redfg.recipient = result.Recipient_Id;
          redfg.summary = result.Summary;
          setRedFlags(redfg);
        }
      })
      .catch((err) => {});
  }

  function getBlueFlagData() {
    let param = {
      id: null,
      projectId: location?.state?.project?.id,
      projectWeekId: projectDetails.Id,
      FlagType: 2,
      userId: 1,
    };
    apiClient
      .post("/project/getprojectFlag", param)
      .then((res) => {
        if (res.data.project.length > 0) {
          const result = res.data.project[0];
          let bluefg = {};
          bluefg.id = result.Id;
          bluefg.date = yyyymmdd(result.Date);
          bluefg.client_poc = {
            value: result.Client_Poc,
            label: result.ClientName,
          };
          bluefg.client_designation = {
            value: result.Designation_Id,
            label: result.DesignationName,
          };
          bluefg.recipient = result.Recipient_Id;
          bluefg.summary = result.Summary;
          setBlueFlags(bluefg);
        }
      })
      .catch((err) => {});
  }
  function SaveRedFlag() {
    if (projectDetails.Id && redFlags.client_poc) {
      let data = {
        id: redFlags.id,
        projectId: location?.state?.project?.id,
        projectWeekId: projectDetails.Id,
        FlagType: 1,
        Date: redFlags.date,
        clientPoc: redFlags.client_poc.value,
        designationId: redFlags.client_designation.value,
        recipient: redFlags.recipient,
        summary: redFlags.summary,
        redimage: redFlags.redimage,
        userId: 1,
      };

      apiClient
        .post("/project/projectflag", data)
        .then((response) => {
          if (location?.state?.project?.id) {
            setTimeout(() => {
              if (redimage.length > 0) {
                let formData = new FormData();
                formData.append("image", redimage[0]);
                formData.append("attachmentTypeId", 2);
                formData.append("projectId", location?.state?.project?.id);
                formData.append("userId", 1);
                getRedFlagData();
                axios.post(
                  "http://3.7.92.74:8000/api/v1/project/attachment",
                  formData
                );
              }
            }, 0);
          }
        })
        .catch((err) => {
          Alert("error", "Please Try Again");
        });
    }
  }

  function SaveBlueFlag() {
    if (projectDetails.Id && blueFlags.client_poc) {
      let data = {
        id: blueFlags.id,
        projectId: location?.state?.project?.id,
        projectWeekId: projectDetails.Id,
        FlagType: 2,
        Date: blueFlags.date,
        clientPoc: blueFlags.client_poc.value,
        designationId: blueFlags.client_designation.value,
        recipient: blueFlags.recipient,
        summary: blueFlags.summary,
        blueimage: blueFlags.blueimage,
        userId: 1,
      };

      apiClient
        .post("/project/projectflag", data)
        .then((response) => {
          if (location?.state?.project?.id) {
            setTimeout(() => {
              if (blueimage.length > 0) {
                let formData = new FormData();
                formData.append("image", blueimage[0]);
                formData.append("attachmentTypeId", 1);
                formData.append("projectId", location?.state?.project?.id);
                formData.append("userId", 1);
                getBlueFlagData();
                axios.post(
                  "http://3.7.92.74:8000/api/v1/project/attachment",
                  formData
                );
              }
            }, 0);
          }
        })
        .catch((error) => {
          Alert("error", "Please try again.");
        });
    }
  }
  function getStartDateOfWeek(weekNumber, pyear) {
    if (weekNumber) {
      const startDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7);
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }

  function getStartDateOf(weekNumber, pyear) {
    if (weekNumber) {
      const startDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7);
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      return `${year}-${month}-${day}`;
    }
  }

  function changeStartDateFormat(pdate) {
    let dates = new Date(pdate);
    let date = dates.toLocaleString("default", { day: "2-digit" });
    const month = dates.toLocaleString("default", { month: "2-digit" });
    const year = dates.getFullYear();
    const formattedDate = `${year}-${month}-${date}`;
    if (formattedDate !== "Invalid Date" && formattedDate !== "1970-01-01")
      return formattedDate;
    else return true;
  }

  const columns = [
    {
      name: "Head Count",
      selector: (param) => param.HeadCount,
      sortable: true,
    },
    {
      name: "WSR EFFECTIVE DATE",
      selector: (param) => ddmmyyyyFormat(param.Date),
      sortable: true,
    },
    {
      name: "START DATE",
      selector: (param) => getStartDateOfWeek(param.Week, param.Year),
      sortable: true,
    },
    {
      name: "END DATE",
      selector: (param) => getEndDateOfWeek(param.Week, param.Year),
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (param) => (
        <>
          {param.RagStatusId == 1 ? (
            <div className="dashboard-bar cancel_bar"></div>
          ) : param.RagStatusId == 2 ? (
            <div className="dashboard-bar active_bar"></div>
          ) : (
            <div className="dashboard-bar complete_bar"></div>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "UPDATE DATE",
      selector: (param) => ddmmyyyyFormat(param.ModifiedAt),
      sortable: true,
    },
    {
      name: "UPDATED BY",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true,
    },
  ];
  function getEndDateOfWeek(weekNumber, pyear) {
    if (weekNumber) {
      const endDate = new Date(pyear, 0, 1 + (weekNumber - 1) * 7 + 6);
      const month = String(endDate.getMonth() + 1).padStart(2, "0");
      const day = String(endDate.getDate()).padStart(2, "0");
      const year = endDate.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
  const onchangehanldeRagStatus = (e) => {
    e.value == 3 ? setGoGreen(false) : setGoGreen(true);
    setSelectVal({ ...selectVal, RagStatus: e });
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
            navigate(Routes.SearchProjectSummary, {
              state: {
                project: location?.state?.project,
                week: currentWeekPara,
              },
            });
          }}
        >
          Project Management{" "}
        </span>
        <span className="maincontent__breadcrumb--active">
          {" "}
          / Edit Project Status
        </span>
      </div>
      <div>
        <div className="mt-4 maincontent__card--header">
          <h2
            className="maincontent__card--header-title"
            style={{ display: "inline-block" }}
          >
            PROJECT DETAILS
          </h2>
          <h2
            className="maincontent__card--header-title"
            style={{
              display: "inline-block",
              float: "right",
              padding: "6px 10px 0 0",
            }}
          >
            {projectName.toUpperCase()}
          </h2>
        </div>
        <Card border="light" className="bg-white shadow-sm mb-4 px-4">
          <Row style={{ width: "100%", display: "inline-flex" }}>
            <Col md={4} className="mb-3" style={{ width: "20%" }}>
              <Form.Group id="clientName">
                <Form.Label>Head Count</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon icon={faFileEdit} />
                    </span>
                  </div>
                  <Form.Control
                  required
                    min={0}
                    max={3}
                    type="number"
                    value={projectDetails.HeadCount}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        HeadCount: e.target.value,
                      })
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3" style={{ width: "20%" }}>
              <Form.Group id="clientName">
                <Form.Label>Open Demand</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon icon={faDesktopAlt} />
                    </span>
                  </div>
                  <Form.Control
                    min={0}
                    max={3}
                    type="number"
                    value={projectDetails.OpenDemand}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        OpenDemand: e.target.value,
                      })
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3" style={{ width: "20%" }}>
              <Form.Group id="clientCode">
                <Form.Label>Tech Stack</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon icon={faLayerGroup} />
                    </span>
                  </div>
                  <Form.Control
                    readOnly={true}
                    type="text"
                    value={techStackName}
                    onChange={(e) => setClientCode(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3" style={{ width: "20%" }}>
              <Form.Group id="clientEffectiveDate">
                <Form.Label>Status Date</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                  </div>
                  <Form.Control
                    required
                    type="date"
                    readOnly={true}
                    value={projectDetails.StatusDate}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        StatusDate: e.target.value,
                      })
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3" style={{ width: "20%" }}>
              <Form.Group id="industry">
                <Form.Label>RAG Status</Form.Label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text icon-container">
                      <FontAwesomeIcon icon={faFlag} />
                    </span>
                  </div>
                  <Select
                    options={ragStatusList}
                    placeholder=""
                    value={selectVal.RagStatus}
                    onChange={(e) => onchangehanldeRagStatus(e)}
                    styles={{ fontSize: "12px" }}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          {goGreen ? (
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Go TO Green Plan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={projectDetails.GoGreenPlan}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        GoGreenPlan: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          ) : null}
          <Row>
            <p>Project Status Summary (RAG Update)</p>
            <Col md={12} className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={projectDetails.StatusUpdate}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    StatusUpdate: e.target.value,
                  })
                }
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Label>Accomplishments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectDetails.Accomplishment}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    Accomplishment: e.target.value,
                  })
                }
              />
            </Col>
            <Col md={4}>
              <Form.Label>Values Adds / Innovations</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectDetails.ValueAddsInvovation}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    ValueAddsInvovation: e.target.value,
                  })
                }
              />
            </Col>
            <Col md={4} className="mb-2">
              <Form.Label>Potential Growth Plan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectDetails.PotentialGrowth}
                onChange={(e) =>
                  setProjectDetails({
                    ...projectDetails,
                    PotentialGrowth: e.target.value,
                  })
                }
              />
            </Col>
          </Row>
        </Card>

        <Row style={{ margin: "0px", padding: "0px" }}>
          {viewRaid || projectDetails.Id ? (
            <>
              <Accordion
                defaultActiveKey="0"
                style={{ marginTop: "10px", padding: "0px" }}
              >
                <Accordion.Item eventKey="1">
                  <Accordion.Header
                    className="accordionheader"
                    style={{
                      color: "white",
                      borderRadius: "10px",
                      fontWeight: "600",
                    }}
                  >
                    RAID
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{
                      visibility: "visible",
                      color: "#1658a0",
                      padding: "10px 10px",
                    }}
                  >
                    <Row
                      style={{
                        height: "200px",
                        overflow: "auto",
                        margin: "0px",
                        padding: "0px",
                      }}
                    >
                      <Table className="raids_table">
                        <thead style={{ position: "relative", zIndex: "2" }}>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Type
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Description
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Mitigation
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Owner
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Impact
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Raise Date
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Target Date
                          </th>
                          <th
                            className="raidtableth"
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              position: "sticky",
                              top: "0",
                              backgroundColor: "white",
                            }}
                          ></th>
                        </thead>
                        <tbody>
                          {raidData?.map((data, i) => (
                            <tr key={i}>
                              <td style={{ width: "13%" }}>
                                <Select
                                  options={ragTypeList}
                                  onChange={(e) => changeRaidType(e, i)}
                                  value={data.raidTypeId}
                                  placeholder=""
                                />
                              </td>
                              <td style={{ width: "13%" }}>
                                <Form.Control
                                  style={{ fontSize: "12px" }}
                                  as="textarea"
                                  rows={1}
                                  name="desc"
                                  className=""
                                  value={data.desc}
                                  onChange={(e) => handleChangeRaid(e, i)}
                                />
                              </td>
                              <td style={{ width: "13%" }}>
                                <Form.Control
                                  style={{ fontSize: "12px" }}
                                  type="text"
                                  name="mitigation"
                                  className="raidtable"
                                  value={data.mitigation}
                                  onChange={(e) => handleChangeRaid(e, i)}
                                />
                              </td>
                              <td style={{ width: "13%" }}>
                                <Select
                                  options={ownerList}
                                  onChange={(e) => changeRaidOwner(e, i)}
                                  value={data.raidOwnerId}
                                  placeholder=""
                                />
                              </td>
                              <td style={{ width: "10%" }}>
                                <Select
                                  options={impactList}
                                  onChange={(e) => changeRaidImpact(e, i)}
                                  value={data.raidImpactId}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                <Form.Control
                                  style={{ width: "105px", fontSize: "12px" }}
                                  name="raisedDate"
                                  type="date"
                                  value={data.raisedDate}
                                  onChange={(e) => handleChangeRaid(e, i)}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  style={{ width: "105px", fontSize: "12px" }}
                                  name="targetDate"
                                  type="date"
                                  value={data.targetDate}
                                  onChange={(e) => handleChangeRaid(e, i)}
                                />
                              </td>
                              <td style={{ width: "10%" }}>
                                <Select
                                  options={statusList}
                                  onChange={(e) => changeRaidStatus(e, i)}
                                  value={data.raidStatusId}
                                  placeholder=""
                                />
                              </td>
                              <td>
                                {data.length !== 1 && (
                                  <Button
                                    style={{
                                      padding: "4px",
                                      backgroundColor: "rgb(250 82 82)",
                                    }}
                                    variant="danger"
                                    onClick={() =>
                                      removeRaidDataRow(i, data.id)
                                    }
                                  >
                                    <FontAwesomeIcon icon={faMinus} />
                                  </Button>
                                )}
                                {data.length - 1 === i &&
                                  projectDetails.Id === true && (
                                    <Button
                                      style={{
                                        padding: "4px",
                                        marginLeft: "4px",
                                        backgroundColor: "rgb(9 72 179)",
                                      }}
                                      variant="info"
                                      onClick={addRaidDataRow}
                                    >
                                      <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {projectDetails.Id !== "" && (
                        <Col md={12} style={{ textAlign: "right" }}>
                          <Button
                            variant="info"
                            style={{
                              padding: "2px",
                              backgroundColor: "rgb(9 72 179)",
                            }}
                            onClick={addRaidRow}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
          ) : null}

          {projectDetails.Id && (
            <>
              <Accordion
                className="p-0"
                defaultActiveKey="0"
                style={{ marginTop: "10px" }}
              >
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="accordionheader">
                    RED FLAG
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{ visibility: "visible", color: "#1658a0" }}
                  >
                    <div>
                      <Table>
                        <thead>
                          <tr className="bg-[#d7d9e0]">
                            <th className="raidtableth">Date</th>
                            <th className="raidtableth">Client POC</th>
                            <th className="raidtableth">Client Designation</th>
                            <th className="raidtableth">Recipient</th>
                            <th className="raidtableth">Summary</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="status_col">
                              <Form.Control
                                required
                                type="date"
                                style={{
                                  borderRadius: "5px",
                                  height: "43px",
                                }}
                                onChange={(e) =>
                                  setRedFlags({
                                    ...redFlags,
                                    date: e.target.value,
                                  })
                                }
                                value={redFlags.date}
                              />
                            </td>
                            <td className="status_col">
                              <Select
                                options={clientPocList}
                                onChange={(e) =>
                                  setRedFlags({ ...redFlags, client_poc: e })
                                }
                                value={redFlags.client_poc}
                                placeholder=""
                              />
                            </td>
                            <td className="status_col">
                              <Select
                                options={designationList}
                                onChange={(e) =>
                                  setRedFlags({
                                    ...redFlags,
                                    client_designation: e,
                                  })
                                }
                                value={redFlags.client_designation}
                                placeholder=""
                              />
                            </td>
                            <td className="status_col">
                              <Form.Control
                                required
                                type="text"
                                style={{
                                  borderRadius: "5px",
                                  height: "43px",
                                }}
                                onChange={(e) =>
                                  setRedFlags({
                                    ...redFlags,
                                    recipient: e.target.value,
                                  })
                                }
                                value={redFlags.recipient}
                              />
                            </td>
                            <td className="status_col">
                              <Form.Control
                                as="textarea"
                                style={{
                                  width: "215px",
                                  borderRadius: "5px",
                                }}
                                rows={1}
                                value={redFlags.summary}
                                onChange={(e) =>
                                  setRedFlags({
                                    ...redFlags,
                                    summary: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td
                              className="status_col cursor-pointer"
                              style={{ paddingTop: "5px" }}
                            >
                              <FileImgIcon
                                image={redimage}
                                setImage={setRedImage}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <Accordion
                className="p-0"
                defaultActiveKey="0"
                style={{ marginTop: "10px" }}
              >
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="accordionheader">
                    BLUE FLAG
                  </Accordion.Header>
                  <Accordion.Body
                    className="accordionnew"
                    style={{ visibility: "visible", color: "#1658a0" }}
                  >
                    <div>
                      <Table>
                        <thead>
                          <tr className="bg-[#d7d9e0]">
                            <th className="raidtableth">Date</th>
                            <th className="raidtableth">Client POC</th>
                            <th className="raidtableth">Client Designation</th>
                            <th className="raidtableth">Recipient</th>
                            <th className="raidtableth">Summary</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="status_col">
                              <Form.Control
                                required
                                type="date"
                                style={{
                                  borderRadius: "5px",
                                  height: "43px",
                                }}
                                onChange={(e) =>
                                  setBlueFlags({
                                    ...blueFlags,
                                    date: e.target.value,
                                  })
                                }
                                value={blueFlags.date}
                              />
                            </td>
                            <td className="status_col">
                              <Select
                                options={clientPocList}
                                onChange={(e) =>
                                  setBlueFlags({
                                    ...blueFlags,
                                    client_poc: e,
                                  })
                                }
                                value={blueFlags.client_poc}
                                placeholder=""
                              />
                            </td>
                            <td className="status_col">
                              <Select
                                options={designationList}
                                onChange={(e) =>
                                  setBlueFlags({
                                    ...blueFlags,
                                    client_designation: e,
                                  })
                                }
                                value={blueFlags.client_designation}
                                placeholder=""
                              />
                            </td>
                            <td className="status_col">
                              <Form.Control
                                required
                                type="text"
                                style={{
                                  borderRadius: "5px",
                                  height: "43px",
                                }}
                                onChange={(e) =>
                                  setBlueFlags({
                                    ...blueFlags,
                                    recipient: e.target.value,
                                  })
                                }
                                value={blueFlags.recipient}
                              />
                            </td>
                            <td className="status_col">
                              <Form.Control
                                as="textarea"
                                style={{
                                  width: "215px",
                                  maxHeight: "43px",
                                  borderRadius: "5px",
                                }}
                                onChange={(e) =>
                                  setBlueFlags({
                                    ...blueFlags,
                                    summary: e.target.value,
                                  })
                                }
                                value={blueFlags.summary}
                              />
                            </td>
                            <td
                              className="status_col cursor-pointer"
                              style={{ paddingTop: "7px" }}
                            >
                              <FileImgIcon
                                image={blueimage}
                                setImage={setBlueImage}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
          )}

          <Col md={12} className="mb-2" align="center">
            <Button
              onClick={SaveProjectStatus}
              disabled={isDisabled}
              variant="info"
              className="maincontent__btn maincontent__btn--primaryblue"
              style={{ float: "right", margin: "10px 0 0 0" }}
            >
              Update
            </Button>
          </Col>
        </Row>
        <Accordion defaultActiveKey="0" style={{ marginTop: "10px" }}>
          <Accordion.Item eventKey="1">
            <Accordion.Header className="accordionheader">
              ARCHIVAL
            </Accordion.Header>
            <Accordion.Body
              className="accordionnew"
              style={{ visibility: "visible", color: "#1658a0" }}
            >
              {archivalToggle && (
                <Row
                  className="mb-2 rdt_Pagination"
                  style={{ transition: "opacity 0.3s ease" }}
                >
                  <DataTable
                    title=""
                    columns={columns}
                    data={tableData}
                    pagination
                    highlightOnHover
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={5}
                  />
                </Row>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="flex justify-center gap-4 mt-8 lg:justify-end">
          <button
            onClick={() => {
              navigate(Routes.SearchProjectSummary);
            }}
            className="maincontent__btn maincontent__btn--primaryblue space_btn"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(EditProjectStatus);
