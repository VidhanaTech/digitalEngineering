import apiClient from "../common/http-common";
import React, { useEffect, useState } from "react";
import store from "../store";

export function ddmmyyyyFormat(val) {
  if (val !== "0000-00-00") {
    const date = new Date(val);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } else return true;
}

export function yyyymmdd(val) {
  if (val !== "0000-00-00") {
    const date = new Date(val);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  } else return true;
}

export function datetimeClockFormat(val) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Date(val).toLocaleString("en-US", options);
}

export function isImageExtension(extension) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  return imageExtensions.includes(extension.toLowerCase());
}

export function isImageAttachment(attachmentName) {
  const parts = attachmentName.split(".");
  if (parts.length > 1) {
    const extension = parts[parts.length - 1];
    return isImageExtension(extension);
  }
  return false;
}

export function truncateText(value, limit) {
  if (value.length >= limit) {
    return (
      <>
        {value.substring(0, limit)}
        {"..."}
      </>
    );
  } else return value;
}

export function getPoints(department, points = "") {
  if (department == "1") {
    // Engg
    if (points < 200) return "Enthusiast";
    else if (points >= 200 && points < 600) return "Catalyst";
    else if (points >= 600 && points < 1000) return "Maestro";
    else return "Maven";
  } else if (department == "3") {
    // Sales
    if (points < 200) return "Enthusiast";
    else if (points >= 200 && points < 600) return "Rookie";
    else if (points >= 600 && points < 1000) return "Pro";
    else return "Champion";
  } else if (department == "2") {
    // qa
    if (points < 200) return "Enthusiast";
    else if (points >= 200 && points < 600) return "Scout";
    else if (points >= 600 && points < 1000) return "Advocate";
    else return "Ace";
  } else if (department == "4") {
    //marketing
    if (points < 200) return "Enthusiast";
    else if (points >= 200 && points < 600) return "Dynamo";
    else if (points >= 600 && points < 1000) return "Virtuoso";
    else return "Ace";
  } else {
    if (points < 200) return "Enthusiast";
    else if (points >= 200 && points < 600) return "Rookie";
    else if (points >= 600 && points < 1000) return "Pro";
    else return "Champion";
  }
}

export function checkRolePermission(Path) {
  let roles = store.getState().roles;
  let isAdmin = store.getState().isAdmin;
  let user = store.getState().user;
  if (isAdmin) {
    return true;
  } else {
    let findRole = roles.find((role) => role.Path === Path);
    if (Object.keys(user).length === 0 || findRole === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
