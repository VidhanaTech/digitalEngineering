import React, { useEffect, useState } from "react"
import { Col, Row, Form } from "@themesberg/react-bootstrap"
import Select from "react-select"

export default (props) => {
  return (
    <>
      <div className="card-header">
        <div>{props.title}</div>
        {props.titleColor && (
          <svg height="25" width="25">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              stroke-width="2"
              fill={props.titleColor}
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-2 text-sm card-body">
        {props.children}
      </div>
    </>
  )
}
