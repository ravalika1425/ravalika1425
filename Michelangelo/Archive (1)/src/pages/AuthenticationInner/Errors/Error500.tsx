import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';

// Import Images
import error500 from "../../../assets/images/error500.png";
import maintenanceImg from '../../../assets/images/maintenance.png';

const Error500 = ({reload,errorState}:any) => {
    document.title = "500 Error | Velzon - React Admin & Dashboard Template";
    function handleReload(){
        console.log("showing")
        reload()
        errorState(null)
    }
    return (
        <React.Fragment>
            
            <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center ">
                <div className="auth-page-content overflow-hidden p-0">
                    <Container fluid={true}>
                        <Row className="justify-content-center">
                            <Col xl={4} className="text-center">
                                <div className="error-500 position-relative">
                                {/* <Row className="justify-content-center mb-5">
                                        <Col xl={4} lg={8}>
                                            <div>
                                                <img src={maintenanceImg} alt="" className="img-fluid" />
                                            </div>
                                        </Col>
                                    </Row> */}
                                    <img src={maintenanceImg} alt="" className="img-fluid" />
                                    {/* <h1 className="title text-muted">500</h1> */}
                                </div>
                                <div>
                                    {/* <h4>Oops! This is on us</h4> */}
                                    <p className="text-muted w-75 mx-auto fs-3">Oops! Something went wrong. Please retry</p>
                                    <Button className="btn btn-primary me-3" onClick={()=>{handleReload()}}><i className=" ri-refresh-line me-1" ></i>Retry</Button>
                                    <Button className="btn btn-primary" onClick={()=>{errorState(null)}}><i className=" ri-arrow-go-back-line me-1" ></i>Back</Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Error500;