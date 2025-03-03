import axios from "axios";
import classnames from "classnames";
import { SitemapModalProps } from "Mike/models/response";
import { axiosInstance } from "Mike/utils/axiosConfig";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane
} from "reactstrap";
import GenerationLoader from "./Loader/GenerationLoder";
import { WIREFRAME_GENERATE } from "Mike/constants";
import { useMsal } from "@azure/msal-react";
import { generateWireFrame } from "services/wireFrameGenratorServices";

const SitemapModal: React.FC<SitemapModalProps> = ({
  sitemapData,
  setGeneratedResponse
}) => {
  const [primaryColor, setPrimaryColor] = useState("#4A90E2");
  const [secondaryColor, setSecondaryColor] = useState("#99DD4D");
  const [tertiaryColor, setTertiaryColor] = useState("#9013FE");
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(
    null
  );
  const [closeCard, setCloseCard] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [customHoverTab, setCustomHoverTab] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { accounts } = useMsal();

  if (!sitemapData) {
    return null;
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!imageUrl.trim()) newErrors.imageUrl = "Image URl is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cancelTokenSource = axios.CancelToken.source();

  const handleGenerate = async () => {
    if (!validateForm()) return;
    if (!imageUrl && !primaryColor && !secondaryColor && !tertiaryColor) return;
    console.log("Handle Click Prompt Refined");

    const sitemapDataString = JSON.stringify(sitemapData);

    const apiPayload = {
      userSignature:accounts[0].username,
      layoutDetails: sitemapDataString,
      brandCustomization: {
        logo: imageUrl,
        colorPalette: [primaryColor, secondaryColor, tertiaryColor]
      }
    };
    setCloseCard(true);
    setIsLoading(true);
    setShowLoader(true);

    try {
      // const response = await axiosInstance.post(
      //   WIREFRAME_GENERATE,
      //   apiPayload,
      //   { cancelToken: cancelTokenSource.token }
      // );

      const response = await generateWireFrame(apiPayload);
      if (response.data.status_code === 200) {
        const newPrompt = response.data.response;
        console.log("Response from Prompt:", newPrompt);
        setGeneratedResponse(newPrompt); // Update parent state
      } else {
        console.log("There seems to be some error");
        console.error("Error response data:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        }
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
    // toggle();
  };

  const handleColorPickerToggle = (pickerName: string) => {
    setActiveColorPicker(activeColorPicker === pickerName ? null : pickerName);
  };

  const handleColorChange = (
    color: any,
    setColor: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { r, g, b } = color.rgb;
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
    setColor(hexColor);
  };
  const renderColorPicker = (
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    label: string,
    pickerName: string
  ) => (
    <div className="mb-4">
      <h5 className="fs-13 text-muted mb-2">{label}</h5>
      <div
        className="nano-colorpicker"
        onClick={() => handleColorPickerToggle(pickerName)}
      >
        <i
          style={{
            height: "28px",
            width: "28px",
            borderRadius: "50%",
            background: color,
            display: "block"
          }}
        />
      </div>
      {activeColorPicker === pickerName && (
        <>
          <Button
            color="danger"
            size="sm"
            className="mt-2"
            onClick={() => setActiveColorPicker(null)}
          >
            X
          </Button>
          <SketchPicker
            color={color}
            onChange={(color: any) => handleColorChange(color, setColor)}
          />
        </>
      )}
    </div>
  );

  const renderSitemap = (data: any, isRoot = true) => {
    if (!data || !data.layout) return null;

    return (
      <ul className="list-unstyled mb-0">
        {isRoot && (
          <li className="p-0 parent-title">
            <a href="/#" className="fw-medium fs-14">{data.userPrompt || "App Name"}</a>
            <a  href="/#" className="fw-medium fs-14">{data.appName || "App Name"}</a>
          </li>
        )}
        <li>
          {data.layout.map(
            (
              section: {
                section:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Iterable<React.ReactNode>
                  | null
                  | undefined;
                subsections: any[];
              },
              index: React.Key | null | undefined
            ) => (
              <div key={index} className="first-list">
                <div className="list-wrap">
                  <a href="/#" className="fw-medium text-primary">
                    <i className="ri-file-list-3-line me-1 align-bottom"></i>
                    {section.section}
                  </a>
                </div>
                {section.subsections && (
                  <ul className="second-list list-unstyled">
                    {section.subsections.map(
                      (
                        subsection: {
                          subsection:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Iterable<React.ReactNode>
                            | null
                            | undefined;
                          elements: any[];
                        },
                        subIndex: React.Key | null | undefined
                      ) => (
                        <li key={subIndex}>
                          <a href="/#">{subsection.subsection}</a>
                          {subsection.elements && (
                            <ul className="third-list list-unstyled">
                              {subsection.elements.map(
                                (
                                  element: {
                                    type:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | Iterable<React.ReactNode>
                                      | null
                                      | undefined;
                                    label:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | Iterable<React.ReactNode>
                                      | null
                                      | undefined;
                                  },
                                  elemIndex: React.Key | null | undefined
                                ) => (
                                  <li key={elemIndex}>
                                    <a href="/#">
                                      {element.type}: {element.label}
                                    </a>
                                  </li>
                                )
                              )}
                              {subsection.elements.map(
                                (element: any, elemIndex: number) => (
                                  <li key={elemIndex}>
                                    <a href="/#">
                                      {element.type}: {element.label}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            )
          )}
        </li>
      </ul>
    );
  };

  const customHovertoggle = (tab: string) => {
    if (customHoverTab !== tab) {
      setCustomHoverTab(tab);
    }
  };

  const cancelRequest = () => {
    cancelTokenSource.cancel("Request canceled by user.");
    setShowLoader(false);
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1050,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}
      >
        {!closeCard && (
          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0.2, 0.2, 0.3)",
              minWidth: "400px",
              maxWidth: "600px",
              width: "100%",
              position: "relative",
              marginLeft: "5% auto",
              maxHeight: "60vh"
            }}
          >
            <CardHeader
              style={{
                background: "#482668",
                color: "white",

                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px"
              }}
              className="text-white"
            >
              Create Your App
            </CardHeader>
            <CardBody
              className="bg-gradient-to-b from-gray-100 to-gray-200 p-6 bg-white"
              style={{
                minWidth: "400px",
                maxWidth: "600px",
                width: "100%",
                position: "relative",
                margin: "5% auto",
                maxHeight: "100vh",
                overflow: "auto"
              }}
            >
              <Nav
                pills
                className="nav nav-pills custom-hover-nav-tabs"
                style={{
                  padding: "20px"
                }}
              >
                <NavItem>
                  <NavLink
                    style={{
                      cursor: "pointer",
                      color: "black",
                      border: "none"
                    }}
                    className={classnames({ active: customHoverTab === "1" })}
                    onClick={() => customHovertoggle("1")}
                  >
                    <i className="ri-file-text-line nav-icon nav-tab-position"></i>
                    <h5 className="nav-titl nav-tab-position m-0">
                      Layout Details
                    </h5>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{
                      cursor: "pointer",
                      color: "black",
                      border: "none"
                    }}
                    className={classnames({ active: customHoverTab === "2" })}
                    onClick={() => customHovertoggle("2")}
                  >
                    <i className="ri-code-box-line nav-icon nav-tab-position"></i>
                    <h5 className="nav-titl nav-tab-position m-0">
                      Brand Customization
                    </h5>
                  </NavLink>
                </NavItem>
                <NavItem></NavItem>
              </Nav>
              <TabContent
                activeTab={customHoverTab}
                className="text-muted"
                style={{
                  padding: "20px"
                }}
              >
                <TabPane
                  tabId="1"
                  id="custom-hover-preview"
                  title="Preview Output"
                >
                  <div className="verti-sitemap ">
                    {renderSitemap(sitemapData, true)}
                  </div>
                </TabPane>

                <TabPane
                  tabId="2"
                  id="custom-hover-preview"
                  title="Preview Output"
                >
                  {" "}
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label
                          for="imageurl"
                          className="text-lg font-semibold text-gray-700 mt-4"
                        >
                          Image URL
                        </Label>
                        <Input
                          type="text"
                          id="appName"
                          value={imageUrl}
                          // onChange={(e) => setImageUrl(e.target.value)}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            if (errors.imageUrl)
                              setErrors((prev) => ({ ...prev, imageUrl: "" }));
                          }}
                          invalid={!!errors.imageUrl}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          placeholder="Enter image URL"
                        />
                        <FormFeedback>{errors.imageUrl}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="8">
                      <Label
                        for="imageurl"
                        className="text-lg font-semibold text-gray-700 mt-3"
                      >
                        Color Palette
                      </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="4">
                      {renderColorPicker(
                        primaryColor,
                        setPrimaryColor,
                        "Primary",
                        "primary"
                      )}
                    </Col>
                    <Col sm="4">
                      {renderColorPicker(
                        secondaryColor,
                        setSecondaryColor,
                        "Secondary",
                        "secondary"
                      )}
                    </Col>
                    <Col sm="4">
                      {renderColorPicker(
                        tertiaryColor,
                        setTertiaryColor,
                        "Tertiary",
                        "tertiary"
                      )}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "20px"
              }}
            >
              {/* <Button
              onClick={goBack}
              style={{background: "#482668", border:'none', width:'18%', marginRight:'10px'}}
            >
              Back
            </Button> */}
              <Button
                color="primary"
                onClick={handleGenerate}
                style={{ border: "none" }}
              >
                {!isLoading ? (
                  "Generate"
                ) : (
                  <div className="flex items-center">
                    <Spinner size="sm" color="info" />
                    <span className="ms-2">Loading...</span>
                  </div>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
      <GenerationLoader cancelRequest={cancelRequest} isLoading={showLoader} />
    </React.Fragment>
  );
};

export default SitemapModal;
