import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
  ModalFooter,
  Spinner
} from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { FeaturesFragment, SchemaFeature } from "Mike/models/response";
import { getDate } from "Mike/utils/utils";
import axios from "axios";
// import {ApiService} from "Mike/utils/apiService"
// import { axiosInstance } from "Mike/utils/axiosConfig";
import { useMsal } from "@azure/msal-react";
import { regenarateBrainStormer } from "services/brainStormerServices";
// import { axiosInstance } from "Mike/utils/axiosConfig";



type FeatureProps = {
  features: FeaturesFragment | null | undefined;
  setFeatures: React.Dispatch<React.SetStateAction<FeaturesFragment | null | undefined>>
};

interface CardData {
  id?: string;
  title?: string;
  text?: string;
  badge1?: any[];
}

interface KanbanColumn {
  id: string;
  name: string;
  color?: string;
  cards?: CardData[];
}

const dummyData = [
  {
    id: "1",
    userImages: [
      { id: 1, img: "/static/media/avatar-10.4d8cdbb1be43d9993ae7.jpg" },
      { id: 2, img: "/static/media/avatar-3.36fbb9e4e257ecafc0da.jpg" },
      { id: 3, img: "/static/media/avatar-2.58874a6f667b9b04ce55.jpg" },
    ],
    prowidth: "0%",
    procolor: "danger",
    badge1: ["Admin"],
    botId: getDate(),
  },
];

const mapFeaturesToKanban = (features: FeaturesFragment): KanbanColumn[] => {
  const mapFeatureItemToCardData = (item: any, idPrefix: string): CardData => ({
    id: `${idPrefix}-${item.title}`,
    title: item.title,
    text: item.description.join(" "),
    badge1: item.tags,
  });

  return [
    {
      id: "mustHave",
      name: "Must Have",
      color: "danger",
      cards: features.mustHave.map((item) =>
        mapFeatureItemToCardData(item, "mustHave")
      ),
    },
    {
      id: "shouldHave",
      name: "Should Have",
      color: "warning",
      cards: features.shouldHave.map((item) =>
        mapFeatureItemToCardData(item, "shouldHave")
      ),
    },
    {
      id: "couldHave",
      name: "Could Have",
      color: "success",
      cards: features.couldHave.map((item) =>
        mapFeatureItemToCardData(item, "couldHave")
      ),
    },
    {
      id: "wontHave",
      name: "Won't Have",
      color: "success",
      cards: features.wontHave.map((item) =>
        mapFeatureItemToCardData(item, "couldHave")
      ),
    },
  ];
};

const Feature = ({ features, setFeatures }: FeatureProps) => {

  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(
    mapFeaturesToKanban(
      features || { mustHave: [], shouldHave: [], couldHave: [], wontHave: [] }
    )
  );

  const [editCount, setEditCount] = useState<number>(0)
  const [modalGrid, setModalGrid] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [editCard, setEditCard] = useState<CardData | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [regenerateModal, setRegenerateModal] = useState<boolean>(false);
  const [regenerateRequest, setRegenerateRequest] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  const { accounts } = useMsal();

  let totalEditCount = 0


  useEffect(() => {
    if (features) {
      setKanbanColumns(mapFeaturesToKanban(features));
      if (!isInitialized) {
        for (const key in features) {
          if (features.hasOwnProperty(key)) {
            const featureList = features[key as keyof FeaturesFragment];
            totalEditCount += featureList.length;
          }
        }
        localStorage.setItem('totalCount', totalEditCount + "")
        setIsInitialized(true)
      }

    }
  }, [features, isInitialized]);

  // Add card
  const handleAddCard = (columnId: string) => {
    if (editCount !== 0) localStorage.removeItem("editCount")
    setEditCount(editCount + 1)
    localStorage.setItem("editCount", editCount + 1 + "")
    const newCard: CardData = {
      id: `custom-${Date.now()}`,
      title: title,
      text: description,
      badge1: tags.split(",").map((tag) => tag.trim()),
    };
    const updatedColumns = kanbanColumns.map((column) => {
      if (column.id === columnId) {
        return { ...column, cards: [...(column.cards || []), newCard] };
      }
      return column;
    });

    setKanbanColumns(updatedColumns);
    updateRoadmapState(updatedColumns)
    setModalGrid(false);
    setTitle("");
    setDescription("");
    setTags("");
  };

  //Handle Drag functionality
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const column = kanbanColumns.find(column => column.id === source.droppableId);
      if (column) {
        const updatedCards = Array.from(column.cards || []);
        const [movedCard] = updatedCards.splice(source.index, 1);
        updatedCards.splice(destination.index, 0, movedCard);
        const updatedColumns = kanbanColumns.map(col =>
          col.id === column.id ? { ...col, cards: updatedCards } : col
        );
        setKanbanColumns(updatedColumns);
        updateRoadmapState(updatedColumns);
      }
    } else {
      // Move card to a different column
      const sourceColumn = kanbanColumns.find(column => column.id === source.droppableId);
      const destinationColumn = kanbanColumns.find(column => column.id === destination.droppableId);
      if (sourceColumn && destinationColumn) {
        const sourceCards = Array.from(sourceColumn.cards || []);
        const [movedCard] = sourceCards.splice(source.index, 1);
        const destinationCards = Array.from(destinationColumn.cards || []);
        destinationCards.splice(destination.index, 0, movedCard);

        const updatedColumns = kanbanColumns.map(col => {
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

  useEffect(() => {
    if (!editCard) {
      setTitle('');
      setDescription('');
      setTags('');
    }
  }, [modalGrid, editCard]);

  const handleAddSubmit = (e: any) => {
    e.preventDefault();
    handleAddCard(activeColumn);
  };

  const handleUpdateSubmit = (e: any) => {
    e.preventDefault();
    handleUpdateCard();
  };

  const toggleAddModal = () => {
    setModalGrid(!modalGrid);
    setEditCard(null);
  };

  const toggleRegenerateModal = () => {
    setRegenerateModal(!regenerateModal);
  };


  //Edit Card
  const handleEditCard = (card: CardData) => {
    setEditCard(card);
    setTitle(card.title || "");
    setDescription(card.text || "");
    setTags((card.badge1 || []).join(", "));
    setModalGrid(true);
  };

  const handleRegenerateCard = (card: CardData) => {
    setEditCard(card);
    setRegenerateRequest("");
    setRegenerateModal(true);
  };


  // api request using the axiosInstance_switch with the prod check
  const handleRegenerateSubmit = async (FocusHeader: any , userRequest : string) => {
    try {
      const previousDescription = editCard?.text;
      console.log(previousDescription)
      const userPrompt = `Focus Header: ${FocusHeader}\n\nPrevious Description: ${previousDescription}\n\nUser Request for Focus Header: ${userRequest}`;
      console.log(userPrompt);
      const payload = { "userSignature": accounts[0].username, "step": "featurelist", "prompt": userPrompt };
      // const response = await axiosInstance.post('/brainstormer/product_research/regenerate',payload);
      const response  = await regenarateBrainStormer(payload); 
      if (response.data) {
        const getdata = response.data.response;
        if (getdata.title === FocusHeader){
          const newDescription = getdata.new_value;
          console.log(newDescription);
          setNewDescription(newDescription);
          setIsRequestSuccessful(true);
          } else {
            console.error("Error: FocusHeader not found in response data");
          }
      } else {
        console.error("Error: Response data is undefined");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  
 
  const handleDescriptionSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDescription(newDescription);
    } else {
      setSelectedDescription("");
    }
  };

  const handleRegenerateModalCancel = () => {
    setRegenerateModal(false);
    setIsRequestSuccessful(false);
    setRegenerateRequest("");
    setNewDescription("");
    setSelectedDescription("");
  };

  const handleRegenerateModalAccept = () => {
    if (selectedDescription) {
      const updatedCard = {
        ...editCard,
        text: selectedDescription,
      };
      const updatedColumns = kanbanColumns.map((column) => {
        const updatedCards = (column.cards || []).map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        );
        return { ...column, cards: updatedCards };
      });
      setKanbanColumns(updatedColumns);
      updateRoadmapState(updatedColumns);
    }
    setRegenerateModal(false);
    setIsRequestSuccessful(false);
    setRegenerateRequest("");
    setNewDescription("");
    setRegenerateRequest("")
    setSelectedDescription("");
  };

  //Delete Card
  const handleDeleteCard = (cardId: string) => {
    if (editCount !== 0) localStorage.removeItem("editCount")
    setEditCount(editCount + 1)
    localStorage.setItem("editCount", editCount + 1 + "")
    const updatedColumns = kanbanColumns.map((column) => ({
      ...column,
      cards: (column.cards || []).filter((card) => card.id !== cardId),
    }));
    setKanbanColumns(updatedColumns);
    updateRoadmapState(updatedColumns)
  };
  //update Card
  const handleUpdateCard = () => {
    const updatedCard: CardData = {
      ...editCard!,
      title: title,
      text: description,
      badge1: tags.split(",").map((tag) => tag.trim()),
    };

    const updatedColumns = kanbanColumns.map((column) => {
      const updatedCards = (column.cards || []).map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      );
      return { ...column, cards: updatedCards };
    });

    setKanbanColumns(updatedColumns);
    updateRoadmapState(updatedColumns)
    setModalGrid(false);
    setTitle("");
    setDescription("");
    setTags("");
    setEditCard(null);
  };

  function updateRoadmapState(updatedColumns: KanbanColumn[]) {
    let mustHave: SchemaFeature[] = [];
    updatedColumns[0].cards?.forEach(element => {
      mustHave.push({ title: element.title || '', description: [element.text || ""], tags: element.badge1 || [] })

    });
    let shouldHave: SchemaFeature[] = [];
    updatedColumns[1].cards?.forEach(element => {
      shouldHave.push({ title: element.title || '', description: [element.text || ""], tags: element.badge1 || [] })

    });
    let couldHave: SchemaFeature[] = [];
    updatedColumns[2].cards?.forEach(element => {
      couldHave.push({ title: element.title || '', description: [element.text || ""], tags: element.badge1 || [] })

    });
    let wontHave: SchemaFeature[] = [];
    updatedColumns[3].cards?.forEach(element => {
      wontHave.push({ title: element.title || '', description: [element.text || ""], tags: element.badge1 || [] })

    });
    let updatedFeatures = { mustHave: mustHave, shouldHave: shouldHave, couldHave: couldHave, wontHave: wontHave }
    setFeatures(updatedFeatures)
  }

  return (
    <React.Fragment>
      <div style={{ textAlign: "center", marginBottom: '3%' }}>
        <span className="heading">
          <b>
            MoSCoW Ranking
          </b>
        </span>
      </div>
      <div
        className="tasks-board mb-3 d-flex"
        id="kanbanboard"
      >

        <DragDropContext onDragEnd={handleDragEnd}>
          {kanbanColumns.map((line: KanbanColumn) => (
            <div className="tasks-list" key={line.id}>
              <div className="d-flex mb-3">
                <div className="flex-grow-1">
                  <h6 className="fs-14 text-uppercase fw-semibold mb-0">
                    {line.name}{" "}
                    <small
                      className={`badge bg-${line.color} align-bottom ms-1 totaltask-badge`}
                    >
                      {line.cards?.length}
                    </small>
                  </h6>
                </div>
              </div>
              <SimpleBar className=" px-3 mx-n3">
                <div
                  id="unassigned-task"
                  className={
                    Array.isArray(line.cards) ? "tasks" : "tasks noTask"
                  }
                >
                  <Droppable droppableId={line.id}>
                    {(provided: any) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {line.cards?.length === 0 && (
                          <div
                            id="unassigned-task"
                            style={{
                              padding: "16px",
                              textAlign: "center",
                              color: "grey",
                            }}
                            className={
                              line.cards === null ? "tasks" : "tasks noTask"
                            }
                          >
                            No Cards
                          </div>
                        )}
                        {line.cards?.map((card: any, index: any) => {
                          return (
                            <Draggable
                              key={card.id}
                              draggableId={card.id!}
                              index={index}
                            >
                              {(provided: any) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="pb-1 task-list"
                                  id={line.name + "-task"}
                                >
                                  <div className="card task-box" id="uptask-1">
                                    <CardBody>
                                      <Link
                                        to="#"
                                        className="text-muted fw-medium fs-14 flex-grow-1"
                                      ></Link>
                                      <UncontrolledDropdown className="float-end d-flex justify-content-end align-iten-end">
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
                                              handleDeleteCard(card.id)
                                            }
                                            className="deletetask"
                                          >
                                            Delete
                                          </DropdownItem>

                                          <DropdownItem onClick={() => handleRegenerateCard(card)} className="regenerate-details">
                                            Regenerate
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

                                      <p className="text-muted">{card.text}</p>
                                      <div className="d-flex align-items-center mb-3">
                                        <div className="flex-grow-1">
                                          {card.badge1?.map(
                                            (badgeText: any, index: any) => (
                                              <span
                                                key={index}
                                                className="badge bg-primary-subtle text-primary me-1"
                                              >
                                                {badgeText}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                      {/* Prowidth and Procolor */}
                                      {dummyData.map((prog, i) => (
                                        <div
                                          id="unassigned-task mt-5"
                                          key={prog.id}
                                        >
                                          {prog.prowidth ? (
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
                                                    width: `${prog.prowidth}`,
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {/* Badges and User Images */}
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
                                                    key={image.id}
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
                                      <div className="mt-2">
                                        {/* Button removed from here */}
                                      </div>
                                    </CardBody>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
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
                    setActiveColumn(line.id);
                  }}
                  color="success"
                  className="w-100"
                >
                  <i className="ri-add-line align-bottom"></i> Add More
                </Button>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>

      <Modal isOpen={regenerateModal} toggle={toggleRegenerateModal} centered={true}>
        <ModalHeader toggle={toggleRegenerateModal}>
          <h5 className="modal-title">Regenerate Feature</h5>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h5>{editCard?.title}</h5>
          </div>
          <form onSubmit={ async (e)=>{
            e.preventDefault();
            setIsLoading(true);
            await handleRegenerateSubmit(editCard?.title, regenerateRequest);
            setIsLoading(false)
          }}>
            <div className="row g-3">
              <div>
                <label htmlFor="previousDescription" className="form-label">
                  Previous Description
                </label>
                <textarea
                  className="form-control"
                  id="previousDescription"
                  value={editCard?.text || ""}
                  disabled
                />
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
                  value={regenerateRequest}
                  onChange={(e) => setRegenerateRequest(e.target.value)}
                  placeholder="Enter your request for regenerating the card"
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
          {isRequestSuccessful && newDescription && (
            <div>
              <label htmlFor="newDescription" className="form-label">
                New Description
              </label>
              <div className="input-group">
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    checked={selectedDescription === newDescription}
                    onChange={handleDescriptionSelection}
                  />
                </div>
                <textarea
                  className="form-control"
                  id="newDescription"
                  value={newDescription}
                  disabled
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isRequestSuccessful && (
            <>
              <Button color="secondary" onClick={handleRegenerateModalCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleRegenerateModalAccept}>
                Accept
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalGrid} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal}>
          <h5 className="modal-title d-flex justify-content-end">
            {editCard ? "Edit Card" : "Add Your Own"}
          </h5>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={editCard ? handleUpdateSubmit : handleAddSubmit}>
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
                <label htmlFor="tags" className="form-label">
                  Tag Name
                </label>
                <Input
                  type="text"
                  className="form-control"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter Your Tag Title"
                />
              </div>
              <Button color="primary" type="submit">
                {editCard ? "Update Card" : "Add Card"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Feature;
