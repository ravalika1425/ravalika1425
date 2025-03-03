import React from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Brainstormer = () => {
  document.title =
    "Brainstormer | Michelangelo - Take your ideas to the next level";
  console.log("Brainstormer");
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Brainstormer" pageTitle="Dashboards" />
          <Row>
            <Col className="col-xxl-12 order-xxl-0 order-first">
              <Row></Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Brainstormer;
