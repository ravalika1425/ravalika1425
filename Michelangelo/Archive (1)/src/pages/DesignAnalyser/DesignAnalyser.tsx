import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import colorContrastTest from "../../assets/images/color_contrast_test.png";
import layoutAnalysis from "../../assets/images/layout_analysis.png";
import accessibilityTest from "../../assets/images/accessibility_test.png";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { getDesignAnalysis } from "services/designAnalyserService";
import LoadingComponent from "pages/ImageToCode/Loading/DownloadLoader";
import { DesignAnalysisRequest } from "Mike/models/designAnalysis";
import { useMsal } from "@azure/msal-react";
const DesignAnalyser: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState([false, false, false]);
  const [selectedFiles, setselectedFiles] = useState<any>([]);
  const [designInput, setDesignInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { accounts } = useMsal();

  const handleCardClick = (index: number) => {
    const newSelectedCards = selectedCards.map((selected, i) =>
      i === index ? !selected : selected
    );
    setSelectedCards(newSelectedCards);
  };

  const handleAcceptedFiles = (files: any[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageURI = reader.result as string;
        // console.log("image uri", imageURI)
        const newFile = {
          name: file.name,
          preview: URL.createObjectURL(file),
          byteURI: [imageURI],
          formattedSize: formatBytes(file.size),
        };

        setselectedFiles((prevFiles: any) => [...prevFiles, newFile]);
        setDesignInput(imageURI);
      };

      reader.readAsDataURL(file);
    });
  };

  async function onAnalyseClicked() {
    setLoading(true)
    const testNames = [
      "color_contrast_test",
      "layout_analysis",
      "accessibility_test",
    ];
    const testsToPerform = selectedCards
      .map((flag, index) => (flag ? testNames[index] : null))
      .filter((test) => test !== null) as string[];

    const payload: DesignAnalysisRequest = {
      userSignature:accounts[0].username,
      datauri: designInput,
      tests: testsToPerform,
    };
    const response = await getDesignAnalysis(payload);
    const data = {
      design: designInput,
      ...response.data,
    };

    setLoading(false)
    console.log("data:", data)
    console.log("datadesign", data.data.
      colorContrast.text)
    navigate("/design_analyser/results", { state: data });
  }

  function formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const deleteImage = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setselectedFiles(updatedFiles);

    if (updatedFiles.length === 0) {
      setselectedFiles([]);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleModalWithImage = (imagePreview: string | null) => {
    if (imagePreview) {
      setModalImage(imagePreview);
    }
    toggleModal();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="text-center">
            <h1> Design Analyser</h1>
          </Row>
          <Row>
            <Card style={{ height: "73.5vh", backgroundColor: "unset" }}>
              <CardBody>
                <p className="text-muted">
                  Upload your Figma design and get instant feedback.
                </p>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    handleAcceptedFiles(acceptedFiles);
                  }}
                >
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
                            className="cursor-pointer"
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
                          <Col className="ml-auto text-end">
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
                <h5 className="mt-5 "> Choose the tests you want to perform</h5>
                <Row className="mt-5">
                  <Col>
                    <Card
                      className={`card-animate cursor-pointer ${
                        selectedCards[0] ? "card-border-success border" : ""
                      }`}
                      onClick={() => handleCardClick(0)}
                    >
                      <img
                        className="card-img-top img-fluid"
                        src={colorContrastTest}
                        alt="Card cap"
                      />
                      <CardBody>
                        <h4 className="card-title mb-2">Color Contrast Test</h4>
                        <p className="card-text mb-0">
                          Evaluates the difference in luminance between
                          foreground and background colors to ensure text and
                          elements are easily readable.
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className={`card-animate cursor-pointer ${
                        selectedCards[1] ? "card-border-success border" : ""
                      }`}
                      onClick={() => handleCardClick(1)}
                    >
                      <img
                        className="card-img-top img-fluid"
                        src={layoutAnalysis}
                        alt="Card cap"
                      />
                      <CardBody>
                        <h4 className="card-title mb-2">Layout Analysis</h4>
                        <p className="card-text mb-0">
                          Evaluates the symmetry, positioning, and alignment of
                          UI elements within your Figma design, ensuring a
                          balanced and well-structured user interface.
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card
                      className={`card-animate cursor-pointer ${
                        selectedCards[2] ? "card-border-success border" : ""
                      }`}
                      onClick={() => handleCardClick(2)}
                    >
                      <img
                        className="card-img-top img-fluid"
                        src={accessibilityTest}
                        alt="Card cap"
                      />
                      <CardBody>
                        <h4 className="card-title mb-2">Accessibility test</h4>
                        <p className="card-text mb-0">
                          Tests the visibility of colors in your Figma design
                          for individuals with deuteranopia, protanopia, and
                          tritanopia, ensuring an inclusive user experience
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Button
                      color="primary"
                      className="btn-label rounded-pill btn-lg w-lg"
                      onClick={onAnalyseClicked}
                      disabled={selectedFiles.length === 0}
                    >
                      {" "}
                      <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>{" "}
                      <span className="fw-bold">Analyse</span>{" "}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal as any}>Image Preview</ModalHeader>
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
      {loading ? (
        <LoadingComponent
          title="Analysing your design"
          desc="Please wait"
          cancelRequest={null}
        />
      ) : null}
    </React.Fragment>
  );
};

export default DesignAnalyser;
