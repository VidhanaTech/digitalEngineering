import React from "react"
import { Col, Row } from "@themesberg/react-bootstrap"

export default (props) => {
  return (
    <>
      <div>
        <div className="card-header">
          <Row>
            <Col className="p-0 text-center">{props.title}</Col>
          </Row>
        </div>
        <div className="card-body">{props.children}</div>
      </div>
    </>
  )
}
