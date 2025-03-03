import {
  Epic,
  JiraRequest,
  Milestone,
  RoadmapFragment
} from "Mike/models/response";
import { getDate } from "Mike/utils/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown
} from "reactstrap";
import SimpleBar from "simplebar-react";
import jiraLogo from "../../assets/images/jira2.png";
import ImageRadialbar from "./Misc/RadialBar";

type RoadmapProps = {
  roadmap: RoadmapFragment | null | undefined;
  setRoadmap: React.Dispatch<
    React.SetStateAction<RoadmapFragment | null | undefined>
  >;
};
interface KanbanColumn {
  id: string;
  name: string;
  color?: string;
  cards?: Epic[];
}

const dummyData = [
  {
    id: "1",
    userImages: [
      { id: 1, img: "/static/media/avatar-10.4d8cdbb1be43d9993ae7.jpg" },
      { id: 2, img: "/static/media/avatar-3.36fbb9e4e257ecafc0da.jpg" },
      { id: 3, img: "/static/media/avatar-2.58874a6f667b9b04ce55.jpg" }
    ],
    prowidth: "0%",
    procolor: "danger",
    badge1: ["Admin"],
    botId: getDate()
  }
];

const mapRoadmapToKanban = (roadmap: RoadmapFragment): KanbanColumn[] => {
  return roadmap.milestones.map((milestone, index) => ({
    id: `milestone${index + 1}`,
    name: `milestone ${index + 1}`,
    color: "primary", // You can customize the color if needed
    cards: milestone.epics.map((epic) => ({
      id: `${milestone.name}-${epic.id}`,
      title: epic.title,
      description: epic.description,
      additionalDetails: epic.additionalDetails
    }))
  }));
};

const Roadmap: React.FC<RoadmapProps> = ({ roadmap, setRoadmap }) => {
  //define states
  // const [roadmap, setRoadmap] = useState<RoadmapFragment | null | undefined>(
  //   data
  // );
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);
  const [modalGrid, setModalGrid] = useState<boolean>(false);
  const [modalJira, setModalJira] = useState<boolean>(false);
  const [modalAnalysis, setModalAnalysis] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [editCard, setEditCard] = useState<Epic | null>(null);
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [apiCallLoading, setApiCallLoading] = useState<boolean>(false);
  const [isJiraError, setIsJiraError] = useState<string>("default");
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (roadmap) {
      setKanbanColumns(mapRoadmapToKanban(roadmap));
    }
    const editedCount = parseInt(localStorage.getItem("editCount") || "0");
    const totalCount = parseInt(localStorage.getItem("totalCount") || "1");
    setScore(Math.floor((totalCount / (totalCount + editedCount)) * 100));
  }, [roadmap]);

  function handleJira() {
    setModalAnalysis(false);
    setModalJira(true);
  }

  function handleAnalysis() {
    setModalAnalysis(true);
  }

  useEffect(() => {
    if (!editCard) {
      setTitle("");
      setDescription("");
      setAdditionalDetails("");
    }
  }, [modalGrid, editCard]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (editCard) {
      handleUpdateCard();
    } else {
      handleAddCard(activeColumn);
    }
  };

  const toggleModal = () => {
    setModalGrid(!modalGrid);
    setEditCard(null);
  };

  function makeJiraApiCall() {
    let jiraPayload: JiraRequest = { appType: "", domain: "", epics: [] };
    let jiraEpics: Epic[] = [];
    roadmap?.milestones.forEach((milestone) => {
      milestone.epics.forEach((epic) => {
        jiraEpics.push(epic);
      });
    });
    setApiCallLoading(true);
    if (roadmap) {
      jiraPayload.appType = "WEB"; //roadmap?.appType.toUpperCase()
      jiraPayload.domain = "Retail"; //roadmap?.domain
      jiraPayload.epics = jiraEpics;

      axios
        .post(
          "https://da-api-experience-center-dev.azurewebsites.net/alm/issue",
          jiraPayload
        )
        .then((response) => {
          setApiCallLoading(false);
          if (response.data === "") {
            setIsJiraError("error");
          } else setIsJiraError("success");
        });
    }
  }

  const handleAddCard = (columnId: string) => {
    const newCard: Epic = {
      id: `custom-${Date.now()}`,
      title: title,
      description: description,
      additionalDetails: additionalDetails
    };

    const targetColumn = kanbanColumns.find((column) => column.id === columnId);

    if (targetColumn) {
      const updatedCards = [...(targetColumn.cards || []), newCard];
      const updatedColumns = kanbanColumns.map((column) =>
        column.id === columnId ? { ...column, cards: updatedCards } : column
      );

      setKanbanColumns(updatedColumns);
    }

    setModalGrid(false);
    setTitle("");
    setDescription("");
    setAdditionalDetails("");
  };

  //Handle Edit card and update card

  const handleEditCard = (card: Epic) => {
    setEditCard(card);
    setTitle(card.title || "");
    setDescription(card.description || "");
    setAdditionalDetails(card.additionalDetails || "");
    setModalGrid(true);
  };

  const handleUpdateCard = () => {
    if (!editCard) return;

    const updatedCard: Epic = editCard
      ? {
          ...editCard,
          title: title,
          description: description,
          additionalDetails: additionalDetails
        }
      : { title: "", description: "", id: "", additionalDetails: "" };

    const updatedColumns = kanbanColumns.map((column) => {
      const updatedCards = (column.cards || []).map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );
      return { ...column, cards: updatedCards };
    });

    setKanbanColumns(updatedColumns);
    updateRoadmapState(updatedColumns);
    setModalGrid(false);
    setTitle("");
    setDescription("");
    setAdditionalDetails("");
    setEditCard(null);
  };

  function updateRoadmapState(updatedColumns: KanbanColumn[]) {
    var newMilestones: Milestone[] = [];
    updatedColumns.forEach((element) => {
      newMilestones.push({ name: element.name, epics: element.cards || [] });
    });

    if (newMilestones) {
      setRoadmap((prevState) => ({
        domain: roadmap?.domain || "",
        appType: roadmap?.appType || "",
        summary: roadmap?.summary || "",
        milestones: newMilestones
      }));
    }
  }
  //Handle Delete Card
  const handleDeleteCard = (cardId: string) => {
    const updatedColumns = kanbanColumns.map((column) => ({
      ...column,
      cards: (column.cards || []).filter((card) => card.id !== cardId)
    }));
    setKanbanColumns(updatedColumns);
    updateRoadmapState(updatedColumns);
  };

  //Handle Drag functionality
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const column = kanbanColumns.find(
        (column) => column.id === source.droppableId
      );
      if (column) {
        const updatedCards = Array.from(column.cards || []);
        const [movedCard] = updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);
        const updatedColumns = kanbanColumns.map((col) =>
          col.id === column.id ? { ...col, cards: updatedCards } : col
        );
        setKanbanColumns(updatedColumns);
        updateRoadmapState(updatedColumns);
      }
    } else {
      // Move card to a different column
      const sourceColumn = kanbanColumns.find(
        (column) => column.id === source.droppableId
      );
      const destinationColumn = kanbanColumns.find(
        (column) => column.id === destination.droppableId
      );
      if (sourceColumn && destinationColumn) {
        const sourceCards = Array.from(sourceColumn.cards || []);
        const [movedCard] = sourceCards.splice(source.index, 1);
        const destinationCards = Array.from(destinationColumn.cards || []);
        destinationCards.splice(destination.index, 0, movedCard);

        const updatedColumns = kanbanColumns.map((col) => {
          if (col.id === sourceColumn.id) {
            return { ...col, cards: sourceCards };
          } else if (col.id === destinationColumn.id) {
            return { ...col, cards: destinationCards };
          }
          return col;
        });

        setKanbanColumns(updatedColumns);
        updateRoadmapState(updatedColumns);
      }
    }
  };
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Row className="g-2">
            <Col>
              <Card className="card-body">
                <div className=" text-success fs-1 rounded">
                  <i className="ri-information-line"></i>
                </div>
                {/* </div> */}
                <h4 className="card-title d-flex justify-content-start">
                  Summary
                </h4>
                <p className="card-text text-muted">{roadmap?.summary}</p>
                <div className="d-flex mb-3" style={{ gap: "0.2rem" }}>
                  <Badge> {roadmap?.appType}</Badge>
                  <Badge> {roadmap?.domain}</Badge>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="g-2">
            <div className="col-lg-auto">
              <div className="hstack gap-2">
                <Button onClick={() => handleAnalysis()}>
                  <i className=" ri-search-line align-bottom me-1"></i> Analyse
                </Button>
              </div>
            </div>
          </Row>
        </CardBody>
      </Card>
      <div className="tasks-board mb-3 d-flex" id="kanbanboard">
        <DragDropContext onDragEnd={handleDragEnd}>
          {kanbanColumns.map((column: KanbanColumn) => (
            <div className="tasks-list" key={column.id}>
              <div className="d-flex mb-3">
                <div className="flex-grow-1">
                  <h6 className="fs-14 text-uppercase fw-semibold mb-0">
                    {column.name}{" "}
                    <small
                      className={`badge bg-${column.color} align-bottom ms-1 totaltask-badge`}
                    >
                      {column.cards?.length}
                    </small>
                  </h6>
                </div>
              </div>
              <SimpleBar className=" px-3 mx-n3">
                <div
                  className={
                    Array.isArray(column.cards) ? "tasks" : "tasks noTask"
                  }
                >
                  <Droppable droppableId={column.id}>
                    {(provided: any) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {column.cards?.length === 0 && (
                          <div
                            id="unassigned-task"
                            style={{
                              padding: "16px",
                              textAlign: "center",
                              color: "grey"
                            }}
                            className={
                              column.cards === null ? "tasks" : "tasks noTask"
                            }
                          >
                            No Cards
                          </div>
                        )}
                        {column.cards?.map((card: Epic, index: number) => (
                          <Draggable
                            key={card.id || ""}
                            draggableId={card.id || ""}
                            index={index}
                          >
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="pb-1 task-list"
                              >
                                <div className="card task-box" id="uptask-1">
                                  <CardBody>
                                    <Link
                                      to="#"
                                      className="text-muted fw-medium fs-14 flex-grow-1 "
                                    >
                                      {/* {card.id} */}
                                    </Link>{" "}
                                    <UncontrolledDropdown className="float-end d-flex justify-content-end align-item-end">
                                      <DropdownToggle
                                        className="arrow-none"
                                        tag="a"
                                        color="white"
                                      >
                                        <i className="ri-more-fill"></i>
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem
                                          onClick={() => handleEditCard(card)}
                                          className="edittask-details"
                                        >
                                          Edit
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() =>
                                            card.id && handleDeleteCard(card.id)
                                          }
                                          className="deletetask"
                                        >
                                          Delete
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <div className="mb-3">
                                      <h6 className="fs-15 mb-0 flex-grow-1 text-truncate task-title">
                                        <Link
                                          to="#"
                                          className="d-block"
                                          id="task-name"
                                        >
                                          {card.title}
                                        </Link>
                                      </h6>
                                    </div>
                                    <p className="text-muted">
                                      {card.description}
                                    </p>
                                    {card.additionalDetails && (
                                      <p className="text-muted">
                                        {card.additionalDetails}
                                      </p>
                                    )}
                                    {/* Progress Bar */}
                                    {dummyData.map((prog) => (
                                      <div id="unassigned-task" key={prog.id}>
                                        {prog.prowidth && (
                                          <div className="mb-3">
                                            <div className="d-flex mb-1">
                                              <div className="flex-grow-1">
                                                <h6 className="text-muted mb-0">
                                                  <span className="text-secondary">
                                                    {prog.prowidth}
                                                  </span>{" "}
                                                  of 100%
                                                </h6>
                                              </div>
                                              <div className="flex-shrink-0">
                                                <span className="text-muted">
                                                  {prog.botId}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="progress rounded-3 progress-sm">
                                              <div
                                                className={`progress-bar bg-${prog.procolor}`}
                                                role="progressbar"
                                                style={{
                                                  width: `${prog.prowidth}`
                                                }}
                                              ></div>
                                            </div>
                                          </div>
                                        )}
                                        {/* Avatar Images */}
                                        <div className="flex-shrink d-flex justify-content-end">
                                          <div className="avatar-group">
                                            {prog.userImages.map((image) => (
                                              <Link
                                                to="#"
                                                className="avatar-group-item"
                                                data-bs-toggle="tooltip"
                                                data-bs-trigger="hover"
                                                data-bs-placement="top"
                                                title="Alexis"
                                                key={image.id}
                                              >
                                                <img
                                                  src={image.img}
                                                  className="rounded-circle avatar-xxs"
                                                  title="Alexis"
                                                  alt="user"
                                                />
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </CardBody>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </SimpleBar>
              <div className="my-3">
                <Button
                  onClick={() => {
                    setModalGrid(true);
                    setActiveColumn(column.id);
                  }}
                  color="success"
                  className="w-100 "
                >
                  <i className="ri-add-line align-bottom"></i> Add More
                </Button>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>

      <Modal isOpen={modalGrid} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal}>
          <h5 className="modal-title d-flex justify-content-end">
            {editCard ? "Edit Card" : "Add Your Own"}
          </h5>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div>
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  placeholder="Enter Title.."
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
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
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                />
              </div>

              <div>
                <label htmlFor="additionalDetails" className="form-label">
                  Additional Information
                </label>
                <Input
                  type="textarea"
                  rows="3"
                  className="form-control"
                  name="additionalDetails"
                  id="additionalDetails"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Additional Details.."
                />
              </div>

              <Button color="primary" type="submit">
                {editCard ? "Update Card" : "Add Card"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalJira}
        toggle={() => {
          setModalJira(!modalJira);
        }}
        centered
      >
        <ModalHeader className="modal-title">Create Jira Epics</ModalHeader>
        <ModalBody className="modal-body text-center p-5">
          <img src={jiraLogo} alt="jira" height={100}></img>
          <div className="mt-4">
            <p className="text-muted mb-4">
              {" "}
              {isJiraError === "error"
                ? "Error while trying to create Jira epics. Please try again after sometime."
                : isJiraError === "success"
                ? "Created Epics successfully"
                : 'Click on "Create" to create Jira Epics'}
            </p>
            <div className="hstack gap-2 justify-content-center">
              <Button
                color="light"
                onClick={() => {
                  setModalJira(false);
                  setIsJiraError("default");
                }}
              >
                Close
              </Button>
              {isJiraError === "default" ? (
                <button
                  className="btn btn-primary btn-load"
                  onClick={() => makeJiraApiCall()}
                  disabled={apiCallLoading}
                >
                  <span className="d-flex align-items-center">
                    {apiCallLoading ? (
                      <>
                        <span
                          className="spinner-border flex-shrink-0"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </span>
                        <span className="flex-grow-1 ms-2">Loading...</span>
                      </>
                    ) : (
                      <span className="flex-grow-1 ms-2">Create</span>
                    )}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalAnalysis}
        toggle={() => {
          setModalAnalysis(!modalAnalysis);
        }}
        centered
      >
        <ModalHeader className="modal-title" id="staticBackdropLabel" />
        <ModalBody className="modal-body text-center p-5">
          <i className="bx bx-party display-4 text-success"></i>

          <div className="mt-4">
            <h4 className="mb-3">
              Phew! <br />
              That was a productive session
            </h4>
            <p className="text-muted mb-4">
              {" "}
              : <br />
              Michelangelo contributed{" "}
              <b className="fs-4 text-primary-emphasis">{score}%</b>, and you
              added the final{" "}
              <b className="fs-4 text-secondary">{100 - score}%</b>.
            </p>
            <div>
              <ImageRadialbar
                value={score}
                dataColors='["--vz-primary", "--vz-info", "--vz-danger", "--vz-success"]'
              />
            </div>
            <div className="hstack gap-2 justify-content-center">
              <Link
                to="#"
                className="btn btn-link link-dark fw-medium"
                onClick={() => setModalAnalysis(false)}
              >
                <i className="ri-close-line me-1 align-middle"></i> Close
              </Link>
              <Link
                to="#"
                className="btn btn-primary"
                onClick={() => handleJira()}
              >
                Create Jira Epics
              </Link>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Roadmap;
