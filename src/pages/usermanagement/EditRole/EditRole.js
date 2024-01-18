import React, { useEffect, useState } from "react"
import apiClient from "../../../common/http-common"
import DataTable from "react-data-table-component"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Modal, Card, Form, Accordion } from "@themesberg/react-bootstrap"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Alert } from "../../../components/Alert"
import { Routes } from "../../../routes"
import HomeOutlineIcon from "../../../assets/img/icons/home-outline-icon.svg"
import Select from "react-select"
import { connect } from "react-redux"

const EditRole = (state) => {
  const [Rname, setRname] = useState("")
  const [Rdes, setRdes] = useState("")
  const [ModuleTabData, setModuleTabData] = useState([])
  const [moduleTabList, setModuleTabListData] = useState([])
  let [UserTabData, setUserTabData] = useState([])
  const [addModuleTabData, setAddModuleTabData] = useState([])
  const [addUserTabData, setAddUserTabData] = useState([])
  const [ShowDef, setShowDef] = useState(false)
  const [showDefault, setShowDefault] = useState(false)
  const [isdisabled, setIsdisabled] = useState(false)
  const handleClose = () => (setShowDefault(false), setShowDef(false))
  const navigate = useNavigate()
  const location = useLocation()
  const [getrows, setgetrows] = useState([])
  const [getusers, setgetusers] = useState([])
  const [defaultlPage, setdefaultlPage] = useState({})

  const AddModulePermission = (param) => {
    setgetrows(param.selectedRows)
  }

  const postModulePermission = (obj) => {
    if (getrows.length > 0) {
      let err = 0
      getrows.map((data, i) => {
        let params = {
          roleId: location?.state?.id?.Id,
          moduleId: data.id,
          userId: "1"
        }
        apiClient
          .post("user/roles/module", params)
          .then((res) => {})
          .catch((error) => {
            err++
          })
      })
      if (err) Alert("error", "Please Try Again!..")
      else Alert("succ", "Module Updated")
      setTimeout(() => {
        fetchModuleData()
      }, 2000)
      handleClose()
    } else Alert("warn", "Atleast Please Choose One Module")
  }

  const AddUsers = (param) => {
    setgetusers(param.selectedRows)
  }

  const postUsers = (obj) => {
    if (getusers.length > 0) {
      let err = 0
      getusers.map((data, i) => {
        let params = {
          roleId: location?.state?.id?.Id,
          userId: data.Id
        }

        apiClient
          .post("/user/role", params)
          .then((res) => {})
          .catch((error) => {
            err++
          })
      })
      if (err) Alert("error", "Please Try Again!..")
      else {
        Alert("succ", "User Updated")
        setTimeout(() => {
          fetchUserData()
        }, 2000)
      }
      handleClose()
    } else Alert("warn", "Atleast Please Choose One User")
  }

  const handleModuleDelete = (id) => {
    Swal.fire({
      title: "",
      text: "Are you sure, you want to remove?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1658a0",
      cancelButtonColor: "#1658a0",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete("/user/roles/module", {
            data: {
              roleId: location.state.id.Id,
              moduleId: id,
              userId: 1
            }
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error)
            } else {
              Alert("succ", response.data.user)
            }
          })
          .catch((err) => {
            Alert("error", "Please Try Again")
          })

        const modadd = ModuleTabData.filter((module) => {
          return module.id !== id
        })
        setModuleTabData(modadd)
      } else {
        handleClose()
      }
    })
  }

  const handleUserDelete = async (Id) => {
    Swal.fire({
      title: "",
      text: "Are you sure, you want to remove?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1658a0",
      cancelButtonColor: "#1658a0",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete("/user/role", {
            data: {
              roleId: location.state.id.Id,
              userId: Id
            }
          })
          .then((response) => {
            if (response.data.error) {
              Alert("error", response.data.error)
            } else {
              Alert("succ", response.data.user)
            }
          })

        const useradd = UserTabData.filter((user) => {
          return user.Id !== Id
        })
        setUserTabData(useradd)
      } else {
        handleClose()
      }
    })
  }

  const isAdmin = location.state.id.Id === 1

  const column1 = [
    {
      name: "SEMO_ID",
      selector: (param) => param.id,
      sortable: true
    },
    {
      name: "Module Name",
      selector: (param) => param.ModuleName,
      sortable: true
    },
    {
      name: "Description",
      selector: (param) => param.ModuleDescription,
      sortable: true
    },
    {
      name: "Actions",
      id: "id",
      cell: (param) => (
        <a>
          <FontAwesomeIcon
            icon={faTrash}
            size="lg"
            color="#1475DF"
            onClick={() => {
              handleModuleDelete(param.id)
            }}
          />
        </a>
      ),

      ignoreRowClick: true,
      allowOverflow: true
    }
  ]

  const columnAddModulePermission = [
    {
      name: "Module Name",
      selector: (param) => param.ModuleName,
      sortable: true
    },
    {
      name: "Description",
      selector: (param) => param.ModuleDescription,
      sortable: true
    }
  ]

  const columnAddUser = [
    {
      name: "User Name",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true
    },
    {
      name: "User ID",
      selector: (param) => param.EmailId,
      sortable: true
    }
  ]

  const column2 = [
    {
      name: "SEUS_ID",
      selector: (param) => param.Id,
      sortable: true
    },
    {
      name: "User Name",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true
    },
    {
      name: "User ID",
      selector: (param) => param.EmailId,
      sortable: true
    },
    {
      name: "Actions",
      cell: (param) => (
        <a>
          <FontAwesomeIcon
            icon={faTrash}
            size="lg"
            color="#1475DF"
            onClick={() => {
              handleUserDelete(param.Id)
            }}
          />
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true
    }
  ]

  useEffect(async () => {
    await apiClient.get("/user/roles/role/").then((response) => {
      if (response.data.user) {
      }
    })

    if (location.state.id) {
      const roleName = location.state.id.RoleName
      const roleDescription = location.state.id.RoleDescription
      setRname(roleName)
      setRdes(roleDescription)
    }
  }, [])

  useEffect(() => {
    fetchModuleData()
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchModuleData = async () => {
    const response = await apiClient.get(
      `/user/modules/${location.state.id.Id}`
    )
    setModuleTabData(response.data.user)
  }

  useEffect(() => {
    const fetchFilteredModules = async () => {
      const response = await apiClient.get("/user/role/module/list")
      const filteredModules = response.data.user
      setdefaultlPage({
        value: location.state.id.DefaultPageId,
        label: location.state.id.ModuleName
      })
      let defVal = []
      filteredModules.map((row) => {
        defVal.push({ value: row.id, label: row.ModuleName })
      })
      setModuleTabListData(defVal)
      const uniqueModules = filteredModules.filter((module) => {
        return !ModuleTabData.some(
          (existingModule) => existingModule.id === module.id
        )
      })

      setAddModuleTabData(uniqueModules)
    }

    fetchFilteredModules()
  }, [ModuleTabData])

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = () => {
    apiClient.get(`/user/role/${location.state.id.Id}`).then((response) => {
      setUserTabData(response.data.user)
    })
  }

  useEffect(() => {
    const fetchFilteredModules = async () => {
      const response = await apiClient.post("/user/search", {
        firstName: "",
        lastName: "",
        emailId: "",
        isApproved: null,
        isActive: null,
        isLocked: null,
        userId: "1"
      })
      const filteredModules = response.data.user
      const uniqueArray = filteredModules.filter(
        (item1) => !UserTabData.some((item2) => item2.Id === item1.Id)
      )

      setAddUserTabData(uniqueArray)
    }

    fetchFilteredModules()
  }, [UserTabData])

  const updateRole = () => {
    setIsdisabled(true)
    if (
      Rname.trim() === "" ||
      defaultlPage.value === undefined ||
      defaultlPage.value === ""
    ) {
      Alert("warn", "Role Name, Default Page can't be empty!")
      setIsdisabled(false)
    } else {
      apiClient
        .put("/user/roles", {
          id: location.state.id.Id,
          roleName: Rname.trim(),
          roleDescription: Rdes.trim(),
          defaultlPage: defaultlPage.value,
          isActive: 1,
          userId: 1
        })
        .then((res) => {
          Alert("succ", "Role Modified Modified...")
        })
        .catch((error) => {})
        .finally(() => {
          setTimeout(() => {
            setIsdisabled(false)
          }, 4000)
        })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isdisabled) {
      e.preventDefault()
      updateRole()
    }
  }
  return (
    <div>
      <div className="maincontent__breadcrumb">
        <img
          className="cursor_pointer"
          src={HomeOutlineIcon}
          alt="home"
          onClick={() => {
            navigate(state.defaultpage)
          }}
        />
        <span className="maincontent__breadcrumb--divider">/</span>
        <span
          onClick={() => {
            navigate(Routes.Roles)
          }}
          style={{ cursor: "pointer" }}
        >
          Roles
        </span>
        <span className="maincontent__breadcrumb--divider">/</span>
        <span className="maincontent__breadcrumb--active">Edit Role</span>
      </div>

      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">Edit Role</h2>
        </div>
        <div className="maincontent__card--content ">
          <div className="grid lg:grid-cols-4 gap-4 items-end">
            <Form.Group className="flex flex-col">
              <Form.Label className="formlblus">Role Name</Form.Label>
              <Form.Control
                className="formconus"
                value={Rname}
                disabled={isAdmin ? true : false}
                type="text"
                placeholder="Role Name"
                onChange={(e) => {
                  setRname(e.target.value)
                }}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group className="flex flex-col">
              <Form.Label className="formlblus">Role Description</Form.Label>
              <Form.Control
                className="formconus"
                value={Rdes}
                onChange={(e) => {
                  setRdes(e.target.value)
                }}
                type="text"
                placeholder=""
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group className="flex flex-col">
              <Form.Label className="formlblus">Default Page</Form.Label>
              <Select
                options={moduleTabList}
                placeholder=""
                // isDisabled={true}
                value={defaultlPage}
                onChange={(e) => {
                  setdefaultlPage(e)
                }}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>

            <div
              style={{
                width: "10%",
                display: "inline-block",
                marginLeft: "10px"
              }}
            >
              <button
                onClick={() => updateRole()}
                disabled={isdisabled}
                className="maincontent__btn maincontent__btn--primaryblue"
                style={{ textAlign: "center" }}
              >
                update
              </button>
            </div>
          </div>
        </div>
      </div>
      <Accordion defaultActiveKey="1" style={{ marginTop: "10px" }}>
        <Accordion.Item eventKey="1">
          <Accordion.Header className="accordionheader">
            MODULE PERMISSIONS
          </Accordion.Header>
          <Accordion.Body
            className="accordionnew"
            style={{ visibility: "visible", color: "#1658a0", padding: "0px" }}
          >
            <div className="maincontent__card--content accordionnew rounded-[20px]">
              {isAdmin ? (
                <p className="text-center text-gray-500">
                  Admin will have all the Module Permissions
                </p>
              ) : (
                <>
                  <div className="flex justify-end maincontent__pageheader-right">
                    <button
                      className="maincontent__btn maincontent__btn--primaryblue"
                      onClick={() => setShowDefault(true)}
                      style={{ margin: "0 0 20px 0" }}
                    >
                      +Add Module Permissions
                    </button>
                    <Modal
                      as={Modal.Dialog}
                      centered
                      show={showDefault}
                      onHide={handleClose}
                      className="midpop"
                    >
                      <Card
                        centered
                        show={showDefault}
                        onHide={handleClose}
                        className="usrCrd"
                      >
                        <Card.Header className="rhdivCard mb-4">
                          <div className="maincontent__card--header">
                            <h2 className="maincontent__card--header-title">
                              Modules
                            </h2>
                          </div>
                        </Card.Header>
                        <div className="cardContent Cctent">
                          <Card.Body>
                            <DataTable
                              columns={columnAddModulePermission}
                              data={addModuleTabData}
                              highlightOnHover
                              pagination
                              onSelectedRowsChange={AddModulePermission}
                              selectableRows
                              paginationRowsPerPageOptions={[5, 10, 15]}
                              paginationPerPage={5}
                            />
                          </Card.Body>
                        </div>

                        <div className="flex justify-end gap-4 p-4">
                          <button
                            className="maincontent__btn maincontent__btn--primaryblue"
                            onClick={postModulePermission}
                          >
                            Add
                          </button>
                          <button
                            className="maincontent__btn maincontent__btn--primaryblue"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </Card>
                    </Modal>
                  </div>
                  <Card.Body>
                    <DataTable
                      columns={column1}
                      data={ModuleTabData}
                      highlightOnHover
                      pagination
                      paginationRowsPerPageOptions={[5, 10, 15]}
                      paginationPerPage={5}
                    />
                  </Card.Body>
                </>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="1" style={{ marginTop: "10px" }}>
        <Accordion.Item eventKey="1">
          <Accordion.Header className="accordionheader">USERS</Accordion.Header>
          <Accordion.Body
            className="accordionnew"
            style={{ visibility: "visible", color: "#1658a0", padding: "0px" }}
          >
            <div className="maincontent__card--content">
              <div className="flex justify-end maincontent__pageheader-right ">
                <button
                  className="mb-4 maincontent__btn maincontent__btn--primaryblue"
                  onClick={() => setShowDef(true)}
                >
                  +Add Users
                </button>

                <Modal
                  className="mdlclspop midpop"
                  as={Modal.Dialog}
                  centered
                  show={ShowDef}
                  onHide={handleClose}
                >
                  <Card
                    centered
                    show={ShowDef}
                    onHide={handleClose}
                    className="usrCrd"
                  >
                    <Card.Header className="rhdivCard">
                      <div className="maincontent__card--header">
                        <h2 className="maincontent__card--header-title">
                          Users
                        </h2>
                      </div>
                    </Card.Header>
                    <div className="cardContent Cctent rdt_Pagination">
                      <Card.Body className="rmroldcb rdt_Pagination">
                        <DataTable
                          columns={columnAddUser}
                          data={addUserTabData}
                          highlightOnHover
                          pagination
                          onSelectedRowsChange={AddUsers}
                          selectableRows
                          paginationRowsPerPageOptions={[5, 10, 15]}
                          paginationPerPage={5}
                        />
                      </Card.Body>
                    </div>

                    <div className="flex justify-end gap-4 p-4">
                      <button
                        className="maincontent__btn maincontent__btn--primaryblue"
                        onClick={postUsers}
                      >
                        Add
                      </button>
                      <button
                        className="maincontent__btn maincontent__btn--primaryblue"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </Card>
                </Modal>
              </div>
              <Card.Body>
                <DataTable
                  columns={column2}
                  data={UserTabData}
                  highlightOnHover
                  pagination
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  paginationPerPage={5}
                />
              </Card.Body>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ...state
})
export default connect(mapStateToProps)(EditRole)
