import React, { useEffect } from "react";
import { Col, Row, Card, Modal, Form } from "@themesberg/react-bootstrap";
import { useState } from "react";
import "./ManageLookUp.css";
import { DataTableStyle } from "../../components/DataTableStyle";
import apiClient from "../../common/http-common";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faPenToSquare,
  faSearch,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Alert } from "../../components/Alert";
import { connect } from "react-redux";

const ManageLookUp = (state) => {
  const [editData, setEditData] = useState({
    Id: "",
    Name: "",
    Description: "",
  });
  let [singleSelections, setSingleSelections] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);
  const [showEdit, setShowEdit] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [ShowDef, setShowDef] = useState(false);
  const [showDefault, setShowDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setEditData({ Id: "", Name: "", Description: "" });
    setIsEdit(false);
    setShowDefault(false);
    setShowDef(false);
  };
  const navigate = useNavigate();
  const options = [];
  const columns = [
    {
      name: "Id",
      selector: (param) => param.Id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (param) => param.Name,
      sortable: true,
    },
    {
      name: "Description",
      selector: "Description",
      sortable: true,
    },
    {
      name: "Action",
      cell: (param) => (
        <>
          {" "}
          <span
            title="Edit Lookup"
            style={{ cursor: "pointer" }}
            class="lookup-play-icon"
            href="#"
            onClick={() => {
              clickHandler(param);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" color="#1475DF" />
          </span>
          <span
            title="Delete Lookup"
            style={{ cursor: "pointer" }}
            href="#"
            onClick={() => {
              deleteMetaData(param);
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} size="lg" color="red" />
          </span>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      style: {},
    },
  ];

  const clickHandler = (val) => {
    setIsEdit(true);
    setEditData(val);
    setShowDef(true);
  };

  useEffect(() => {
    getMetaDataList();
  });

  const getMetaDataList = () => {
    apiClient.get("/lookup").then((response) => {
      response.data.lookup.forEach((element) => {
        options.push({
          value: element.Id,
          label: element.Name,
          MetaDataId: element.MetaDataId,
        });
      });
    });
  };

  const fetchMetadataDtls = () => {
    setLoading(true);
    apiClient
      .get(`/lookup/${singleSelections.MetaDataId}/1`)
      .then((response) => {
        setFilteredData(response.data.lookup);
        if (response.data.lookup.length > 0) {
          setShowEdit(true);
        }
        setLoading(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateMetaData();
    } else {
      addMetaData();
    }
  };
  const updateMetaData = () => {
    if (editData.Name.trim() !== "") {
      apiClient
        .post(`/lookup/update`, {
          metadataId: singleSelections.MetaDataId,
          id: editData.Id,
          name: editData.Name,
          description: editData.Description ? editData.Description : "",
          isActive: "1",
          userId: logUserId,
        })
        .then((response) => {
          setEditData({ Id: "", Name: "", Description: "" });
          setIsEdit(false);
          handleClose();
          if (response.data.error) {
            Alert("error", response.data.error);
          } else {
            Alert("succ", response.data.lookup);
            setTimeout(() => {
              fetchMetadataDtls();
            }, 1000);
          }
        });
    } else {
      Alert("warn", "MetaData Name is Required");
    }
  };

  const addMetaData = () => {
    if (editData.Name.trim() && editData.Description !== null) {
      apiClient
        .post(`/lookup/add`, {
          metadataId: singleSelections.MetaDataId,
          id: editData.Id,
          name: editData.Name,
          description: editData.Description == null ? "" : editData.Description,
          isActive: "1",
          userId: logUserId,
        })
        .then((response) => {
          setEditData({ Id: "", Name: "", Description: "" });
          setIsEdit(false);
          handleClose();
          if (response.data.error) {
            Alert("error", response.data.error);
          } else {
            Alert("succ", response.data.lookup);
            setTimeout(() => {
              fetchMetadataDtls();
            }, 1000);
          }
        });
    } else {
      Alert("warn", "MetaData Name is Required");
    }
  };

  const deleteMetaData = (data) => {
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
          .delete(`/lookup/${singleSelections.MetaDataId}/${data.Id}`)
          .then((response) => {
            setEditData({ Id: "", Name: "", Description: "" });
            setIsEdit(false);
            if (response.data.error) {
              Alert("error", response.data.error);
            } else {
              Alert("succ", response.data.lookup);
              setTimeout(() => {
                fetchMetadataDtls();
              }, 1000);
            }
            fetchMetadataDtls();
          })
          .catch((err) => {
            Alert("warn", "Cant Delete, Data is already in use! ");
          });
      }
    });
  };

  const selectionChange = (e) => {
    setLoading(true);
    setShowEdit(false);
    setFilteredData("");
    singleSelections = e;
    setSingleSelections(singleSelections);

    setTimeout(() => {
      fetchMetadataDtls();
    }, 1000);
  };

  return (
    <div>
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
          <span>Manage Lookups (Add/Edit)</span>
        </div>
      </div>
      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2 className="maincontent__card--header-title text-black">
            Fetch Lookup Details
          </h2>
        </div>
        <div className="maincontent__card--content">
          <Form>
            <Row>
              <Col md={4} className="mb-4">
                <Form.Group id="client">
                  <Form.Label>Lookup Type</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text icon-container">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                    <Select
                      labelKey="name"
                      onChange={(e) => {
                        selectionChange(e);
                      }}
                      options={options}
                      placeholder=""
                      selected={singleSelections}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="mt-4 maincontent__card--body">
        <div className="maincontent__card--header">
          <h2
            className="maincontent__card--header-title text-black"
            style={{ cursor: "pointer" }}
          >
            Look Up Details
          </h2>
        </div>
        <div className="maincontent__card--content">
          <div
            className="maincontent__card--tableheader"
            style={{ margin: "0 0 10px 0" }}
          >
            <div className="maincontent__card--tableheader-right">
              {showEdit && (
                <button
                  className="maincontent__btn maincontent__btn--primaryblue"
                  onClick={() => {
                    setShowDef(true);
                  }}
                >
                  + Add
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div class="circle__loader items-center my-0 mx-auto"></div>
          ) : (
            <DataTable
              title=""
              columns={columns}
              data={filteredData}
              customStyles={DataTableStyle}
              pagination
              highlightOnHover
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationPerPage={5}
            />
          )}
        </div>
      </div>
      {showEdit && (
        <>
          <Modal
            className="mdlclspop"
            as={Modal.Dialog}
            centered
            show={ShowDef}
            onHide={handleClose}
          >
            <div className="px-4 mt-2">
              <Card
                border="light"
                centered
                show={ShowDef}
                onHide={handleClose}
                className="usrCrd"
              >
                <div className="maincontent__card--header">
                  <h2 className="maincontent__card--header-title">
                    {isEdit ? "EDIT" : "ADD"} DETAILS
                  </h2>
                </div>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id="client">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={editData.Name}
                            onChange={(e) =>
                              setEditData({
                                Id: editData.Id,
                                Name: e.target.value,
                                Description: editData.Description,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group id="client">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type="text"
                            value={editData.Description}
                            onChange={(e) =>
                              setEditData({
                                Id: editData.Id,
                                Name: editData.Name,
                                Description: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12} className="flex gap-4 justify-center">
                        <button
                          className="maincontent__btn maincontent__btn--primaryblue"
                          type="submit"
                        >
                          {isEdit ? "Update" : "Add"}
                        </button>
                        <label
                          className="cursor-pointer maincontent__btn maincontent__btn--primaryblue"
                          onClick={handleClose}
                        >
                          Cancel
                        </label>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ManageLookUp);
