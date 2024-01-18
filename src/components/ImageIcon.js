import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
const baseStyle = {};

const activeStyle = {};

const acceptStyle = {};

const rejectStyle = {};

function ImgIcon({ image, setImage, removedFileName, }) {
  const [attachedImageNames, setAttachedImageNames] = useState([]);

  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     const newImages = acceptedFiles.filter((newImage) => {
  //       const imageName = newImage.name;
  //       const isDuplicate = attachedImageNames.includes(imageName);
  //       if (!isDuplicate) {
  //         setImage((prevState) => [...prevState, newImage]);
  //         setAttachedImageNames((prevNames) => [...prevNames, imageName]);
  //       } else {
  //         Swal.fire({
  //           title: "",
  //           text: "Can't add the same image twice",
  //           icon: "warning",
  //           showCancelButton: false,
  //           confirmButtonColor: "#1658a0",
  //           confirmButtonText: "OK",
  //         });
  //       }
  //       return !isDuplicate;
  //     });
  //   },
  //   [attachedImageNames, setImage]
  // );

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((newFile) => {
        const isDuplicate = image.some(
          (existingFile) => existingFile.name === newFile.name
        );

        if (!isDuplicate) {
          setImage((prevState) => [...prevState, newFile]);
        } else {
          Swal.fire({
            title: "",
            text: "Can't add the same image twice",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#1658a0",
            confirmButtonText: "OK",
          });
        }
      });
    },
    [image, setImage]
  );
  //  
  //   (acceptedFiles) => {
  // acceptedFiles.forEach((newImage) => {
  //       const imageName = newImage.name;
  //       const isDuplicate = attachedImageNames.includes(imageName);

  //       // // Add the removedFileName to attachedImageNames when it's not empty
  //       // if (removedFileName && imageName === removedFileName) {
  //       //   setAttachedImageNames((prevNames) => [...prevNames, imageName]);
  //       //   return true;
  //       // }

  //       if (!isDuplicate) {
  //         setImage((prevState) => [...prevState, newImage]);
  //         setAttachedImageNames((prevNames) => [...prevNames, imageName]);
  //       } else {
  //         Swal.fire({
  //           title: "",
  //           text: "Can't add the same image twice",
  //           icon: "warning",
  //           showCancelButton: false,
  //           confirmButtonColor: "#1658a0",
  //           confirmButtonText: "OK",
  //         });
  //       }
  //       return !isDuplicate;
  //     });
  //   },
  //   [attachedImageNames, setImage, removedFileName, setAttachedImageNames]
  // );

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

export default ImgIcon;
