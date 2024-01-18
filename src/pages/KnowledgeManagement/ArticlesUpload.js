import HomeOutlineIcon from "../../assets/img/icons/home-outline-icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Card } from "@themesberg/react-bootstrap";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";
import * as XLSX from "xlsx";

const ArticlesUpload = (state) => {
  let currentpath = window.location.hash.replace("#", "");
  let haumbstatus = state.defaultpage === currentpath ? false : true;
  const [HideHomeBreadCumb] = useState(haumbstatus);
  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);
  const [UserTabData, setUserTabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addUserTabData, setAddUserTabData] = useState([]);
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [clientlist, setClientList] = useState([]);
  const [selectVal, setSelectVal] = useState({
    project: { value: "Select Project", label: "Select Project" },
  });

  let AdminId = state.isAdmin;
  const [selectedFile, setSelectedFile] = useState(null);
  const [errordata, setErrorData] = useState([]);
  const [successdata, setSuccessData] = useState([]);
  const [filePath , SetFilePath] = useState("");

  useEffect(() => {
    apiClient
      .post("/project/prjectlistByManager", {
        userId: logUserId,
        isAdmin: true,
      })
      .then((response) => {
        if (response.data.project.length === 0) {
          setProjectList([]);
        } else {
          const arr = response.data.project.map((element) => ({
            value: element.id,
            label: element.Name,
          }));
          setProjectList(arr);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  }, [selectVal.project]);

  useEffect(() => {
    apiClient
      .get("/lookup/ArticalCategory/1", {
        userId: logUserId,
        isAdmin: true,
      })
      .then((response) => {
        if (response.data.lookup.length === 0) {
          setCategoryList([]);
        } else {
          const arr = response.data.lookup.map((element) => ({
            value: element.Id,
            label: element.Name,
          }));
          setCategoryList(arr);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  }, [selectVal.lookup]);

  useEffect(() => {
    apiClient
      .post("/client/search", {
        userId: logUserId,
        clientId: "0",
        domainId: "0",
        towerId: "0",
        organizationId: "0",
        isAdmin: true,
      })
      .then((response) => {
        if (response.data.client.length === 0) {
          setClientList([]);
        } else {
          const arr = response.data.client.map((element) => ({
            value: element.Id,
            label: element.Name,
          }));
          setClientList(arr);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      });
  }, [selectVal.client]);

  useEffect(() => {
    const fetchFilteredModules = async () => {
      try {
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
        setAddUserTabData(filteredModules);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          Alert("error", "Internal Server Error");
        } else {
          Alert("error", "Please Try Again");
        }
      }
    };

    fetchFilteredModules();
  }, [UserTabData]);

  const [sheet3Data] = useState([
    {
      "Type ID": "1",
      "Project ID": "2",
      "Client ID": "4",
      "Category ID": "2",
      Title: "Min 3 Letters",
      Description: "Sample Text",
      Revenue: " For Type",
      "Revenue Client": "1,2,3",
      "Revenue Internal": "these",
      Cost: "fields",
      "Cost Client": "are",
      "Cost Internal": "not",
      "Person Days": "needed",
      Keywords: "#key",
      Attachment: "image1.png, record.xlsx",
    },
    {
      "Type ID": "4",
      "Project ID": "2",
      "Client ID": "4",
      "Category ID": "5",
      Title: "Min 3 Letters",
      Description: "Sample Text",
      Revenue: "5",
      "Revenue Client": "7",
      "Revenue Internal": "8",
      Cost: "0",
      "Cost Client": "45",
      "Cost Internal": "45",
      "Person Days": "345",
      Keywords: "#key",
      Attachment: "image2.png, fileArticle.pdf",
    },
    {
      "Type ID": "--------------",
      "Project ID": "--------------",
      "Client ID": "Above",
      "Category ID": "Two",
      Title: "are of",
      Description: "Sample",
      Revenue: "Entries",
      "Revenue Client": "you can",
      "Revenue Internal": "fill",
      Cost: "from",
      "Cost Client": "below 5th",
      "Cost Internal": "row",
      "Person Days": "--------------",
      Keywords: "--------------",
      Attachment: "--------------",
    },
  ]);

  const [typeData] = useState([
    { "Type ID": "1", Name: "Articles" },
    { "Type ID": "2", Name: "Case Study" },
    { "Type ID": "3", Name: "Knowledge Management" },
    { "Type ID": "4", Name: "Value Xperience" },
    { "Type ID": "5", Name: "Customer Accolades" },
  ]);

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

  const extractedCategoryData = categoryList.map(({ value, label }) => ({
    "Category Id": value,
    "Category Name": label,
  }));

  const extractedClientData = clientlist.map(({ value, label }) => ({
    "Client Id": value,
    "Client Name": label,
  }));

  function handleExport(data) {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(typeData);
    XLSX.utils.book_append_sheet(wb, ws1, "Type Details");

    const ws2 = XLSX.utils.json_to_sheet(extractedProjectData);
    XLSX.utils.book_append_sheet(wb, ws2, "Project Details");

    const ws3 = XLSX.utils.json_to_sheet(extractedClientData);
    XLSX.utils.book_append_sheet(wb, ws3, "Client Details");

    const ws4 = XLSX.utils.json_to_sheet(extractedCategoryData);
    XLSX.utils.book_append_sheet(wb, ws4, "Category Details");

    const ws5 = XLSX.utils.json_to_sheet(sheet3Data);
    XLSX.utils.book_append_sheet(wb, ws5, "Sheet 5");

    const xlsxBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxBlob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Articles Upload.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handleFileUpload = (e) => {
    if (selectedFile) {
      const file = selectedFile;
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const sheetName = workbook.SheetNames;
        if (sheetName[4] === undefined) {
          Alert("error", "Wrong File: Sheet 5 not found");
          setSelectedFile(null);
          return;
        }
        const sheet = workbook.Sheets[sheetName[4]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (jsonData.length > 0) {
          let errData = [];
          let succData = [];
          let success = true;
          const apiPromises = [];
  
          jsonData.map((row, i) => {
            if (i >= 4) {
              let status = state.isAdmin ? 1 : 2;
              let details = {};
  
              if (row[0] && row[0] <= 5 && row[0] > 0) {
                if (row[0] != 4) {
                  details = {
                    Id: null,
                    type: row[0],
                    title: row[4],
                    description: row[5],
                    articalby: logUserId,
                    projectid: row[1],
                    categoryid: row[3],
                    UserId: logUserId,
                    Keywords: row[13],
                    statusid: status,
                    viewstatus: 1,
                  };
                } else {
                  details = {
                    Id: null,
                    type: row[0],
                    title: row[4],
                    clientId: row[2],
                    description: row[5],
                    articalby: logUserId,
                    projectid: null,
                    categoryid: row[3],
                    statusid: status,
                    UserId: logUserId,
                    revenue: row[6],
                    revenueClient: row[7],
                    revenueInternal: row[8],
                    cost: row[9],
                    costClient: row[10],
                    costInternal: row[11],
                    personDays: row[12],
                    Keywords: row[13],
                    viewstatus: 1,
                  };
                }
  
                if (
                  (details.type &&
                    details.title &&
                    details.title.length >= 3 &&
                    details.description &&
                    details.categoryid) ||
                  (details.type &&
                    details.clientId &&
                    details.title &&
                    details.title.length >= 3 &&
                    details.description &&
                    details.categoryid)
                ) {
                  let addPath = row[0] == 4 ? "vxarticle/add" : "/kmarticle/add";
                  const apiPromise = apiClient
                    .post(addPath, details)
                    .then(async (res) => {
                      const addPaths = "kmarticle/uploadattachment";
                      const attachmentNames = row[14];
                      if (attachmentNames && attachmentNames.length > 0) {
                        const fileNames = attachmentNames.split(',');
                        for (const fileName of fileNames) {
                          const upload = {
                            id: null,
                            articleId: res.data[0].Id,
                            filename: fileName.trim(),
                            filePath: filePath + fileName.trim(),
                            userId: logUserId,
                          };
                          await apiClient.post(addPaths, upload).then((res) => {});
                        }
                      }
                      succData.push({ data: row, rowNumber: i + 1 });
                    })
                    .catch((error) => {
                      errData.push({ data: row, rowNumber: i + 1 });
                    });
  
                  apiPromises.push(apiPromise);
                } else {
                  errData.push({ data: row, rowNumber: i + 1 });
                }
              } else {
                errData.push({ data: row, rowNumber: i + 1 });
              }
            }
          });
  
          Promise.all(apiPromises)
            .then((res) => {
              setSuccessData(succData);
              if (succData.length ===0 && errData.length ===0) {
                Alert("warn", "No Artifacts Found")
              }
              else if (errData.length > 0) {
                setErrorData(errData);
                Alert("warn", "Some Articles Could Not Be Added");
              } else {
                Alert("succ", "Artifacts Uploaded Successfully");
              }
              setSelectedFile(null);
            })
            .catch((error) => {});
        }
      };
  
      reader.readAsBinaryString(file);
    } else {
      Alert("error", "No File Selected");
    }
  };
      
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrorData([]);
    setSuccessData([]);
  };

  const handleCancel = () => {
    setSelectedFile(null);
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
              Articles Upload
            </span>
          </div>
        )}
      </div>
      {loading ? (
        <div
          class="circle__loader"
          style={{ alignItems: "center", margin: "0 auto" }}
        ></div>
      ) : (
        <div className="maincontent__card--body">
          <div className="maincontent__card--header">
            <h2 className="maincontent__card--header-title text-black">
              Articles Upload
            </h2>
          </div>
          <div className="maincontent__card--content">
            <div
              className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6"
              style={{ width: "97%" }}
            >
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

              {selectedFile ? (
                <div className="flex mt-4">
                <p className="mr-4 mt-3 whitespace-nowrap">{selectedFile.name}</p>
                <button className="maincontent__btn maincontent__btn--primaryblue m-2" onClick={handleFileUpload}>Upload</button>
                <button className="maincontent__btn maincontent__btn--primaryblue m-2" onClick={handleCancel}>Cancel</button>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => {
                    SetFilePath(e.target.value);
                  }}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter file path"
                />
              </div>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileSelect}
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
                    Upload Articles
                  </label>
                </div>
              )}
            </div>
          </div>
          <div>
            {successdata.length > 0 || errordata.length > 0 ? (
              <Card>
                <Card.Body>
                  <Card.Title>Excel File Uploaded Data</Card.Title>
                  <div className="table-responsive pointer">
                    <table className="table table-striped">
                      <thead>
                        <tr className="text-center">
                          <th>Excel Row No</th>
                          <th>Type ID *</th>
                          <th>Project ID *</th>
                          <th>Client ID *</th>
                          <th>Category ID *</th>
                          <th>Title *</th>
                          <th>Description *</th>
                          <th>Status</th>
                          <th>Revenue</th>
                          <th>Revenue Client</th>
                          <th>Revenue Internal</th>
                          <th>Cost</th>
                          <th>Cost Client</th>
                          <th>Cost Internal</th>
                          <th>Person Days</th>
                          <th>Keywords</th>
                        </tr>
                      </thead>
                      <tbody>
                        {successdata.map((data, index) => (
                          <tr key={index} className="text-center">
                            <td>{data.rowNumber}</td>
                            <td>{data.data[0]}</td>
                            <td>{data.data[1]}</td>
                            <td>{data.data[2]}</td>
                            <td>{data.data[3]}</td>
                            <td className="text-left">{data.data[4]}</td>
                            <td className="text-left">{data.data[5]}</td>
                            <td>
                              <p className="text-white maincontent__table--status maincontent__table--status-updated">
                                Uploaded
                              </p>
                            </td>
                            <td>{data.data[6]}</td>
                            <td>{data.data[7]}</td>
                            <td>{data.data[8]}</td>
                            <td>{data.data[9]}</td>
                            <td>{data.data[10]}</td>
                            <td>{data.data[11]}</td>
                            <td>{data.data[12]}</td>
                            <td className="text-left">{data.data[13]}</td>
                          </tr>
                        ))}
                        {errordata.map((data, index) => (
                          <tr key={index} className="text-center">
                            <td>{data.rowNumber}</td>
                            <td>{data.data[0]}</td>
                            <td>{data.data[1]}</td>
                            <td>{data.data[2]}</td>
                            <td>{data.data[3]}</td>
                            <td className="text-left">{data.data[4]}</td>
                            <td className="text-left">{data.data[5]}</td>
                            <td>
                              <p className="text-white maincontent__table--status maincontent__table--status-notupdated">
                                Failed
                              </p>
                            </td>
                            <td>{data.data[6]}</td>
                            <td>{data.data[7]}</td>
                            <td>{data.data[8]}</td>
                            <td>{data.data[9]}</td>
                            <td>{data.data[10]}</td>
                            <td>{data.data[11]}</td>
                            <td>{data.data[12]}</td>
                            <td className="text-left">{data.data[13]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});
export default connect(mapStateToProps)(ArticlesUpload);
