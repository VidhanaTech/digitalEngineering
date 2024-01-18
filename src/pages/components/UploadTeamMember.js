import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as XLSX from "xlsx";
import { Routes } from "../../routes";
import apiClient from "../../common/http-common";
import { Alert } from "../../components/Alert";

const UploadTeamMember = ({userTab}) => {

  const getState = localStorage.getItem("state");
  const getUserId = JSON.parse(getState);
  const [logUserId] = useState(getUserId.user.Id);

  const handleFileUpload = (e) => {
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
                userTab(res.data.project);
                Alert("succ", "Team Member Added Successfully");
              })
          }
        }
        })
      }
    };

    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    console.log("userTabData has been updated:", userTab);
  }, [userTab]);
  return (
    <>
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
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  roles: state.roles,
  isAdmin: state.isAdmin,
});

export default connect(mapStateToProps)(UploadTeamMember);
