import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "6px 8px",
  borderWidth: 4,
  borderRadius: 7,
  borderColor: "#374151",
  backgroundColor: "rgb(6 111 226)",
  color: "white",
  transition: "border .3s ease-in-out",
  width: "100%",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function FileImgIcon({ image, setImage }) {
  const [selectedFileName, setSelectedFileName] = useState(""); // Added state variable for the selected file name
  const [selectedFile, setSelectedFile] = useState(null);


  const onDrop = useCallback((acceptedFiles) => {
    // Update the selectedFileName when a file is chosen
    setSelectedFileName(acceptedFiles[0].name);

    setImage((prevState) => [...prevState, ...acceptedFiles]);
  }, []);

  const handleDeleteFile = () => {
    setSelectedFileName(""); // Clear the file name
    setSelectedFile(null); // Clear the selected file
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <>
    <div id="fileImgIcon" {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <div>Attach</div>
    </div>
    {selectedFileName && (
          <div>
            {selectedFileName}
            <FontAwesomeIcon icon={faTrash} onClick={handleDeleteFile} style={{ cursor: "pointer" }} />
          </div>
    )}
  </>
  );
}

export default FileImgIcon;
