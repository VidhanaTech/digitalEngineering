import React from "react";
import { Col, Row, Container } from "@themesberg/react-bootstrap";

const RegisterMsg = () => {
  return (
    // <main>
    <section className="vh-100 d-flex align-items-center justify-content-center">
      <Container>
        <Row>
          <Col
            xs={12}
            className="text-center d-flex align-items-center justify-content-center"
          >
            <div>
              {/* <Card.Link as={Link} to={Routes.DashboardOverview.path}>
                  <Image src={NotFoundImage} className="img-fluid w-75" />
                </Card.Link>
                <h1 className="text-primary mt-5">
                  Page not <span className="fw-bolder">found</span>
                </h1> */}
              <p className="lead my-4">
                Thanks for registering with portray 360, your request is pending
                with the admin. you'll get the login access once the admin
                approves
              </p>
              <a href="/" style={{ color: "rgb(70, 75, 193)" }}>
                Sign In
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    // </main>
  );
};

export default RegisterMsg;
