import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Form, Card } from "@themesberg/react-bootstrap";
import DataTable from "react-data-table-component";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import * as XLSX from "xlsx";

const TeamMembers = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);

  const [UserTabData, setUserTabData] = useState([]);
  const [showDefault, setShowDefault] = useState(false);
  const [ShowDef, setShowDef] = useState(false);
  const handleClose = () => (setShowDefault(false), setShowDef(false));
  const [addUserTabData, setAddUserTabData] = useState([]);
  const [getusers, setgetusers] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);

  const [selectVal, setSelectVal] = useState({
    project: { value: "Select Project", label: "Select Project" },
  });
  const [projectSelected, setProjectSelected] = useState(false);

  let AdminId = state.isAdmin;
  let [selectedProjectId, setSelectedProjectId] = useState();

  const getTeamMember = () =>{
    setIsLoading(true)
    apiClient.get(`/project/teamMemberByProject/${selectedProjectId}`).then((response) => {
      setUserTabData(response.data.project);
      setIsLoading(false)
    })
    .catch(() => {
      Alert("error", "Please Try Again");
    });
  }

  const getTeamMembers = (projId) =>{
    setIsLoading(true)
    apiClient.get(`/project/teamMemberByProject/${projId}`).then((response) => {
      setUserTabData(response.data.project);
      setIsLoading(false);
    })
    .catch(() => {
      Alert("error", "Please Try Again");
    });
  }

  useEffect(() => {
    getTeamMember();
  }, [selectedProjectId]);

  useEffect(() => {
    apiClient
      .post("/project/prjectlistByManager", {
        userId: logUserId,
        isAdmin: AdminId,
      })
      .then((response) => {
        if (response.data.project.length === 0) {
          setProjectList([]);
        } else {
          const arr = response.data.project.map((element) => ({
            value: element.id,
            label: element.Name,
          }));
          const filteredArr = arr.filter((item) => item.label !== "All");
          if (selectVal.project.label === "All") {
            setSelectVal({ project: filteredArr[0] || null });
          }

          setProjectList(filteredArr);
          setSelectedProjectId(selectVal.project.value);
          const SelProjId = selectVal.project.value;

          //the second API call with the selected projectId using the named function
          getTeamMembers(SelProjId)
        }
      })
      .catch(() => {
        Alert("error", "Please Try Againss");
      });
  }, [selectVal.project]);

  const columnAddUser = [
    {
      name: "User Name",
      selector: (param) => param.FirstName + " " + param.LastName,
      sortable: true,
    },
    {
      name: "User ID",
      selector: (param) => param.EmailId,
      sortable: true,
    },
  ];

  const column2 = [
    {
      name: "USER_ID",
      selector: (param) => param.UserId,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (param) => param.UserName,
      sortable: true,
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
              deleteMember(param);
            }}
          />
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

 

  useEffect(() => {
    const fetchFilteredModules = async () => {
      const response = await apiClient.post("/user/search", {
        firstName: "",
        lastName: "",
        emailId: "",
        isApproved: null,
        isActive: 1,
        isLocked: null,
        userId: "1",
      });
      const filteredModules = response.data.user;
      const uniqueArray = filteredModules.filter(
        (item1) => !UserTabData.some((item2) => item2.UserId === item1.Id)
      );

      setAddUserTabData(uniqueArray);
    };

    fetchFilteredModules();
  }, [UserTabData]);

  const deleteMember = (param) => {
    setIsLoading(true);
   
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
          .delete(`/project/deleteteammember/${param.Id}`)
          .then((response) => {
            if (response.data.error) {
              Alert("error", "Couldn't Delete Team Member");
            } else {
              getTeamMember();
              Alert("succ", "Team Member Deleted Successfully");
            }
          })
          .catch(() => {
            Alert("error", "Please Try Again");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        handleClose();
        setIsLoading(false);
      }
    });
  };
  const AddUsers = (param) => {
    setgetusers(param.selectedRows);
  };

  const postUsers = (obj) => {
    setIsLoading(true)
    if (getusers.length > 0) {
      let err = 0;
      getusers.map((data, i) => {
        let details = {
          Id: null,
          ProjectId: selectedProjectId,
          UserId: data.Id,
          CreatedBy: logUserId,
        };
        apiClient
          .post("/project/addTeamMember", details)
          .then((res) => {
            getTeamMember();
            setIsLoading(false)
            Alert("succ", "Team Member Added Successfully");
            handleClose();
            //}
          })
          .catch(() => {
            Alert("error", "Please Try Again");
          });
      });
    }
  };

  const [sheet3Data] = useState([{ "User ID" : "", "Project ID" : "" }]);

  const extractedUserData = addUserTabData.map(
    ({ Id, EmailId, FirstName, LastName }) => ({
      Id,
      EmailId,
      Username: `${FirstName} ${LastName}`,
    })
  );

  const extractedProjectData = projectList.map(({ value, label }) => ({
    "Project Id": value,
    "Project Name": label,
  }));

  function handleExport(data) {
    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(extractedUserData);
    XLSX.utils.book_append_sheet(wb, ws1, "User Details");

    const ws2 = XLSX.utils.json_to_sheet(extractedProjectData);
    XLSX.utils.book_append_sheet(wb, ws2, "Project Details");

    const ws3 = XLSX.utils.json_to_sheet(sheet3Data);
    XLSX.utils.book_append_sheet(wb, ws3, "Sheet 3");

    const xlsxBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxBlob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "User Details.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleFileUpload = (e) => {
    setIsLoading(true)
    if(e.target.files[0]){
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames;
      const sheet = workbook.Sheets[sheetName[2]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if(jsonData.length > 0){
        jsonData.map((row, i)=>{
          if(i !== 0){
          if(row[0] && row[1]){
            let details = {
              Id: null,
              ProjectId: row[1],
              UserId: row[0],
              CreatedBy: logUserId,
            };
            apiClient
              .post("/project/addTeamMember", details)
              .then((res) => {
                  getTeamMember()
                  setIsLoading(false)
                  Alert("succ", "Team Member Added Successfully");
                
              })
          }
        }
        })
      }
    };

    reader.readAsBinaryString(file);
  } else {
    setIsLoading(false); 
  }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {HideHomeBreadCumb && (
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
            <span className="maincontent__breadcrumb--active">
              Team Members
            </span>
          </div>
        )}
      </div>

      <div className="maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title">TEAM MEMBERS</h2>
        </div>
        <div className="maincontent__card--content">
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6"
            style={{ width: "97%" }}
          >
            <Form.Group id="project">
              <Form.Label>Project</Form.Label>
              <Select
                options={projectList}
                placeholder="Select Project"
                value={selectVal.project}
                onChange={(e) => {
                  selectVal.project = e;
                  setSelectVal({ ...selectVal, project: e });
                  setProjectSelected(true);
                }}
              />
            </Form.Group>

            <div style={{ marginTop: "20px" }}>
              <button
                style={{
                  width: "max-content",
                  paddingBottom: "15px",
                  paddingTop: "15px",
                }}
                className="maincontent__btn maincontent__btn--primaryblue m-2"
                onClick={() => handleExport(addUserTabData)}
              >
                Download Template
              </button>
            </div>

            {projectSelected && (
              <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="maincontent__btn maincontent__btn--primaryblue m-2"
          style={{
            width: "max-content",
            paddingBottom: "15px",
            paddingTop: "15px",
            cursor: "pointer",
          }}
        >
          Upload Team Members
        </label>
      </div>
            )
            }

          </div>
        </div>
      </div>
      {projectSelected && (
        <div className="maincontent__card--body mt-2">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title">Users</h2>
          </div>
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
                    <div className="rhCdiv">
                      <p>Users</p>
                    </div>
                  </Card.Header>
                  <div className="cardContent Cctent bg-purple-100 rdt_Pagination">
                    <Card.Body className="rmroldcb">
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
              <div align="center">
                {isLoading ? (
                  <div class="circle__loader items-center my-0 mx-auto"></div>
                ) : (
                  <DataTable
                    columns={column2}
                    data={UserTabData}
                    highlightOnHover
                    pagination
                    paginationRowsPerPageOptions={[5, 10, 15]}
                    paginationPerPage={5}
                  />
                )}
              </div>
            </Card.Body>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(TeamMembers);
