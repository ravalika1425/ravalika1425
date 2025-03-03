import React, { useState } from "react";
// import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import axios from "axios";
import { UnderstandingFragment } from "Mike/models/response";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import icon1 from "../../../src/assets/images/svg/crypto-icons/tnt.svg";
import icon2 from "../../../src/assets/images/svg/crypto-icons/tomo.svg";
import icon3 from "../../../src/assets/images/svg/crypto-icons/tzc.svg";
import icon4 from "../../../src/assets/images/svg/crypto-icons/uni.svg";
import "./scss/Understanding.scss";
// import { ApiService } from "Mike/utils/apiService";
// import { axiosInstance } from "Mike/utils/axiosConfig";
import { useMsal } from "@azure/msal-react";
import { regenarateBrainStormer } from "services/brainStormerServices";
// import { axiosInstance } from "Mike/utils/axiosConfig";
interface CardData {
  [key: string]: { title: string; description: string; tags: string[] };
}

const cardData: CardData = {
  problem: {
    title: "Problem",
    description:
      "Issues or pain points that the app aims to address or resolve for its users.",
    tags: ["problem", "pain point", "issues"]
  },
  alternatives: {
    title: "Alternatives",
    description:
      "A list of other existing apps or solutions that are similar to our product, providing potential customers with alternative options they might consider.",
    tags: ["alternatives", "similar apps"]
  },
  solutions: {
    title: "Solutions",
    description:
      "The solutions the app provides to solve the identified problems, highlighting its key functionalities and features.",
    tags: ["solutions", "functionalities", "features"]
  },
  keyMetrics: {
    title: "Key Metrics",
    description:
      "Critical indicators that measure the app's success and performance. These metrics are essential for evaluating the app's impact and growth.",
    tags: ["performance", "success", "metrics"]
  },
  valueProposition: {
    title: "Value Proposition",
    description:
      "Benefits and advantages that the app offers to its users, making it stand out from the competition.",
    tags: ["value proposition", "benefits", "advantages"]
  },
  highLevelConcepts: {
    title: "High Level Concepts",
    description:
      "Overarching ideas and concepts that describe the fundamental purpose and functionality of the app in a broader context.",
    tags: ["high level concepts", "purpose", "functionality"]
  },
  unfairAdvantage: {
    title: "Unfair Advantage",
    description:
      "Factors that give the app a competitive edge that cannot be easily replicated by competitors, often involving proprietary technology, exclusive partnerships, or unique expertise.",
    tags: ["unfair advantage", "proprietary technology", "partnerships"]
  },
  costStructure: {
    title: "Cost Structure",
    description:
      "Primary costs associated with developing, maintaining, and operating the app. This includes both fixed and variable expenses.",
    tags: ["cost structure", "fixed costs", "variable costs"]
  },
  earlyAdopters: {
    title: "Early Adopters",
    description:
      "Who are likely to use the app shortly after its launch. These are often individuals or groups who are most in need of the app’s features and benefits.",
    tags: ["early adopters", "individuals", "groups"]
  },
  revenueStreams: {
    title: "Revenue Streams",
    description:
      "Ways through which the app generates revenue. This can include various monetization strategies such as subscriptions, in-app purchases, and ads.",
    tags: ["revenue streams", "subscriptions", "in-app purchases", "ads"]
  },
  customerSegments: {
    title: "Customer Segments",
    description:
      "Distinct groups of people or organizations that the app aims to serve.",
    tags: ["customer segments", "groups"]
  }
};

function getTitle(key: string) {
  return cardData[key]?.title;
}
function getDescription(key: string) {
  return cardData[key]?.description;
}
function shouldIgnore(key: string) {
  return key === "appName" || key === "summary";
}

type UnderstandingProps = {
  understanding: UnderstandingFragment | null | undefined;
  setUnderstanding: React.Dispatch<
    React.SetStateAction<UnderstandingFragment | null | undefined>
  >;
};

const Understanding = ({
  understanding,
  setUnderstanding
}: UnderstandingProps) => {
  const [modalGrid, setModalGrid] = useState<boolean>(false);
  const [deleteModalGrid, setDeleteModalGrid] = useState<boolean>(false);
  const iconSet = [
    "bx bx-shekel",
    "bx bx-diamond",
    "bx bx-align-justify",
    "bx bx-atom",
    "bx bx-unite"
  ];
  const imageSet = [icon1, icon2, icon3, icon4];
  const [description, setDescription] = useState<string[]>([]);
  const [tags, setTags] = useState<string>("");
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [regenerateCardId, setRegenerateCardId] = useState('');
  const [userRequest, setUserRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newKeyPoints, setNewKeyPoints] = useState<string[]>([]);
  const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>([]);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  const { accounts } = useMsal();

  // const [value, setValue] = useState<UnderstandingFragment>({
  //   title: "",
  //   points: [""],
  //   tags: [""],
  // });
  const [editCardId, setEditCardId] = useState<string>("");
  document.title = "Understanding | Michelangelo";

  function getUnderstandingProperty(key: string) {
    switch (key) {
      case "problem":
        return understanding?.problem;
      case "alternatives":
        return understanding?.alternatives;
      case "costStructure":
        return understanding?.costStructure;
      case "earlyAdopters":
        return understanding?.earlyAdopters;
      case "customerSegments":
        return understanding?.customerSegments;
      case "keyMetrics":
        return understanding?.keyMetrics;
      case "solutions":
        return understanding?.solutions;
      case "unfairAdvantage":
        return understanding?.unfairAdvantage;
      case "valueProposition":
        return understanding?.valueProposition;
      case "highLevelConcepts":
        return understanding?.highLevelConcepts;
      case "revenueStreams":
        return understanding?.revenueStreams;
    }
    return null;
  }

  function isIncludeProperty(key: string) {
    if (getUnderstandingProperty(key)?.length === 0) return false;
    return true;
  }
  function handleList(point: string, index: number) {
    let data = [...description];
    if (!data) return;
    data[index] = point;
    setDescription(data);
    console.log("the data: ", data);
  }

  function addToList() {
    console.log("addToList");
    let data = [...description];
    if (!data) return;
    data.push("");
    setDescription(data);
  }

  function handleEdit(key: string) {
    setModalGrid(true);
    setEditCardId(key);
    const data = getUnderstandingProperty(key);
    if (understanding && data) {
      setDescription(data);
    }
  }

  function removeList(index: number) {
    let data = [...description];
    if (!data) return;
    data.splice(index, 1);
    setDescription(data);
  }

  function updateCardData() {
    let newData: UnderstandingFragment | null | undefined = {
      ...understanding
    };
    if (!newData) return;
    switch (editCardId) {
      case "problem":
        newData.problem = description;
        break;
      case "alternatives":
        newData.alternatives = description;
        break;
      case "costStructure":
        newData.costStructure = description;
        break;
      case "earlyAdopters":
        newData.earlyAdopters = description;
        break;
      case "customerSegments":
        newData.customerSegments = description;
        break;
      case "keyMetrics":
        newData.keyMetrics = description;
        break;
      case "solutions":
        newData.solutions = description;
        break;
      case "unfairAdvantage":
        newData.unfairAdvantage = description;
        break;
      case "valueProposition":
        newData.valueProposition = description;
        break;
      case "highLevelConcepts":
        newData.highLevelConcepts = description;
        break;
      case "revenueStreams":
        newData.revenueStreams = description;
        break;
    }
    setUnderstanding(newData);
    setModalGrid(false);
  }

  function openDeleteModal(key: string) {
    setDeleteModalGrid(true);
    setEditCardId(key);
  }
  function handleDelete() {
    let newData: UnderstandingFragment | null | undefined = {
      ...understanding
    };
    if (!newData) return;
    console.log("handleDelete");
    switch (editCardId) {
      case "problem":
        newData.problem = [];
        break;
      case "alternatives":
        newData.alternatives = [];
        break;
      case "costStructure":
        newData.costStructure = [];
        break;
      case "earlyAdopters":
        newData.earlyAdopters = [];
        break;
      case "customerSegments":
        newData.customerSegments = [];
        break;
      case "keyMetrics":
        newData.keyMetrics = [];
        break;
      case "solutions":
        newData.solutions = [];
        break;
      case "unfairAdvantage":
        newData.unfairAdvantage = [];
        break;
      case "valueProposition":
        newData.valueProposition = [];
        break;
      case "highLevelConcepts":
        newData.highLevelConcepts = [];
        break;
      case "revenueStreams":
        newData.revenueStreams = [];
        break;
    }
    setUnderstanding(newData);
    setDeleteModalGrid(false);
  }

  //api call using the axios Instance switch using the custom axios instance to switch between the dev and the local server 
  const regenerateKeyPoints = async (FocusHeader: string, userRequest: string) => {
    try {
      const previousKeyPoints = getUnderstandingProperty(FocusHeader)?.join(' ');
      const HeaderMap = new Map([
        ["problem", "Problem"],
        ["solutions", "Solution"],
        ["keyMetrics", "Key Metrics"],
        ["valueProposition", "Value Proposition"],
        ["highLevelConcepts", "High-Level Concepts"],
        ["unfairAdvantage", "Unfair Advantage"],
        ["costStructure", "Cost Structure"],
        ["earlyAdopters", "Early Adopters"],
        ["revenueStreams", "Revenue Streams"],
        ["customerSegments", "Customer Segments"]
      ]);
      console.log(HeaderMap.get(FocusHeader));
      console.log(FocusHeader)
      const FocusString = HeaderMap.get(FocusHeader);
      const userPrompt = `Focus Header: ${FocusString}\n\nPrevious KeyPoints: ${previousKeyPoints}\n\nUser Request for Focus Header: ${userRequest}`;
      console.log(userPrompt)
      const payload = { "step": "understanding", "prompt": userPrompt ,"userSignature": accounts[0].username};
      // const response = await axiosInstance.post('/brainstormer/product_research/regenerate', payload);
      const response = await regenarateBrainStormer(payload);
      console.log(response);
      console.log(response);
      console.log(response.data);
      console.log(response.data.response.type);
      console.log(response.data.response.data);
      if (response.data) {
        const getdata = response.data.response;
        
        console.log(getdata);
        console.log(getdata.data);
        console.log(getdata.type);

        if (getdata.type === FocusString){
            const newKeyPoints = getdata.data;
            console.log(newKeyPoints)
            setNewKeyPoints(newKeyPoints);
            setIsRequestSuccessful(true);
          } else {
            console.error("Error: FocusHeader not found in response data");
          }
      } else {
        console.error("Error: Response data is undefined");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API :", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  //to handle modal cancel
  const handleRegenerateModalCancel = () => {
    setRegenerateModalOpen(false);
    setNewKeyPoints([]);
    setSelectedKeyPoints([]);
    setUserRequest("");
    setIsRequestSuccessful(false);

  };

  //to select required keypoints by user request
  const handleKeyPointSelection = (sentence: string) => {
    if (selectedKeyPoints.includes(sentence)) {
      setSelectedKeyPoints(selectedKeyPoints.filter((s) => s !== sentence));
    } else {
      setSelectedKeyPoints([...selectedKeyPoints, sentence]);
    }
  };

  //current handle key points which is used to handle the key points after regenration
  const handleTakeKeyPoints = () => {
    let newData: UnderstandingFragment | null | undefined = { ...understanding };
    if (!newData) return;
    console.log("handleDelete");
    if (selectedKeyPoints.length > 0) {
      switch (regenerateCardId) {
        case "problem":
          newData.problem = selectedKeyPoints;
          break;
        case "alternatives":
          newData.alternatives = selectedKeyPoints;
          break;
        case "costStructure":
          newData.costStructure = selectedKeyPoints
          break;
        case "earlyAdopters":
          newData.earlyAdopters = selectedKeyPoints
          break;
        case "customerSegments":
          newData.customerSegments = selectedKeyPoints
          break;
        case "keyMetrics":
          newData.keyMetrics = selectedKeyPoints
          break;
        case "solutions":
          newData.solutions = selectedKeyPoints
          break;
        case "unfairAdvantage":
          newData.unfairAdvantage = selectedKeyPoints
          break;
        case "valueProposition":
          newData.valueProposition = selectedKeyPoints
          break;
        case "highLevelConcepts":
          newData.highLevelConcepts = selectedKeyPoints
          break;
        case "revenueStreams":
          newData.revenueStreams = selectedKeyPoints
          break;
      }
    }
    setUnderstanding({ ...newData });
    console.log("newData:", newData);
    setRegenerateModalOpen(false);
    setSelectedKeyPoints([]);
    setIsRequestSuccessful(false);
    setNewKeyPoints([]);
    setUserRequest("");
    return newData;
  };

  return (
    <>
      {/* <Row> */}
      <Row id="job-list">
        <Col lg={4} md={6} id="job-widget" style={{ minWidth: "350px" }}>
          <Card className="card-height-100 bg-secondary bg-job">
            <CardBody className="p-5">
              <h2 className="lh-base text-white">{understanding?.appName}</h2>
              <h3 className="lh-base text-white text-opacity-75">{understanding?.summary}</h3>
              {/* <p className="text-white text-opacity-75 mb-0 fs-14">{understanding?.summary}</p> */}
              {/* <div className="mt-5 pt-2">
                      <button type="button" className="btn btn-light w-100">
                        View More{" "}
                        <i className="ri-arrow-right-line align-bottom"></i>
                      </button>
                    </div> */}
            </CardBody>
          </Card>
        </Col>
        {understanding &&
          Object.keys(understanding)
            .filter((item) => !shouldIgnore(item))
            .filter((item) => isIncludeProperty(item))
            .map((key: string, index: number) => (
              <Col
                className="d-flex"
                lg={4}
                md={6}
                style={{ minWidth: "350px" }}
              >
                <Card style={{ flex: "1 1 auto" }}>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div className="avatar-sm mb-4">
                        <div className="avatar-title bg-light rounded">
                          <img
                            src={imageSet[index % 4]}
                            alt=""
                            className="avatar-xxs"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setRegenerateCardId(key);
                          setUserRequest('');
                          setRegenerateModalOpen(true);
                        }}
                        color="warning"
                        outline
                        className="btn-border"
                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                        id={"regenrate"} // Add a unique id to the button
                      >
                        <i className="ri-refresh-line"></i>
                      </Button>
                      {/* <button
                          type="button"
                          className="btn btn-icon btn-soft-primary float-end"
                          data-bs-toggle="button"
                          aria-pressed="true"
                        >
                          <i className="mdi mdi-cards-heart fs-16"></i>
                        </button> */}
                    </div>
                    <Link to="#">
                      <h5>{getTitle(key)}</h5>
                    </Link>
                    <p className="text-muted">{getDescription(key)}</p>
                    <div className="d-flex gap-4 mb-3">
                      {/* <div>
                          <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                          Lorem Ipsum
                        </div>
                        <div>
                          <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}
                          Lorem Ipsum
                        </div> */}
                    </div>

                    {
                      <ul
                        className="list-group  mb-4"
                        style={{ overflow: "auto" }}
                      >
                        <>
                          {understanding &&
                            getUnderstandingProperty(key)?.map(
                              (sentance: string, index: number) => (
                                <li
                                  className="list-group-item"
                                  key={index + 1}
                                  style={{ color: "gray" }}
                                >
                                  {sentance}
                                </li>
                              )
                            )}
                        </>
                      </ul>
                    }
                    <div className="mt-auto mb-4 gap-2">
                      {cardData[key].tags.map((subItem: any, key: any) => (
                        <React.Fragment key={key}>
                          {key === 0 ? (
                            <span className="badge bg-success-subtle text-success">
                              {subItem}
                            </span>
                          ) : key === 1 ? (
                            <span className="badge bg-primary-subtle text-primary">
                              {subItem}
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle  text-danger">
                              {subItem}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="hstack gap-2">
                      <Button
                        onClick={() => {
                          handleEdit(key);
                        }}
                        color="primary"
                        outline
                        className="btn-border w-100"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          openDeleteModal(key);
                        }}
                        color="danger"
                        outline
                        className="btn-border w-100"
                      >
                        {" "}
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
      </Row>

      <Modal
        isOpen={regenerateModalOpen}
        toggle={() => setRegenerateModalOpen(!regenerateModalOpen)}
        centered={true}
      >
        <ModalHeader toggle={() => setRegenerateModalOpen(!regenerateModalOpen)}>
          <h5 className="modal-title">
            Regenerate Understanding
          </h5>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h5>{getTitle(regenerateCardId)}</h5>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              await regenerateKeyPoints(regenerateCardId, userRequest,);
              setIsLoading(false);
            }}
          >
            <div className="row g-3">
              <div>
                <label htmlFor="previousKeyPoints" className="form-label">
                  Previous Key Points
                </label>
                <ul className="list-group mb-4" style={{ overflow: "auto" }}>
                  {understanding &&
                    getUnderstandingProperty(regenerateCardId)?.map(
                      (sentence: string, index: number) => (
                        <li
                          className="list-group-item"
                          key={index + 1}
                          style={{ color: "gray" }}
                        >
                          {sentence}
                        </li>
                      )
                    )}
                </ul>
              </div>
              {!isRequestSuccessful && (
                <div>
                  <label htmlFor="userRequest" className="form-label">
                    User Request
                  </label>
                  <Input
                    type="textarea"
                    rows={3}
                    className="form-control"
                    name="userRequest"
                    id="userRequest"
                    value={userRequest}
                    onChange={(e) => setUserRequest(e.target.value)}
                    placeholder="Enter your request for change"
                  />
                </div>
              )}
              {!isRequestSuccessful && (
                <Button color="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : "Submit"}
                </Button>
              )}
            </div>
          </form>
          {isLoading && <div>Loading...</div>}
          {isRequestSuccessful && newKeyPoints && (
            <div>
              <label htmlFor="newKeyPoints" className="form-label">
                New Key Points
              </label>
              <ul className="list-group mb-4" style={{ overflow: "auto" }}>
                {newKeyPoints.map((sentence: string, index: number) => (
                  <li
                    className="list-group-item"
                    key={index + 1}
                    style={{ color: "gray" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedKeyPoints.includes(sentence)}
                      onChange={() => handleKeyPointSelection(sentence)}
                    />{" "}
                    {sentence}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isRequestSuccessful && (
            <>
              <Button color="secondary" onClick={handleRegenerateModalCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleTakeKeyPoints}>
                Accept
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>


      <Modal
        isOpen={modalGrid}
        toggle={() => setModalGrid(!modalGrid)}
        centered={true}
      >
        <ModalHeader toggle={() => setModalGrid(!modalGrid)}>
          <h5 className="modal-title d-flex justify-content-end">
            Edit Understanding
          </h5>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateCardData();
            }}
          >
            <div className="row g-3">
              {/* <div>
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    placeholder="Enter Title.."
                    onChange={(e) => setTitle(getTitle(editCardId))}
                    disabled
                  />
                </div> */}

              {/* <div>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <Input
                    type="textarea"
                    rows="3"
                    className="form-control"
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => handleList(e.target.value)}
                    placeholder="Enter Description"
                  />
                </div> */}

              <label htmlFor="description" className="form-label">
                {getTitle(editCardId)}
              </label>
              <ul className="list-group  mb-4" style={{ overflow: "auto" }}>
                <>
                  {description.map((sentance: string, index: number) => (
                    <>
                      <div className="d-flex justify-content-between">
                        <Input
                          type="text"
                          className="form-control mb-2 mx-2"
                          name="description"
                          id="description"
                          onChange={(e) => handleList(e.target.value, index)}
                          value={sentance}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-icon waves-effect waves-light"
                          onClick={() => {
                            removeList(index);
                          }}
                        >
                          <i className="ri-delete-bin-5-line"></i>
                        </button>
                      </div>
                      {/* <Row>
                          <Col>
                            <Input
                              type="text"
                              className="form-control mb-2"
                              name="description"
                              id="description"
                              onChange={(e) => handleList(e.target.value, index)}
                              value={sentance}
                            />
                          </Col>
                          <Col lg={2}>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-icon waves-effect waves-light"
                            >
                              <i className="ri-delete-bin-5-line"></i>
                            </button>
                          </Col>
                        </Row> */}
                    </>
                  ))}
                </>
              </ul>
              <Row>
                <Col>
                  <Button onClick={addToList}>
                    <i className="ri-add-circle-line"></i>Add
                  </Button>
                </Col>
              </Row>

              {/* <div>
                  <label htmlFor="tags" className="form-label">
                    Tag Name
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(cardData[editCardId].tags.join(","))}
                    placeholder="Enter Your Tag Title"
                    disabled
                  />
                </div> */}
              <Button color="primary" type="submit">
                Update
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={deleteModalGrid}
        toggle={() => setDeleteModalGrid(!deleteModalGrid)}
        centered={true}
      >
        <ModalHeader toggle={() => setDeleteModalGrid(!deleteModalGrid)}>
          <h5 className="modal-title d-flex justify-content-end">Delete</h5>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDelete();
              console.log("submitted");
            }}
          >
            <div className="row g-3">
              <p>Are you sure you want to delete this card?</p>
              <Button color="primary" type="submit">
                Delete
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Understanding;
