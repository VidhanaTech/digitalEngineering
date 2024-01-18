import React, { useEffect } from "react"
import "./AddProject.css"
import {
  Card,
  Button,
  Form,
} from "@themesberg/react-bootstrap"
import Select from "react-select"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus, faHome } from "@fortawesome/free-solid-svg-icons"
import apiClient from "../../common/http-common"
import { useLocation } from "react-router-dom"
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg"

const TeamComposition = () => {
  const location = useLocation()
  const [projectName, setProjectName] = useState("")
  const [technology, setTechnology] = useState([])
  const [skilList, setSkilList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [teamComposition, setTeamComposition] = useState([
    {
      id: "",
      technology: "",
      role: "",
      skill: "",
      Beginner: "",
      intermediate: "",
      expert: "",
      specialist: ""
    }
  ])

  const handleTeamCompositionChange = (e, i) => {
    const { name, value } = e.target
    const list = [...teamComposition]
    list[i][name] = value
    setTeamComposition(list)
  }

  const handleChangeTechnology = (e, i) => {
    const list = [...teamComposition]
    list[i]["technology"] = e
    setTeamComposition(list)
  }

  const handleChangeRole = (e, i) => {
    const list = [...teamComposition]
    list[i]["role"] = e
    setTeamComposition(list)
  }

  const handleChangeSkill = (e, i) => {
    const list = [...teamComposition]
    list[i]["skill"] = e
    setTeamComposition(list)
  }

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
        specialist: ""
      }
    ])
  }

  const removeTeamCompositionChangeClick = (i, id) => {
    if (id) {
      const choice = window.confirm(
        "Are you sure you want to delete this Record completely?"
      )
      if (choice) {
        apiClient
          .delete("/project/composition/deleteById/" + id)
          .then((res) => {
            handleremove(i)
          })
          .catch((err) => {
            alert("err", "Please Try Again")
          })
      }
    } else {
      handleremove(i)
    }
  }
  function handleremove(i) {
    const list = [...teamComposition]
    list.splice(i, 1)
    setTeamComposition(list)
  }
  useEffect(async () => {
    apiClient
      .get("/project/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          setProjectName(res.data.project[0].Name)
        }
      })
      .catch((err) => {
      })

    apiClient
      .get("/project/composition/" + location?.state?.project?.id)
      .then((res) => {
        if (res.data.project.length > 0) {
          const arr = []
          res.data.project.map((val) => {
            const obj = {
              id: val.Id,
              technology: { value: val.TechStackId, label: val.TechStackName },
              role: { value: val.Role_Id, label: val.RoleName },
              skill: { value: val.Skill_Id, label: val.SkillName },
              Beginner: val.Beginner,
              intermediate: val.Junior,
              expert: val.Senior,
              specialist: val.Specialist
            }
            arr.push(obj)
            setTeamComposition(arr)
          })
        }
      })

    apiClient.get("/lookup/TechStack/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = []
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name }
          arr.push(obj)
          setTechnology(arr)
        })
      }
    })
    apiClient.get("/lookup/Skill/1").then((response) => {
      if (response.data.lookup.length > 0) {
        const arr = []
        response.data.lookup.map((user) => {
          const obj = { value: user.Id, label: user.Name }
          arr.push(obj)
          setSkilList(arr)
        })
      }
    })
    apiClient.get("/user/roles/role").then((response) => {
      if (response.data.user.length > 0) {
        const arr = []
        response.data.user.map((user) => {
          const obj = { value: user.Id, label: user.RoleName }
          arr.push(obj)
          setRoleList(arr)
        })
      }
    })
  }, [])
  function SaveTeamComposition() {
    teamComposition.map((val) => {
      let data = {}
      data.id = val.id
      data.projectId = location?.state?.project?.id
      data.techStackId = val.technology.value
      data.roleId = val.role.value
      data.skillId = val.skill.value
      data.beginner = val.Beginner
      data.junior = val.intermediate
      data.senior = val.expert
      data.specialist = val.specialist
      data.userId = 1
      if (val.id) {
        apiClient
          .put("/project/composition", data)
          .then((response) => {
          })
          .catch((err) => {
          })
      } else {
        apiClient
          .post("/project/composition", data)
          .then((response) => {
          })
          .catch((err) => {
          })
      }
    })
  }
  return (
    <>
      <div>
        <div className="flex flex-wrap items-center justify-between md:flex-nowrap">
          <div className="maincontent__breadcrumb">
            <img
              className="cursor_pointer"
              src={HomeOutlineIcon}
              alt="home"
              onClick={() => {
                navigate(Routes.DashboardOverview)
              }}
            />
            <span className="maincontent__breadcrumb--divider">/</span>
            <span>Project Management</span>
            <span className="maincontent__breadcrumb--divider">/</span>
            <span className="maincontent__breadcrumb--active">
              Team Composition
            </span>
          </div>
        </div>
        <div className="mt-4 maincontent__card">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">
              Team Composition
            </h2>
          </div>
          <div className="maincontent__card--content">
            <div className="px-4">
              <Card>
                <table className="table">
                  <thead>
                    <tr className=" bg-sky-50">
                      <th style={{ width: "20%" }}>Technology</th>
                      <th style={{ width: "20%" }}>Role</th>
                      <th style={{ width: "20%" }}>Skill</th>
                      <th style={{ width: "5%" }}>Entry</th>
                      <th style={{ width: "5%" }}>Intermediate</th>
                      <th style={{ width: "5%" }}>Expert</th>
                      <th style={{ width: "5%" }}>Specialist</th>
                      <th style={{ width: "20%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamComposition.map((x, i) => {
                      return (
                        <tr className="align-middle team_compos_tab" key={i}>
                          <td>
                            <Form.Control
                              type="hidden"
                              value={teamComposition[i].id}
                              name="id"
                            />
                            <Select
                              options={technology}
                              name="techStackId"
                              placeholder="Select Technology"
                              value={teamComposition[i].technology}
                              onChange={(e) => handleChangeTechnology(e, i)}
                            />
                          </td>
                          <td>
                            <Select
                              options={roleList}
                              name="role"
                              placeholder="Select Role"
                              value={teamComposition[i].role}
                              onChange={(e) => handleChangeRole(e, i)}
                            />
                          </td>
                          <td>
                            <Select
                              options={skilList}
                              name="skill"
                              placeholder="Select Skill"
                              value={teamComposition[i].skill}
                              onChange={(e) => handleChangeSkill(e, i)}
                            />
                          </td>
                          <td style={{ width: "5%" }}>
                            <Form.Control
                              min={0}
                              name="Beginner"
                              type="number"
                              value={teamComposition[i].Beginner}
                              onChange={(e) =>
                                handleTeamCompositionChange(e, i)
                              }
                            />
                          </td>
                          <td style={{ width: "5%" }}>
                            <Form.Control
                              min={0}
                              name="intermediate"
                              value={teamComposition[i].intermediate}
                              type="number"
                              onChange={(e) =>
                                handleTeamCompositionChange(e, i)
                              }
                            />
                          </td>
                          <td style={{ width: "5%" }}>
                            <Form.Control
                              min={0}
                              type="number"
                              name="expert"
                              value={teamComposition[i].expert}
                              onChange={(e) =>
                                handleTeamCompositionChange(e, i)
                              }
                            />
                          </td>
                          <td style={{ width: "5%" }}>
                            <Form.Control
                              min={0}
                              type="number"
                              name="specialist"
                              value={teamComposition[i].specialist}
                              onChange={(e) =>
                                handleTeamCompositionChange(e, i)
                              }
                            />
                          </td>
                          <td>
                            {teamComposition.length !== 1 && (
                              <Button
                                style={{ padding: "4px" }}
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
                                style={{ padding: "4px", marginLeft: "4px" }}
                                variant="info"
                                onClick={addTeamCompositionChangeClick}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button className="maincontent__btn maincontent__btn--primaryblue">
                Back
              </button>
              <button
                className="maincontent__btn maincontent__btn--primaryblue"
                onClick={SaveTeamComposition}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeamComposition
