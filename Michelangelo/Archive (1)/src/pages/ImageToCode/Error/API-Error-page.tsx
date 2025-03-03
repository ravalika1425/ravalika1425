import React from "react";
import { Col, Container, Row, Button } from "reactstrap";
import comingSoon from "../../../assets/images/coming-soon-img.png";
import { useEditable } from "../Contaxt";

const APIError = () => {
  // document.title = "404 Error Cover | Velzon - React Admin & Dashboard Template";/
  const { handleBackClickImgDropper, setError } = useEditable();
  const handleReload = () => {
    // window.location.href = "/image_to_app";
    setError(null);
    handleBackClickImgDropper();
  };
  return (
    <React.Fragment>
      <div className="auth-page-content">
        <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
          <div className="auth-page-content overflow-hidden p-0">
            <Container>
              <Row className="justify-content-center">
                <Col xl={7} lg={8}>
                  <div className="text-center">
                    <img
                      src={comingSoon}
                      alt="error img"
                      className="img-fluid"
                    />
                    <div className="mt-3">
                      <h3 className="text-uppercase">
                        Something Went's Wrong😭
                      </h3>
                      <h4>Please try again</h4>
                      <Button
                        className=" m-2"
                        color="info"
                        //  onClick={handleButtonClick}
                      >
                        <i className="ri-refresh-line me-1"></i>Retry
                      </Button>
                      <Button color="info" onClick={handleReload}>
                        <i className="ri-arrow-go-back-fill">&nbsp;</i>Back
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default APIError;
