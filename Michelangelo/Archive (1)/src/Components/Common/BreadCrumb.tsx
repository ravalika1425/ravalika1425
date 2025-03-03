import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

interface BreadCrumbProps {
  title: string;
  pageTitle: string;
}

const BreadCrumb = ({ title, pageTitle }: BreadCrumbProps) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div
            style={{
              boxShadow:
                "0 -5px 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0.1, 0, 0, 0.2)",

              background: "white",
            }}
            className="page-title-box d-sm-flex m-1 align-items-center justify-content-between shodow"
          >
            <h4 className="mb-sm-0">{title}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">{pageTitle}</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
