import React, {useEffect, useState} from 'react'
import classnames from "classnames";
import { AlignmentItem, ColorBlindnessTestItem, ColorContrastItem } from "Mike/models/designAnalysis";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Form,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane
} from "reactstrap";


const DesignAnalysisResults=() => {
  const [activeArrowTab, setactiveArrowTab] = useState(4);
  const [passedarrowSteps, setPassedarrowSteps] = useState([1]);
  const location = useLocation();
  const data = location.state as any;
  const { state } = location;

  console.log("Data received:", data);
  function toggleArrowTab(tab: any) {
    if (activeArrowTab !== tab) {
      const modifiedSteps = [...passedarrowSteps, tab];

      if (tab >= 4 && tab <= 7) {
        setactiveArrowTab(tab);
        setPassedarrowSteps(modifiedSteps);
      }
    }
  }

  const [contrastData, setContrastData] = useState<ColorContrastItem[] | null>(null);
  const [alignItem, setAlignItem] = useState<AlignmentItem[] | null>(null);
  const [colorBlindness, setColorBlindness] = useState< ColorBlindnessTestItem[] | null>(null);


  useEffect(() => {
    if (data?.data?.colorContrast) {
      setContrastData(data.data.colorContrast);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data?.alignment
    ) {
      setAlignItem(data.data.alignment
      );
    }
  }, [data]);


  useEffect(() => {
    if (data?.data?.colorBlindnessTest) {
      setColorBlindness(data.data.colorBlindnessTest);
    }
  }, [data]);


  return (
    <div className="page-content">
      <Card style={{ backgroundColor: "unset" }}>
        <CardHeader>
          <h2 className="text-center mb-0">Results</h2>
        </CardHeader>
        <CardBody>
          <Form className="form-steps">
            <div className="step-arrow-nav mb-4">
              <Nav className="nav-pills custom-nav nav-justified" role="tablist">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({
                      active: activeArrowTab === 4,
                      done: activeArrowTab <= 6 && activeArrowTab > 3,
                    })}
                    onClick={() => toggleArrowTab(4)}
                  >
                    Color Contrast Test
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({
                      active: activeArrowTab === 5,
                      done: activeArrowTab <= 6 && activeArrowTab > 4,
                    })}
                    onClick={() => toggleArrowTab(5)}
                  >
                    Layout Analysis
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({
                      active: activeArrowTab === 6,
                      done: activeArrowTab <= 6 && activeArrowTab > 5,
                    })}
                    onClick={() => toggleArrowTab(6)}
                  >
                    Accessibility Test
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
        
            <TabContent activeTab={activeArrowTab}>
              <TabPane tabId={4}>
                <Row>
                  <Col className="text-center mb-5">
                    <img className="rounded-1" src={state?.design} alt="design" width={600} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <Table className="table-striped table-nowrap align-middle mb-0">
                            <thead>
                              <tr>
                                <th scope="col">Text</th>
                                <th scope="col">Text Color</th>
                                <th scope="col">Background Color</th>
                                <th scope="col">WCAG 2.1 AA</th>
                                <th scope="col">WCAG 2.1 AAA</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>                             
                             {contrastData?.map((item, index) => (
                                <tr key={index}>
                                  <td className="fw-medium">{item.text}</td>
                                  <td>
                                    <input
                                      type="color"
                                      className="form-control form-control-color"
                                      defaultValue={item.textColor}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="color"
                                      className="form-control form-control-color"
                                      defaultValue={item.backgroundColor}
                                      disabled
                                    />
                                  </td>
                                  <td>
                                    {item.wcag_aa ? (
                                      <i className="ri-checkbox-circle-fill text-success fs-2 ml-2"></i>
                                    ) : (
                                      <i className="ri-close-circle-fill text-danger fs-2 ml-2"></i>
                                    )}
                                  </td>
                                  <td>
                                    {item.wcag_aaa ? (
                                      <i className="ri-checkbox-circle-fill text-success fs-2 ml-2"></i>
                                    ) : (
                                      <i className="ri-close-circle-fill text-danger fs-2 ml-2"></i>
                                    )}
                                  </td>
                                  <td>
                                    <h3 className={`badge ${item.result ? "bg-success" : "bg-danger"}`}>
                                      {item.result ? "Pass" : "Fail"}
                                    </h3>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>

                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tabId={5}>
                <Row>
                  <Col className="text-center mb-5">
                    <img className="rounded-1" src={data?.data?.gridImage} alt="design" width={600} />
                  </Col>
                </Row>
                <Row>
                  {alignItem?.map((item, index) => (
                    <Col key={index}>
                      <Card>
                        <CardBody>
                          <Card>
                            <CardHeader>
                              <h6 className="card-title mb-0">{item.element}</h6>
                            </CardHeader>
                            <Collapse isOpen={true} className="card-body">
                              {item.improvements.map((suggestion, idx) => (
                                <div className="d-flex mt-2" key={idx}>
                                  <i className="ri-checkbox-circle-fill text-success"></i>
                                  <div className="flex-grow-1 ms-2 text-muted">{suggestion}</div>
                                </div>
                              ))}
                            </Collapse>
                          </Card>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane tabId={6}>
                <Row>
                  {colorBlindness?.map((item, index) => (
                    <Col lg={6} key={index}>
                      <Card>
                        <img className="card-img-top img-fluid" src={item.datauri} alt={`${item.type} image`} />
                        <CardBody>
                          <h4 className="card-title mb-2">{item.type}</h4>
                          <p className="card-text text-muted">
                            {item.type === "Tritanopia"
                              ? "Tritanopia is characterized by difficulty distinguishing blue and yellow hues."
                              : item.type === "Deuteranopia"
                              ? "Deuteranopia is a red-green color blindness where green and red hues are hard to distinguish."
                              : "Protanopia is a type of red-green color blindness affecting red perception."}
                          </p>
                          {item.suggestions.map((suggestion, idx) => (
                            <div className="d-flex" key={idx}>
                              <i className="ri-checkbox-circle-fill text-success"></i>
                              <span className="ms-2 text-muted">{suggestion}</span>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </TabContent>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default DesignAnalysisResults;
