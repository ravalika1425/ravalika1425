import Editor from "@monaco-editor/react";
import { EXISTING_I2C_PROJECT, NEW_I2C_PROJECT } from "Mike/constants";
import { axiosInstance } from "Mike/utils/axiosConfig";
import axios from "axios";
import classnames from "classnames";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Tooltip,
  UncontrolledDropdown
} from "reactstrap";
import faqimg from "../../../src/assets/images/faq-img.png";
import { useEditable } from "./Contaxt";
import LoadingComponent from "./Loading/DownloadLoader";
import "./PreviewFrame.css"; // Import your CSS file for component-specific styles
import {generateImage_I2C, imageToCodeConvert } from "services/imageToCodeServices";
// import { C } from "@fullcalendar/core/internal-common";

const IframePreview: React.FC = () => {
  const [customHoverTab, setCustomHoverTab] = useState<string>("1");
  const [htmlContent, setHtmlContent] = useState<string>("");

  const [iframeWidth, setIframeWidth] = useState<string>("100%");
  const [iframeHeight, setIframeHeight] = useState<string>("67vh");
  // const [showComponent, setShowComponent] = useState<string>(""); // State to control which component to show

  const [, setExportToReact] = useState<string>("");

  const [exportToAngular, setExportToAngular] = useState<{
    html: string;
    css: string;
    ts: string;
    module: string;
  }>({
    html: "",
    css: "",
    ts: "",
    module: ""
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    desc: ""
  });
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const editorRef = useRef(null);
  const [, setState] = useState<any>(null);
  const [projectName, setProjectName] = useState();
  // Paganation
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(6);
  const { accounts } = useMsal();
  // const handleCardClick = (code: string) => {
  //   setSelectedCode(code);
  // };

  let source = axios.CancelToken.source();

  const cancelRequest = () => {
    if (source) {
      source.cancel("API request canceled by the user.");
    }
  };
  const {
    handleNextClickCanvas,
    handleBackClickImgDropper,
    apiResponse,
    setApiResponse,
    history,
    setHistory,
    selectedButton,
    setSelectedButton,
    handleEditScreenshot,
    isEditButtonDisabled,
    setScreenshotsData,
    cancelGetScreenshot,
    setCancelGetScreenshot,
    handleEditMergedProjectData,
    handleScreenshot,
    currentHistoryData,
    setSelectedCode
  } = useEditable();

  const [tooltipOpen, setTooltipOpen] = useState(true);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const tooltipMessage = !isEditButtonDisabled
    ? "Loading Editor..."
    : "Smart Editor";

  // Toggle tooltip on hover
  const handleMouseOver = () => {
    if (!isEditButtonDisabled) {
      setTooltipOpen(true);
    }
  };
  const handleMouseOut = () => {
    setTooltipOpen(false);
  };

  // Handle API for React Code Response and Download
  const handleExportReactCode = async () => {
    console.log("Handle Click for API response in React");
    source = axios.CancelToken.source();
    const apiPayload = {
      userSignature:accounts[0].username,
      mode: "MLO_HTML_TO_REACT",
      technology: "React",
      code: apiResponse
    };
    setModalContent({ title: "Exporting Code", desc: "Please Wait..." });
    setLoading(true);

    setError(null);

    try {
      // const response = await axiosInstance.post("/image_to_code/code_convert", apiPayload, {
      //   cancelToken: source.token
      // });
      const response = await imageToCodeConvert(apiPayload);
      if (response.data.status_code === 200) {
        const newCode = response.data.converted_code;
        console.log("newCode_React", newCode);
        setExportToReact(newCode);

        // Handle Download/Export React code
        const blob = new Blob([newCode], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "reactComponent.js");
      } else {
        console.log("There seems to be some error");
        console.error("Error response data:", response.data);
        setError("Failed to get a valid response from the server.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request canceled:", error.message); // Handle cancellation specifically
      } else if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
          setError(
            `Server error: ${error.response.data.message || error.message}`
          );
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect to initialize the history from localStorage
  useEffect(() => {
    if (htmlContent && htmlContent.trim()) {
      // const storedData = localStorage.getItem("project_Data_History");
      const storedData = localStorage.getItem("projectAdded");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setHistory(parsedData.history || []);
        setState(parsedData);
      }
    }
  }, [htmlContent]);

  const handleExportAngularCode = async () => {
    console.log("Handle Click for API response in Angular");

    // Generate a new cancel token source for this specific request
    source = axios.CancelToken.source();

    const apiPayload = {
      userSignature:accounts[0].username,
      mode: "MLO_HTML_TO_ANGULAR",
      technology: "Angular",
      code: apiResponse
    };
    setModalContent({ title: "Exporting Code", desc: "Please Wait..." });
    setLoading(true);
    setError(null);

    try {
      // const response = await axiosInstance.post("/image_to_code/code_convert", apiPayload, {
      //   cancelToken: source.token
      // });
      const response = await imageToCodeConvert(apiPayload);
      if (response.data.status_code === 200) {
        const newCode = response.data.converted_code;
        console.log("newCode_Angular", newCode);
        setExportToAngular(newCode);

        // Handle Download/Export Angular code
        const zip = new JSZip();

        // Extract content based on file extensions
        const htmlFile = Object.entries(newCode).find(([key]) =>
          key.includes(".html")
        )?.[1];
        const cssFile = Object.entries(newCode).find(([key]) =>
          key.includes(".css")
        )?.[1];
        const tsFile = Object.entries(newCode).find(([key]) =>
          key.includes(".ts")
        )?.[1];
        const moduleTsFile = Object.entries(newCode).find(([key]) =>
          key.includes(".module.ts")
        )?.[1];

        // Ensure files are valid strings before adding them to the zip
        if (htmlFile && typeof htmlFile === "string")
          zip.file("app.component.html", htmlFile);
        if (cssFile && typeof cssFile === "string")
          zip.file("app.component.css", cssFile);
        if (tsFile && typeof tsFile === "string")
          zip.file("app.component.ts", tsFile);
        if (moduleTsFile && typeof moduleTsFile === "string")
          zip.file("app.module.ts", moduleTsFile);

        // Generate and save zip file
        zip
          .generateAsync({ type: "blob" })
          .then((content) => {
            saveAs(content, "angularComponent.zip");
          })
          .catch((error) => {
            console.error("Error generating zip file:", error);
          });
      } else {
        console.log("There seems to be some error");
        console.error("Error response data:", response.data);
        setError("Failed to get a valid response from the server.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn("Request canceled:", error.message); // Handle the canceled request
      } else if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
          setError(
            `Server error: ${error.response.data.message || error.message}`
          );
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exportToAngular.html) {
      setHtmlContent(exportToAngular.html); // Set initial HTML content for preview
    }
  }, [exportToAngular]);

  // const navigate = useNavigate();

  const customHovertoggle = (tab: string) => {
    if (customHoverTab !== tab) {
      setCustomHoverTab(tab);
    }
  };

  useEffect(() => {
    // Check if htmlContent exists and is not empty
    if (htmlContent && htmlContent.trim()) {
      handleScreenshot();
    }
  }, [htmlContent]);

  useEffect(() => {
    if (apiResponse) {
      setHtmlContent(apiResponse);
      setSelectedCode(apiResponse);
      console.log("Handl Screenshot called");
    }
  }, [apiResponse, setApiResponse]);

  useEffect(() => {
    const project_data_string =
      localStorage.getItem(EXISTING_I2C_PROJECT) || "";
    console.log("project data:", project_data_string);

    if (project_data_string) {
      const project_data = JSON.parse(project_data_string);
      setHistory(project_data.history);
    }
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || "";
    setHtmlContent(newContent);
    setSelectedCode(newContent);
    try {
      new DOMParser().parseFromString(newContent, "text/html");
    } catch (e) {
      console.error("Parsing error", e);
    }
  };

  const handleMainCardClick = (code: string) => {
    setSelectedCode(code);
    setHtmlContent(code);
    customHovertoggle("1"); // Switch to the Preview tab
  };

  const handleButtonClick = (
    width: string,
    height: string,
    buttonName: string
  ) => {
    setIframeWidth(width);
    setIframeHeight(height);
    setSelectedButton(buttonName);
  }; // Define editorRef type

  // Download the html code as a file
  const handleDownloadCodeAsFile = async () => {
    setModalContent({ title: "Exporting Code", desc: "Please Wait..." });
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  // Handle Generate image
  const handleGenerateImage = async () => {
    // Cancel the get_screenshot request if it is in progress.
    if (cancelGetScreenshot) {
      cancelGetScreenshot();
      setCancelGetScreenshot(null); // Reset the cancel function after canceling the request
    }
    setScreenshotsData([]); // Reset the screenshots data
    const apiPayload = {
      userSignature:accounts[0].username,
      html: apiResponse // Pass the current HTML as the payload
    };
    setModalContent({ title: "Generating Images", desc: "Please wait..." });
    setLoading(true); // Set loading to true to indicate the process has started
    setError(null); // Reset any previous errors
    let newCode;
    try {
      const response = await generateImage_I2C(apiPayload);
      // const response = await axiosInstance.post(
      //   "/image_to_code/generate_images", // The endpoint for generating images
      //   apiPayload, // Pass the HTML in the request
      //   {
      //     cancelToken: source.token // Set up cancelToken to allow cancelling the request if needed
      //   }
      // );

      // If the response contains HTML, process it

      if (response.data.html) {
        newCode = response.data.html;
        setSelectedCode(newCode);
        setApiResponse(newCode);
        if (newCode) {
          await handleEditMergedProjectData(newCode);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
          setError(
            `Server error: ${error.response.data.message || error.message}`
          );
        } else {
          setError(`Network error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      // Call handleEditMergedProjectData with the generated code

      setScreenshotsData([]); // Clear the screenshots data
      setLoading(false); // Stop the loading indicator
    }

    console.log("history storage data In:", currentHistoryData);
  };

  useEffect(() => {
    console.log("api Response L:", apiResponse);
    if (apiResponse) {
      // Assuming 'projectData' contains the selected project info in local storage
      const projectAddedKey = NEW_I2C_PROJECT;
      const projectHistoryKey = EXISTING_I2C_PROJECT;

      const key = localStorage.getItem(projectAddedKey)
        ? projectAddedKey
        : localStorage.getItem(projectHistoryKey)
        ? projectHistoryKey
        : projectAddedKey;

      const projectData = localStorage.getItem(key) || "";
      const parsedProject = JSON.parse(projectData);
      setProjectName(parsedProject.projectName);
    }
  }, [apiResponse, setApiResponse]);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = history.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(history.length / cardsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const renderPaginationControls = () => {
    return (
      <div
        className="d-flex justify-content-center align-items-center mt-3"
        style={{
          borderRadius: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5"
        }}
      >
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="mx-2 pagination-btn"
          style={{
            borderRadius: "50%",
            padding: "8px",
            backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
            border: "none"
          }}
        >
          <i
            className="ri-arrow-left-double-line"
            style={{
              fontSize: "20px",
              color: currentPage === 1 ? "#666" : "#fff"
            }}
          ></i>
        </Button>

        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "0 15px",
            color: "#333"
          }}
        >{`${currentPage} / ${totalPages}`}</span>

        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="mx-2 pagination-btn"
          style={{
            borderRadius: "50%",
            padding: "8px",
            backgroundColor: currentPage === totalPages ? "#ccc" : "#007bff",
            border: "none"
          }}
        >
          <i
            className="ri-arrow-right-double-line"
            style={{
              fontSize: "20px",
              color: currentPage === totalPages ? "#666" : "#fff"
            }}
          ></i>
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Card>
          {loading && (
            <div
              className="loading-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: to give a slight overlay effect
                zIndex: 999 // Ensures it's on top of other elements
              }}
            >
              <LoadingComponent
                title={modalContent.title}
                desc={modalContent.desc}
                cancelRequest={cancelRequest}
              />
            </div>
          )}

          <div
            className="border-black"
            style={{
              position: "absolute",
              top: "30px",
              left: "45%",
              padding: "8px",
              fontSize: "24px"
            }}
          >
            <i
              aria-label="back buttton"
              className="px-3 py-3 mx-2 ri-arrow-left-line rounded-pill shadow-lg back-btn"
              onClick={handleBackClickImgDropper}
              style={{ cursor: "pointer" }}
            ></i>
            <i
              className="px-3 py-3 mx-2 ri-arrow-right-line rounded-pill shadow-lg back-btn"
              onClick={handleNextClickCanvas}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <CardTitle>
            <Nav pills className="nav nav-pills custom-hover-nav-tabs">
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: customHoverTab === "1" })}
                  onClick={() => customHovertoggle("1")}
                >
                  <i className="ri-file-text-line nav-icon nav-tab-position"></i>
                  <h5 className="nav-titl nav-tab-position m-0">Preview</h5>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: customHoverTab === "2" })}
                  onClick={() => customHovertoggle("2")}
                >
                  <i className="ri-code-box-line nav-icon nav-tab-position"></i>
                  <h5 className="nav-titl nav-tab-position m-0">Editor</h5>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: customHoverTab === "3" })}
                  onClick={() => customHovertoggle("3")}
                >
                  <i className="ri-time-line nav-icon nav-tab-position"></i>
                  <h5 className="nav-titl nav-tab-position m-0">History</h5>
                </NavLink>
              </NavItem>
            </Nav>
          </CardTitle>
          <CardBody>
            <TabContent activeTab={customHoverTab} className="text-muted">
              <UncontrolledDropdown
                style={{
                  position: "absolute",
                  top: "25px",
                  right: "0"
                }}
              >
                <DropdownToggle
                  className="arrow-none"
                  tag="a"
                  color="white"
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    position: "absolute",
                    top: "10px",
                    right: "20px"
                  }}
                >
                  <i
                    aria-label="back buttton"
                    className="px-3 py-3 mx-2 ri-file-download-fill rounded-pill shadow-lg back-btn"
                  ></i>
                </DropdownToggle>
                <DropdownMenu
                  className="dropdown-menu-end"
                  style={{ fontSize: "16px" }}
                >
                  <DropdownItem
                    className="edittask-details"
                    onClick={handleDownloadCodeAsFile}
                  >
                    <i className="ri-file-download-line"> </i>
                    &nbsp; Export to HTML
                  </DropdownItem>
                  <DropdownItem
                    className="deletetask"
                    onClick={handleExportReactCode}
                  >
                    <i className="ri-reactjs-line"></i>
                    &nbsp; Export to React JS
                  </DropdownItem>
                  <DropdownItem
                    className="deletetask"
                    onClick={handleExportAngularCode}
                  >
                    <i className="ri-angularjs-line"></i>
                    &nbsp; Export To Angular
                  </DropdownItem>
                  {/* <DropdownItem className="deletetask">
                        <i className="ri-vuejs-line"></i>
                        &nbsp; Export to Vue JS
                      </DropdownItem> */}
                </DropdownMenu>
              </UncontrolledDropdown>
              <TabPane
                tabId="1"
                id="custom-hover-preview"
                // title="Preview Output"
              >
                <div style={{ position: "relative" }}>
                  <h6>Preview Output</h6>
                </div>

                <div
                  style={{
                    border: "1px solid #ccc",
                    marginBottom: "30px",
                    textAlign: "center"
                  }}
                >
                  <div
                    className="mt-2 px-2 icon-container"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "12px",
                      padding: "2px",
                      display: "inline-block"
                    }}
                  >
                    <i
                      className={`ri-computer-line p-1 ${
                        selectedButton === "computer" ? "selected" : ""
                      }`}
                      style={{ fontSize: "32px", cursor: "pointer" }}
                      onClick={() =>
                        handleButtonClick("100%", "100vh", "computer")
                      }
                      onMouseEnter={(e) =>
                        e.currentTarget.classList.add("hover-effect")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("hover-effect")
                      }
                    ></i>
                    <i
                      className={`ri-smartphone-line p-1 ${
                        selectedButton === "smartphone" ? "selected" : ""
                      }`}
                      style={{ fontSize: "32px", cursor: "pointer" }}
                      onClick={() =>
                        handleButtonClick("360px", "700px", "smartphone")
                      }
                      onMouseEnter={(e) =>
                        e.currentTarget.classList.add("hover-effect")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("hover-effect")
                      }
                    ></i>
                    <i
                      className={`ri-tablet-line p-1 ${
                        selectedButton === "tablet" ? "selected" : ""
                      }`}
                      style={{ fontSize: "32px", cursor: "pointer" }}
                      onClick={() =>
                        handleButtonClick("768px", "650px", "tablet")
                      }
                      onMouseEnter={(e) =>
                        e.currentTarget.classList.add("hover-effect")
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("hover-effect")
                      }
                    ></i>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <iframe
                      className="d-flex justify-content-center align-item-center"
                      id="preview-iframe"
                      title="preview"
                      srcDoc={htmlContent || ""}
                      style={{
                        width: iframeWidth,
                        height: iframeHeight,
                        transition: "width 0.3s ease-in-out"
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleGenerateImage}
                  className="back-btn"
                  style={{
                    position: "absolute",
                    top: "99px",
                    right: "90px",
                    borderRadius: "35px",
                    color: "white"
                  }}
                >
                  Generate Image
                </Button>
                <Button
                  className="btn-icon btn-btn-secondary"
                  id="edit_button"
                  role="button"
                  style={{
                    backgroundColor: "secondary",
                    position: "absolute",
                    top: "100px",
                    right: "35px",
                    borderRadius: "35px",
                    color: "white"
                  }}
                  onClick={handleEditScreenshot}
                  disabled={!isEditButtonDisabled} // This controls the button's disabled state
                  onMouseOver={handleMouseOver} // Show tooltip on hover
                  onMouseOut={handleMouseOut} // Hide tooltip when mouse leaves
                >
                  {!isEditButtonDisabled &&
                    document.getElementById("edit_button") && (
                      <Tooltip
                        placement="bottom"
                        isOpen={tooltipOpen} // Tooltip will only show when the button is disabled
                        autohide={false}
                        fade={true}
                        target="edit_button"
                        toggle={toggle}
                        style={{
                          backgroundColor: "#000",
                          color: "#fff",
                          borderRadius: "8px"
                        }}
                      >
                        {tooltipMessage}
                      </Tooltip>
                    )}
                  <i
                    style={{
                      fontSize: "30px",
                      transition: "transform 0.2s ease-in-out"
                    }}
                    className={`ri-pencil-fill fs-6 back-btn ${
                      isEditButtonDisabled ? "icon-disabled" : "icon-enabled"
                    }`} // Dynamic icon styling
                  ></i>
                </Button>

                <div
                  style={{
                    position: "absolute",
                    top: "100px",
                    left: "35px",
                    borderRadius: "35px",
                    textAlign: "start",
                    marginBottom: "10px",
                    fontWeight: "bold"
                  }}
                >
                  <h5>
                    {projectName
                      ? `Project: ${projectName}`
                      : "No Project Selected"}
                  </h5>
                </div>
              </TabPane>

              <TabPane tabId="2" id="custom-hover-editor">
                <div style={{ position: "relative" }}>
                  <h6>HTML Code Editor</h6>
                </div>
                <Editor
                  height="72vh"
                  defaultLanguage="html"
                  value={htmlContent}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    automaticLayout: true,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on"
                  }}
                />
              </TabPane>

              <TabPane tabId="3" id="custom-hover-console">
                <h6>History</h6>
                {!history || history.length === 0 ? (
                  <div
                    className="text-center"
                    style={{
                      border: "1px solid #ccc",
                      height: "61vh",
                      width: "100%"
                    }}
                  >
                    <img
                      src={faqimg}
                      alt="No History Found"
                      style={{ width: "50vw", height: "50vh" }}
                    />
                    <h2 className="animated">History Not Found</h2>
                  </div>
                ) : (
                  <div
                    className="row"
                    style={{
                      border: "1px solid #ccc",
                      width: "100%"
                    }}
                  >
                    {renderPaginationControls()}
                    {currentCards.map((code, index) => (
                      <div key={index} className="col-md-6 mb-3">
                        <Card>
                          <CardBody>
                            <CardTitle>
                              Preview History {indexOfFirstCard + index + 1}
                            </CardTitle>
                            <div>
                              <i
                                style={{
                                  position: "absolute",
                                  top: "9%",
                                  left: "85%",
                                  padding: "7px 11px",
                                  fontSize: "20px"
                                }}
                                className="ri-delete-bin-6-line rounded-pill shadow-lg back-btn"
                              ></i>
                              <i
                                style={{
                                  position: "absolute",
                                  top: "9%",
                                  left: "75%",
                                  padding: "7px 11px",
                                  fontSize: "20px"
                                }}
                                className="ri-code-box-line rounded-pill shadow-lg back-btn"
                                onClick={() => handleMainCardClick(code)}
                              ></i>
                              <iframe
                                srcDoc={code}
                                title={`History Item ${
                                  indexOfFirstCard + index + 1
                                }`}
                                sandbox="allow-scripts"
                                width="100%"
                                height="550px"
                              ></iframe>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
                {renderPaginationControls()}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
        {/* AlertComponent for Missing Project Info */}
      </div>
    </React.Fragment>
  );
};

export default IframePreview;
