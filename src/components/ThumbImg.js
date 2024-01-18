import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
const baseStyle = {};

const activeStyle = {};

const acceptStyle = {};

const rejectStyle = {};



function ThumbIcon({ image, setImage }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        const newImage = acceptedFiles[0];
        if (
          newImage.type === "image/jpeg" ||
          newImage.type === "image/png" ||
          newImage.type === "image/jpg" ||
          newImage.type === "image/JPEG" ||
          newImage.type === "image/JPG" ||
          newImage.type === "image/PNG"
        ) {
          setImage([newImage]);
        } else {
          Swal.fire({
            title: "",
            text: "Only JPEG, JPG, and PNG image formats are allowed",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#1658a0",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "",
          text: "You can only upload one image",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#1658a0",
          confirmButtonText: "OK",
        });
      }
    },
    [setImage]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg",
    maxFiles: 1, // Allow only one file to be dropped.
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
    <div
      id="fileImgIcon"
      {...getRootProps({ style })}
      className="cursor-pointer"
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon
        title="Add media"
        icon={faPaperclip}
        style={{ marginTop: "-15px !important" }}
        className="maincontent__postarticle--attachicon"
      />
    </div>
  );
}

export default ThumbIcon;
