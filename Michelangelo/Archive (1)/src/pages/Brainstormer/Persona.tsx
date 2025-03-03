import { PersonaFragment } from "Mike/models/response";
import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
  UncontrolledTooltip
} from "reactstrap";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  default as img12,
  default as img13
} from "../../assets/images/small/img-1.jpg";
import {
  default as img14,
  default as img16
} from "../../assets/images/small/img-3.jpg";
import {
  default as img10,
  default as img8
} from "../../assets/images/small/img-7.jpg";
import {
  default as img11,
  default as img15,
  default as img9
} from "../../assets/images/small/img4.jpeg";
import {
  default as fma1,
  default as fma2,
  default as fma3,
  default as fma4,
  default as fma5
} from "../../assets/images/users/fem4.png";
import {
  default as ma1,
  default as ma2,
  default as ma3,
  default as ma4
} from "../../assets/images/users/man.png";

import DistributedColumn from "./Misc/DistributedChart";

type PersonaProps = {
  persona: PersonaFragment[] | null | undefined;
  setPersona: React.Dispatch<
    React.SetStateAction<PersonaFragment[] | null | undefined>
  >;
};
const Persona = ({ persona, setPersona }: PersonaProps) => {
  const [modalGrid, setModalGrid] = useState<boolean>(false);
  const [, setGender] = useState<string>("");

  // const handleGenderChange = (event: any) => {
  //   setGender(event.target.value);
  //   setEditData(prevState => prevState ? {
  //     ...prevState,
  //     demographics: {
  //       ...prevState.demographics,
  //       gender: event.target.value
  //     }
  //   } : null);
  // };
  const handleGenderChange = (event: any) => {
    const value = event.target.value;
    setNewData((prevState) =>
      prevState
        ? {
            ...prevState,
            demographics: {
              ...prevState.demographics,
              gender: value
            }
          }
        : null
    );
    setEditData((prevState) =>
      prevState
        ? {
            ...prevState,
            demographics: {
              ...prevState.demographics,
              gender: value
            }
          }
        : null
    );
  };

  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<PersonaFragment | null>({
    userType: "",
    demographics: {
      name: "",
      gender: "",
      profession: ""
    },
    role: {
      title: "",
      industry: "",
      level: "",
      decisionMakingPower: ""
    },
    motivation: [],
    painPoints: [],
    goals: [],
    expectations: [],
    laptopUsage: 0,
    tabletUsage: 0,
    smartphoneUsage: 0
  });

  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [newData, setNewData] = useState<PersonaFragment | null>({
    userType: "",
    demographics: {
      name: "",
      gender: "",
      profession: ""
    },
    role: {
      title: "",
      industry: "",
      level: "",
      decisionMakingPower: ""
    },
    motivation: [],
    painPoints: [],
    goals: [],
    expectations: [],
    laptopUsage: 0,
    tabletUsage: 0,
    smartphoneUsage: 0
  });

  const [filter, setFilter] = useState<string>("All");

  const menImages = [img8, img11, img12, img14, img15];
  const womenImages = [img10, img9, img13, img16];

  const menIconImages = [ma1, ma2, ma3, ma4, img11];
  const womenIconImages = [fma1, fma2, fma3, fma4, fma5];

  useEffect(() => {
    const filteredUserTypes = persona
      ?.map((user: PersonaFragment) => user.userType)
      .filter((value, index, self) => self.indexOf(value) === index);
    console.log("filtered usertype:", filteredUserTypes);
  }, [persona]);

  const [openWithIcons, setOpenWithIcons] = useState([
    "01",
    "11",
    "21",
    "31",
    "41",
    "51",
    "61"
  ]);

  const toggleWithIcons = (id: any) => {
    if (openWithIcons !== id) {
      setOpenWithIcons(id);
    }
  };

  const userTypes = [
    "Business Users",
    "End Consumers",
    "Creative Users",
    "Technical Users",
    "Government Users"
  ];

  const handleEditCard = (index: number) => {
    setCurrentEditIndex(index);
    setEditData(persona![index]);
    setGender(persona![index].demographics.gender);
    setModalGrid(true);
  };

  const counter = (
    data: number,
    device: keyof PersonaFragment,
    increment: number
  ) => {
    if (data + increment === -1 || data + increment === 25) return;
    setEditData((prevState) => {
      if (prevState === null)
        return {
          userType: "",
          demographics: { name: "", gender: "", profession: "" },
          role: { title: "", industry: "", level: "", decisionMakingPower: "" },
          motivation: [],
          painPoints: [],
          goals: [],
          expectations: [],
          laptopUsage: 0,
          tabletUsage: 0,
          smartphoneUsage: 0
        };
      return {
        ...prevState,
        [device]: data + increment
      };
    });
  };

  const counterAdd = (
    data: number,
    device: keyof PersonaFragment,
    increment: number
  ) => {
    if (data + increment === -1 || data + increment === 25) return;
    setNewData((prevState) => {
      if (prevState === null)
        return {
          userType: "",
          demographics: { name: "", gender: "", profession: "" },
          role: { title: "", industry: "", level: "", decisionMakingPower: "" },
          motivation: [],
          painPoints: [],
          goals: [],
          expectations: [],
          laptopUsage: 0,
          tabletUsage: 0,
          smartphoneUsage: 0
        };
      return {
        ...prevState,
        [device]: data + increment
      };
    });
  };

  const handleNewFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setNewData((prev) => {
      if (!prev) {
        return {
          userType: "",
          demographics: { name: "", gender: "", profession: "" },
          role: { title: "", industry: "", level: "", decisionMakingPower: "" },
          motivation: [],
          painPoints: [],
          goals: [],
          expectations: [],
          laptopUsage: 0,
          tabletUsage: 0,
          smartphoneUsage: 0
        };
      }

      const updatedData = { ...prev } as PersonaFragment;

      if (keys[0] === "userType") {
        updatedData["userType"] = value;
      } else if (keys.length === 2) {
        if (
          keys[0] in updatedData &&
          keys[1] in (updatedData as any)[keys[0]]
        ) {
          (updatedData as any)[keys[0]][keys[1]] = value;
        }
      } else if (name in updatedData) {
        const updatedValue = Array.isArray((updatedData as any)[name])
          ? value.split("\n")
          : parseInt(value) || value;
        (updatedData as any)[name] = updatedValue;
      }

      return updatedData;
    });
  };

  const handleNewFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newData) {
      const updatedNewData = { ...newData };
      const updatedPersona = [...(persona || []), updatedNewData];
      setPersona(updatedPersona);
      setModalAdd(false);
      setNewData(null);
    }
  };

  function shouldRender(item: PersonaFragment) {
    if (filter === "All") return true;

    if (typeof item.userType === "object") {
      let userType: string = item.userType[0];
      if (userType.toUpperCase() === filter.toUpperCase()) return true;
    } else if (
      typeof item.userType === "string" &&
      item.userType.toUpperCase() === filter.toUpperCase()
    )
      return true;
    return false;
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setEditData((prev) => {
      if (!prev) return null;
      const updatedData = { ...prev };

      if (keys[0] === "userType") {
        updatedData["userType"] = value;
      } else if (keys.length === 2) {
        (updatedData as any)[keys[0]][keys[1]] = value;
      } else {
        const updatedValue = value.split("\n");
        (updatedData as any)[name] = updatedValue;
      }

      return updatedData;
    });
  };
  //delete Profile card
  const handleDeleteCard = (index: number) => {
    const updatedPersona = persona?.filter((_, i) => i !== index);
    setPersona(updatedPersona);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentEditIndex !== null && editData) {
      const updatedPersona = [...(persona || [])];
      updatedPersona[currentEditIndex] = editData;
      setPersona(updatedPersona);
      setModalGrid(false);
    }
  };

  return (
    <React.Fragment>
      <div className=" d-flex justify-content-end mb-4 t-0">
        <UncontrolledDropdown>
          <DropdownToggle caret>
            <i className="ri-equalizer-fill fs-25 me-1 align-bottom"></i>
            Filter&nbsp;&nbsp;&nbsp;&nbsp;{filter}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setFilter("All")}>All</DropdownItem>
            {userTypes
              .map((item) => item)
              .filter((user, index, self) =>
                persona
                  ?.map((user: PersonaFragment) => user.userType.toUpperCase())
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .includes(user.toUpperCase())
              )
              .map((dropItems, counter) => (
                <DropdownItem onClick={() => setFilter(dropItems)}>
                  {dropItems}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <Row className="d-flex justify-content-center">
        {filter &&
          persona?.map((item, counter) =>
            shouldRender(item) ? (
              <Col lg={4} md={6} sm={12} key={counter}>
                {/* <SwiperSlide key={counter}> */}
                <Card
                  className="job-list-view-card overflow-hidden"
                  id="job-overview"
                >
                  <img
                    src={
                      item.demographics.gender.toUpperCase() === "MALE"
                        ? menImages[counter % 4]
                        : womenImages[counter % 4]
                    }
                    alt=""
                    id="cover-img"
                    className="img-fluid background object-fit-cover"
                  />
                  <CardBody className="card-body">
                    <div className="avatar-md mt-n5">
                      <div className="avatar-title bg-light rounded-circle">
                        <img
                          src={
                            item.demographics.gender.toUpperCase() === "MALE"
                              ? menIconImages[counter % 4]
                              : womenIconImages[counter % 4]
                          }
                          alt=""
                          className="avatar-md view-companylogo"
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="view-title fs-18">
                        {item.demographics.profession}
                        <UncontrolledDropdown className="float-end d-flex justify-content-end align-iten-end">
                          <DropdownToggle
                            className="arrow-none"
                            tag="a"
                            color="white"
                          >
                            <i className=" ri-pencil-fill"></i>
                          </DropdownToggle>

                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem onClick={() => setModalAdd(true)}>
                              Add Profile
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleEditCard(counter)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDeleteCard(counter)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </h5>
                      <div className="view-title fs-18"></div>

                      <div className="hstack gap-3 mb-3">
                        <span className="text-muted">
                          <i className=" ri-apps-line me-1 align-bottom"></i>{" "}
                          <span className="view-location">
                            {item.role.industry}
                          </span>
                        </span>
                      </div>

                      <div className="py-3 border border-dashed border-start-0 border-end-0 mt-4">
                        <Row>
                          <Col lg={4} sm={6}>
                            <div>
                              <p className="mb-2 text-uppercase fw-semibold fs-14 text-muted">
                                Role
                              </p>
                              <h5 className="fs-12 mb-0 view-type">
                                {item.userType}
                              </h5>
                            </div>
                          </Col>

                          <Col
                            lg={4}
                            sm={6}
                            className="d-flex justify-content-center"
                          >
                            <div className="text-center">
                              <p className="mb-2 text-uppercase fw-semibold fs-14 text-muted">
                                DMP
                                <span id="tooltipIcon" className="ms-1">
                                  <i className="ri-information-line"></i>
                                </span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target="tooltipIcon"
                                >
                                  Decision Making Power
                                </UncontrolledTooltip>
                              </p>
                              <h5 className="fs-12 mb-0 view-postdate">
                                {persona && item.role.decisionMakingPower}
                              </h5>
                            </div>
                          </Col>

                          <Col lg={4} sm={6}>
                            <div className="text-center">
                              <p className="mb-2 text-uppercase fw-semibold fs-14 text-muted">
                                Level
                              </p>
                              <h5 className="fs-12 mb-0 view-stacks">
                                {item.role.level}
                              </h5>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <Accordion
                        className="custom-accordionwithicon accordion-secondary"
                        id="accordionWithicon"
                        open={openWithIcons}
                        toggle={toggleWithIcons}
                      >
                        <AccordionItem>
                          <AccordionHeader targetId={"" + counter + 1}>
                            <i className="ri-global-line me-2"></i> Pain Points
                          </AccordionHeader>
                          <AccordionBody accordionId={"" + counter + 1}>
                            <ListGroup key={counter} flush>
                              {item.painPoints?.map((point, index) => (
                                <ListGroupItem key={index}>
                                  {point}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId={"" + counter + 2}>
                            <i className="ri-user-location-line me-2"></i>{" "}
                            Motivations
                          </AccordionHeader>
                          <AccordionBody accordionId={"" + counter + 2}>
                            <ListGroup flush>
                              {item.motivation?.map((motivation, index) => (
                                <ListGroupItem key={index}>
                                  {motivation}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId={"" + counter + 3}>
                            <i className="ri-pen-nib-line me-2"></i> Goals
                          </AccordionHeader>

                          <AccordionBody accordionId={"" + counter + 3}>
                            <ListGroup flush>
                              {item.goals?.map((goal, index) => (
                                <ListGroupItem key={index}>
                                  {goal}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </AccordionBody>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionHeader targetId={"" + counter + 4}>
                            <i className="ri-pen-nib-line me-2"></i>{" "}
                            Expectations
                          </AccordionHeader>

                          <AccordionBody accordionId={"" + counter + 4}>
                            <ListGroup flush>
                              {item.expectations?.map((expectation, index) => (
                                <ListGroupItem key={index}>
                                  {expectation}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>

                      <div className="mt-4">
                        <h5 className="mb-3">Behavioral Information</h5>
                        <p className="mx-2">Device usage per day(hrs) </p>
                        <div>
                          <DistributedColumn
                            data='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-dark", "--vz-info"]'
                            series={[
                              {
                                data: [
                                  item.laptopUsage,
                                  item.smartphoneUsage,
                                  item.tabletUsage
                                ]
                              }
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ) : null
          )}
      </Row>
      <Modal
        id="editModal"
        tabIndex={-1}
        isOpen={modalGrid}
        toggle={() => {
          setModalGrid(!modalGrid);
        }}
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setModalGrid(!modalGrid);
          }}
        >
          Edit Persona
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <Input
                type="text"
                className="form-control"
                id="name"
                name="demographics.name"
                value={editData?.demographics.name || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <div className="d-flex">
                <div className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="male"
                    name="demographics.gender"
                    value="Male"
                    checked={editData?.demographics.gender === "Male"}
                    onChange={handleGenderChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="male"
                    style={{
                      color: "rgb(67, 66, 66)",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="female"
                    name="demographics.gender"
                    value="Female"
                    checked={editData?.demographics.gender === "Female"}
                    onChange={handleGenderChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="female"
                    style={{
                      color: "rgb(67, 66, 66)",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="profession" className="form-label">
                Profession
              </label>
              <Input
                type="text"
                className="form-control"
                id="profession"
                name="demographics.profession"
                value={editData?.demographics.profession || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Role Title
              </label>
              <Input
                type="text"
                className="form-control"
                id="title"
                name="userType.userType"
                value={editData?.userType || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">
                Industry
              </label>
              <Input
                type="text"
                className="form-control"
                id="industry"
                name="role.industry"
                value={editData?.role.industry || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Decision Making Power
              </label>
              <Input
                type="text"
                className="form-control"
                id="decisionMakingPower"
                name="role.decisionMakingPower"
                value={editData?.role.decisionMakingPower || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Level
              </label>
              <Input
                type="text"
                className="form-control"
                id="level"
                name="role.level"
                value={editData?.role.level || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="motivation" className="form-label">
                Motivation
              </label>
              <Input
                type="textarea"
                rows="3"
                className="form-control"
                id="motivation"
                name="motivation"
                value={
                  editData?.motivation ? editData.motivation.join("\n") : ""
                }
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="painPoints" className="form-label">
                Pain Points
              </label>
              <Input
                type="textarea"
                rows="3"
                className="form-control"
                id="painPoints"
                name="painPoints"
                value={
                  editData?.painPoints ? editData.painPoints.join("\n") : ""
                }
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="goals" className="form-label">
                Goals
              </label>
              <Input
                type="textarea"
                rows="3"
                className="form-control"
                id="goals"
                name="goals"
                value={editData?.goals ? editData.goals.join("\n") : ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="goals" className="form-label">
                Expectations
              </label>
              <Input
                type="textarea"
                rows="3"
                className="form-control"
                id="expectations"
                name="expectations"
                value={
                  editData?.expectations ? editData.expectations.join("\n") : ""
                }
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Laptop Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counter(editData?.laptopUsage || 0, "laptopUsage", -1);
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={editData?.laptopUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counter(editData?.laptopUsage || 0, "laptopUsage", 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Mobile Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counter(
                      editData?.smartphoneUsage || 0,
                      "smartphoneUsage",
                      -1
                    );
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={editData?.smartphoneUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counter(
                      editData?.smartphoneUsage || 0,
                      "smartphoneUsage",
                      1
                    );
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Tablet Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counter(editData?.tabletUsage || 0, "tabletUsage", -1);
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={editData?.tabletUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counter(editData?.tabletUsage || 0, "tabletUsage", 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <Button color="primary" type="submit">
              Update Persona
            </Button>
          </form>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modalAdd}
        toggle={() => setModalAdd(!modalAdd)}
        modalClassName="zoomIn"
        // scrollable={true}
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => setModalAdd(!modalAdd)}
        >
          Add New Profile
        </ModalHeader>
        <form onSubmit={handleNewFormSubmit}>
          <ModalBody>
            <div className="mb-3">
              <label htmlFor="newNameInput" className="form-label">
                Name
              </label>
              <Input
                type="text"
                className="form-control"
                id="newNameInput"
                name="demographics.name"
                placeholder="Enter your Name..."
                value={newData?.demographics.name || ""}
                onChange={handleNewFormChange}
              />

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <div className="d-flex">
                  <div className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="male"
                      name="demographics.gender"
                      value="Male"
                      checked={editData?.demographics.gender === "Male"}
                      onChange={handleGenderChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="male"
                      style={{
                        color: "rgb(67, 66, 66)",
                        fontFamily: "sans-serif"
                      }}
                    >
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="female"
                      name="demographics.gender"
                      value="Female"
                      checked={editData?.demographics.gender === "Female"}
                      onChange={handleGenderChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="female"
                      style={{
                        color: "rgb(67, 66, 66)",
                        fontFamily: "sans-serif"
                      }}
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="newProfessionInput" className="form-label">
                Profession
              </label>
              <Input
                type="text"
                className="form-control"
                id="newProfessionInput"
                name="demographics.profession"
                placeholder="Enter your profession here..."
                value={newData?.demographics.profession || ""}
                onChange={handleNewFormChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newIndustryInput" className="form-label">
                Industry
              </label>
              <Input
                type="text"
                className="form-control"
                id="newIndustryInput"
                name="role.industry"
                placeholder="Enter your Industry type..."
                value={newData?.role.industry || ""}
                onChange={handleNewFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newNameInput" className="form-label">
                Roles
              </label>
              <Input
                type="text"
                className="form-control"
                id="newRoleInput"
                name="userType.userType"
                placeholder="Enter your role here..."
                value={newData?.userType || ""}
                onChange={handleNewFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newNameInput" className="form-label">
                Decision making power
              </label>
              <Input
                type="text"
                className="form-control"
                id="newDMPInput"
                name="role.decisionMakingPower"
                value={newData?.role.decisionMakingPower || ""}
                onChange={handleNewFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newNameInput" className="form-label">
                Level
              </label>
              <Input
                type="text"
                className="form-control"
                id="newLevelInput"
                name="role.level"
                placeholder="Enter your leval here..."
                value={newData?.role.level || ""}
                onChange={handleNewFormChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPainPointsInput" className="form-label">
                Pain Points
              </label>
              <Input
                type="textarea"
                className="form-control"
                id="newPainPointsInput"
                name="painPoints"
                placeholder="Enter your Pain Points here..."
                value={newData?.painPoints.join("\n") || ""}
                onChange={handleNewFormChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newMotivationInput" className="form-label">
                Motivation
              </label>
              <Input
                type="textarea"
                className="form-control"
                id="newMotivationInput"
                name="motivation"
                placeholder="Motivation..."
                value={newData?.motivation.join("\n") || ""}
                onChange={handleNewFormChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newGoalsInput" className="form-label">
                Goals
              </label>
              <Input
                type="textarea"
                className="form-control"
                id="newGoalsInput"
                name="goals"
                placeholder="Enter your goles here..."
                value={newData?.goals.join("\n") || ""}
                onChange={handleNewFormChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newGoalsInput" className="form-label">
                Exception
              </label>
              <Input
                type="textarea"
                className="form-control"
                id="newExceptionsInput"
                name="expectations"
                placeholder="Enter your goles here..."
                value={newData?.expectations.join("\n") || ""}
                onChange={handleNewFormChange}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Laptop Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counterAdd(newData?.laptopUsage || 0, "laptopUsage", -1);
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={newData?.laptopUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counterAdd(newData?.laptopUsage || 0, "laptopUsage", 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Mobile Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counterAdd(
                      newData?.smartphoneUsage || 0,
                      "smartphoneUsage",
                      -1
                    );
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={newData?.smartphoneUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counterAdd(
                      newData?.smartphoneUsage || 0,
                      "smartphoneUsage",
                      1
                    );
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="goals"
                className="form-label"
                style={{ marginRight: "1rem" }}
              >
                Tablet Usage
              </label>
              <div className="input-step">
                <button
                  type="button"
                  className="minus"
                  onClick={() => {
                    counterAdd(newData?.tabletUsage || 0, "tabletUsage", -1);
                  }}
                >
                  –
                </button>
                <Input
                  type="number"
                  className="product-quantity"
                  value={newData?.tabletUsage}
                  min="0"
                  max="100"
                  readOnly
                />
                <button
                  type="button"
                  className="plus"
                  onClick={() => {
                    counterAdd(newData?.tabletUsage || 0, "tabletUsage", 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </ModalBody>
          <div className="modal-footer">
            <Button color="light" onClick={() => setModalAdd(false)}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Add Profile
            </Button>
          </div>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Persona;
