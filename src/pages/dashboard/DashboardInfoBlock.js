import React, { useEffect, useState } from "react"
import { Row, Col } from "@themesberg/react-bootstrap"

export default (props) => {
  return (
    <>
      {props.infoList?.map((info, index) => {
        return (
          <div className="dashboard-info-block" key={index}>
            <div className="dashboard-info-label">{info.label}</div>
            <div className="dashboard-info-value">{info.value}</div>
          </div>
        )
      })}
    </>
  )
}
