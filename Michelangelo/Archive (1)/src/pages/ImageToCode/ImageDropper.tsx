import { useMsal } from "@azure/msal-react";
import { axiosInstance } from "Mike/utils/axiosConfig";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";
import { useEditable } from "./Contaxt";
import AlertComponent from "./Loading/AlertModal";
import { fetchImageToCode,deletImageToCode, PostImageToCode } from "services/imageToCodeServices";

const ImageDropper: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hover, setHover] = useState(false);
  const colorOptions = [
    "#a994b5",
    "#695d70",
    "#8c4db0",
    "#b8dbe0",
    "#5c4691",
    "#bac9db",
    "#9dcdd4",
    "#10b0c7",
    "#babcdb"
  ];

  const getInitialsColor = (index: any) => {
    return colorOptions[index % colorOptions.length];
  };

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  const location = useLocation();
  let { state } = location;
  const {
    handleNextClickPreview,
    handleAcceptedFiles,
    deleteImage,
    selectedFiles,
    handleBoundingBoxEditor,
    setShowAppComponent,
    setApiResponse,
    setImageURI,
    loadingMessage,
    previewAllprojectModalOpen,
    setLoadingMessage,
    togglePrviewAllProjectModal,
    setPreviewAllProjectModalOpen,
    toggleAddProjectNameModal,
    projectName,
    handleAddProjectName,
    setProjectName,
    addProjectNameModalOpen,
    setIsAlertModalOpen,
    isAlertModalOpen,
    category,
    setCategory,
    setErrors,
    errors,
    setCurr_ProjectId,
    curr_projectId,
    projectNameData
  } = useEditable();
  const navigate = useNavigate();

  const toggleImgModal = () => {
    setImgModalOpen(!imgModalOpen);
  };

  const toggleModal = () => {
    setIsAlertModalOpen(!isAlertModalOpen);
  };

  const toggleModalWithImage = (imagePreview: string | null) => {
    if (imagePreview) {
      setModalImage(imagePreview);
    }
    toggleImgModal();
  };

  const [loading, setLoading] = useState(false);
  const { accounts } = useMsal();

  useEffect(() => {
    if (previewAllprojectModalOpen) {
      setLoading(true);
      setLoadingMessage(
        "we will provide all the created projects shortly, please wait..."
      );
  //     const fetchData = async () => {
  //       try {
  //         const response = await PostImageToCode(accounts[0].username);
  //         console.log("Full response object:", response);

  //         const data = response.data;

  //         if (data) {
  //           const sortedProjects = data
  //             .map((item: any) => ({
  //               _id: item.id,
  //               name: item.projectName
  //             }))
  //             .sort((a: any, b: any) => a.name.localeCompare(b.name));
  //           console.log("sorted Projects:", sortedProjects);
  //           setProjects(sortedProjects);
  //         } else {
  //           console.error("No data found in response.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching projects:", error);
  //       } finally {
  //         setLoading(false);
  //         setLoadingMessage("");
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [previewAllprojectModalOpen]);
      axiosInstance
        .post("/image_to_code/get_image_to_code", { author: accounts[0].username })
        .then((response) => {
          console.log("Full response object:", response);

          const data = response.data;

          if (data) {
            const sortedProjects = data
              .map((item: any) => ({
                _id: item.id,
                name: item.projectName
              }))
              .sort((a: any, b: any) => a.name.localeCompare(b.name));
            console.log("sorted Projects:", sortedProjects);
            setProjects(sortedProjects);
          } else {
            console.error("No data found in response.");
          }
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMessage("");
        });
    }
  }, [previewAllprojectModalOpen]);

  // handle Delete project
  const handleDeleteProject = async (projectId: string) => {
    console.log(`Attempting to delete project with id: ${projectId}`);
    if (
      !projectId ||
      typeof projectId !== "string" ||
      projectId.trim() === ""
    ) {
      console.error("Invalid project ID:", projectId);
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Deleting project, please wait...");
      const trimmedProjectId = projectId.trim();
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
      // const response = await axiosInstance.delete(
      //   `/image_to_code/delete_image_to_code?id=${trimmedProjectId}`
      // );

      const response  = await deletImageToCode(trimmedProjectId)
      console.log(response);
      if (response && response.status === 200) {
        console.log(`Project with id ${projectId} deleted successfully`);
      } else {
        setProjects((prevProjects) =>
          prevProjects.concat({
            _id: projectId,
            projectName: "Project Name",
            description: "No description"
          })
        );
      }
    } catch (error: any) {
      console.error(`Error deleting project with id ${projectId}:`, error);
      setProjects((prevProjects) =>
        prevProjects.concat({
          _id: projectId,
          projectName: "Project Name",
          description: "No description"
        })
      );

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    } finally {
      setLoading(false);
      setLoadingMessage(""); // Clear the loading message
    }
  };

  // Handle Get Project By Id
  const handleGetProjectById = async (projectId: string) => {
    if (curr_projectId) {
      setCurr_ProjectId("");
      console.log("Clear Current project Id state", curr_projectId);
    }
    console.log("Project id:", projectId);
    const projectNameInLocal = localStorage.getItem("projectAdded");
    const projectHistoryInLocal = localStorage.getItem("project_Data_History");
    if (projectNameInLocal || projectHistoryInLocal) {
    
      localStorage.clear();
    }
    console.log(`Attempting to fetch project with id: ${projectId}`);
    if (
      !projectId ||
      typeof projectId !== "string" ||
      projectId.trim() === ""
    ) {
      console.error("Invalid project ID:", projectId);
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Fetching project, please wait...");


      // const response = await axiosInstance.get(
      //   `/image_to_code/get_image_to_code/${projectId}`
      // );
      const response = await fetchImageToCode(projectId);
      console.log("Project Data by Id:", response);
      if (response && response.status === 200) {
        console.log(`Project with id ${projectId} fetched successfully`);
        // Handle the fetched project data here
        const fetchedProject = response.data;
        // You might want to update the state or perform some action with the fetched project
        console.log("Fatched project b id: _", fetchedProject);
        setCurr_ProjectId(projectId);

        localStorage.setItem(
          "project_Data_History",
          JSON.stringify(fetchedProject)
        );

        setShowAppComponent("priviewIframe");
        setApiResponse(fetchedProject.code);
        setImageURI(fetchedProject.image[0]);
        console.log("ImageUri", fetchedProject.image[0]);
        togglePrviewAllProjectModal(); // Close the modal after fetching the project
      }
    } catch (error: any) {
      console.error(`Error fetching project with id ${projectId}:`, error);
      // Handle the error appropriately
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    if (state) {
      console.log("Setting code from design")
      
      //setProjectName(state.appName)
      const setupProjectData =async () =>{
        setApiResponse(state.code)
        setImageURI(state.design)
        await handleAddProjectName(state.appName,"NEW_PRODUCT",state.code, state.design)
        console.log("sETTING THE CODE")
        setShowAppComponent("priviewIframe");
        navigate(location.pathname, { replace: true });

      } 
      setupProjectData()
    }
  }, [projectNameData, navigate, location.pathname, setApiResponse, setShowAppComponent, state, setImageURI, handleAddProjectName]);

  const handleMoveToEditor = () => {
    handleBoundingBoxEditor();
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px"
  };

  const rearrangedProjects = [...projects];
  const mostRecentProject = rearrangedProjects.pop();
  rearrangedProjects.unshift(mostRecentProject);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Card style={{ height: "73.5vh" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="text-warning fs-1 rounded">
                    <i className="ri-information-line"></i>
                  </div>
                  <p className="text-muted mb-0" style={{ marginLeft: "10px" }}>
                    You can upload your pencil sketch or your Figma design
                  </p>
                </div>
                <div>
                  <i
                    className="px-2 py-2 mx-2 ri-folder-add-line rounded-pill shadow-lg"
                    onClick={() => setPreviewAllProjectModalOpen(true)}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  ></i>
                  <i
                    className="px-2 py-2 ri-arrow-right-line rounded-pill shadow-lg back-btn"
                    onClick={handleNextClickPreview}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  ></i>
                </div>
              </div>
              <CardBody>
                <Dropzone onDrop={handleAcceptedFiles}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="dropzone dz-clickable" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="dz-message needsclick">
                        <div className="mb-3">
                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                        </div>
                        <h4>Drop files here or click to upload.</h4>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <div className="list-unstyled mb-0" id="file-previews">
                  {selectedFiles.map((f: any, index: number) => (
                    <Card
                      className="mt-1 mb-3 shadow-none border dz-image-preview"
                      key={index + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col className="col-auto">
                            <img
                              data-dz-thumbnail=""
                              height="80"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                              onClick={() => toggleModalWithImage(f.preview)}
                              style={{ cursor: "pointer" }}
                            />
                          </Col>
                          <Col
                            onClick={() => toggleModalWithImage(f.preview)}
                            style={{ cursor: "pointer" }}
                          >
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {f.name}
                            </Link>
                            <p className="mb-0">
                              <strong>{f.formattedSize}</strong>
                            </p>
                          </Col>
                          <Col className="ml-auto">
                            <button
                              className="btn btn-info btn-sm mt-2 mx-3"
                              onClick={handleMoveToEditor}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm mt-2"
                              onClick={() => deleteImage(index)}
                            >
                              Delete
                            </button>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>

      {/* Modal for Image Preview */}
      <Modal isOpen={imgModalOpen} toggle={toggleImgModal} size="lg">
        <ModalHeader toggle={toggleImgModal as any}>Image Preview</ModalHeader>
        <ModalBody>
          {modalImage && (
            <img
              src={modalImage}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </ModalBody>
      </Modal>

      {/* Preview All Project list Modal */}
      <Modal
        isOpen={previewAllprojectModalOpen}
        toggle={togglePrviewAllProjectModal}
        size="lg"
      >
        <ModalHeader
          style={{
            backgroundColor: "#471f5e",
            display: "flex",
            padding: "20px",
            height: "50px",
            position: "relative"
          }}
        >
          <h3 style={{ color: "white", margin: 0 }}>Projects</h3>
          <button
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "30px",
              cursor: "pointer"
            }}
            onClick={togglePrviewAllProjectModal}
          >
            &times;
          </button>
        </ModalHeader>

        <ModalBody>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <InputGroup style={{ flex: 1 }}>
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "2px solid #ced4da",
                  marginTop: "20px",
                  paddingLeft: "10px"
                }}
              />
            </InputGroup>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px"
              }}
            >
              <Card
                style={{
                  width: "30%",
                  backgroundColor: hover ? "#cdb8d9" : "#e0e0e0",
                  marginRight: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s ease"
                }}
                onClick={toggleAddProjectNameModal}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Button
                  color="primary"
                  style={{
                    fontSize: "24px",
                    background: "none",
                    border: "none",
                    color: hover ? "#471f5e" : "#6c757d",
                    padding: 0
                  }}
                >
                  + Add
                </Button>
              </Card>
            </div>

            {loading ? (
              <div className="text-center my-4">
                <Spinner color="primary" />
                <p>{loadingMessage}</p>
              </div>
            ) : (
              <div style={{ height: "350px", overflowY: "auto" }}>
                <div style={gridStyle}>
                  {projects
                    .filter((project) =>
                      project?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((project, index) => {
                      const initials = project?.name
                        ? project.name.slice(0, 2).toUpperCase()
                        : "";
                      const initialsBackgroundColor = getInitialsColor(index);

                      return (
                        <Card
                          key={project?._id || index}
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "250px",
                            position: "relative",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            textAlign: "center",
                            fontSize: "24px",
                            color: "#333",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease"
                          }}
                          className="ribbon-box explore-box card-animate"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                          onClick={() => handleGetProjectById(project?._id)}
                        >
                          <div>
                            <div
                              style={{
                                width: "120px",
                                height: "120px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                backgroundColor: initialsBackgroundColor,
                                color: "#fff",
                                fontSize: "36px"
                              }}
                            >
                              {initials}
                            </div>
                            <h5
                              className="font-size-14"
                              style={{ marginTop: "50px", fontWeight: "bold" }}
                            >
                              {project?.name || "No Name"}
                            </h5>

                            {/* Delete Icon positioned at the top-right corner */}
                            <i
                              className="ri-delete-bin-6-line"
                              style={{
                                position: "absolute",
                                top: "10px", // Adjust as per your design
                                right: "10px", // Adjust as per your design
                                fontSize: "20px",
                                cursor: "pointer",
                                color: "#ff4d4f" // Delete icon color (adjust as needed)
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when clicking delete button
                                handleDeleteProject(project?._id);
                              }}
                            ></i>
                          </div>
                        </Card>
                      );
                    })}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "30px"
                  }}
                >
                  <Button
                    color="primary"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      backgroundColor: "#471f5e",
                      borderColor: "#471f5e"
                    }}
                    onClick={togglePrviewAllProjectModal}
                  >
                    Ok
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* Add Project NameModal */}
      <Modal isOpen={addProjectNameModalOpen} size="md" centered>
        <ModalHeader
          toggle={toggleAddProjectNameModal}
          style={{
            backgroundColor: "#8c4db0",
            display: "flex",
            padding: "10px",
            height: "40px",
            position: "relative"
          }}
          close={
            <button
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "30px",
                cursor: "pointer"
              }}
              onClick={toggleAddProjectNameModal}
            >
              &times;
            </button>
          }
        >
          <h5 style={{ color: "white", margin: "auto" }}>Add Project</h5>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="text-center my-4">
              <Spinner color="primary" />
              <p>{loadingMessage}</p>
            </div>
          ) : (
            <Form>
              <FormGroup>
                <Label for="projectName">Project Name</Label>
                <Input
                  type="text"
                  name="projectName"
                  id="projectName"
                  placeholder="Enter project name"
                  value={projectName}
                  // onChange={(e) => setProjectName(e.target.value)}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (errors.projectName)
                      setErrors((prev) => ({ ...prev, projectName: "" }));
                  }}
                  invalid={!!errors.projectName}
                />
                <FormFeedback>{errors.projectName}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <label htmlFor="vertical" className="form-label">
                  Select the strategy
                </label>
                <Input
                  type="select"
                  required={true}
                  className="form-select"
                  aria-label="Default select example"
                  value={category}
                  // onChange={(e) => setCategory(e.target.value)}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category)
                      setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  invalid={!!errors.category}
                >
                  <option>Select product strategy</option>
                  <option value="NEW_PRODUCT">New Product</option>
                  <option value="LEGACY_MODERNIZATION">
                    Legacy Modernization
                  </option>
                </Input>
                <FormFeedback>{errors.category}</FormFeedback>
              </FormGroup>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button color="primary" onClick={()=>{handleAddProjectName(projectName,category)}}>
                  Add Project
                </Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>

      <AlertComponent
        isAlertModalOpen={isAlertModalOpen}
        toggleModal={toggleModal}
        setPreviewAllProjectModalOpen={setPreviewAllProjectModalOpen}
        title="Project Name Missing"
        desc="The project name or project history is missing. Please add the project name to proceed."
      />
    </React.Fragment>
  );
};

export default ImageDropper;
