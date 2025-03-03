import React from 'react';
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from 'reactstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Mousewheel } from "swiper/modules";

const Widgets = ({data}:any) => {
    return (
        <React.Fragment>
            
            <Col xxl={3} md={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                            <i className="ri-briefcase-line display-5 text-success"></i>
                            </div>
                        </div>
                        <h4 className=" mb-0">Available Balance (USD)</h4>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={3} md={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                            <i className="ri-coin-line display-5 text-success"></i>
                            </div>
                        </div>
                        <h4 className=" mb-0">Send (Previous Month)</h4>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={3} md={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                            <i className="ri-wallet-3-line display-5 text-success"></i>
                            </div>
                        </div>
                        <h4 className="mb-0">Feature extraction of wafery</h4>
                    </CardBody>
                </Card>
            </Col>
            <Col xxl={3} md={6}>
                <Card className="card-animate">
                    <CardBody>
                        <div className="d-flex mb-3">
                            <div className="flex-grow-1">
                            <i className="ri-wallet-3-line display-5 text-success"></i>
                            </div>
                        </div>
                        <h4 className=" mb-0">Receive (Previous Month)</h4>
                    </CardBody>
                </Card>
            </Col>

        </React.Fragment>
    );
};

export default Widgets;