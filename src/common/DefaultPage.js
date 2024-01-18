import React from "react";
import { Col, Row, Container } from "@themesberg/react-bootstrap";

const DefaultPage = () => {
  return (
    // <main>
    <section className="vh-80 d-flex align-items-center justify-content-center">
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
                Role Cannot assigned. Please contact Admin.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    // </main>
  );
};

export default DefaultPage;
