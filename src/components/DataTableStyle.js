import React from "react";

export const DataTableStyle = () => {
  const customStyles = {
    rows: {
      style: {
        paddingTop: "5px",
        paddingBottom: "5px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f2f8ff",
        justifyContent: "flex-start",
        textAlign: "left",
      },
    },
    cells: {
      style: {
        justifyContent: "flex-start",
        textAlign: "left",
      },
    },
  };
  return customStyles;
};
