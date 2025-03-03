import { UserMessage, userMessagesType } from "Mike/models/response";
import { axiosInstance } from "Mike/utils/axiosConfig";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  Button,
  Card,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Progress,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import mlo from "../../assets/images/mikeLogo.png";
import userDummayImage from "../../assets/images/users/avatar-1.jpg";
import {
  getMessages,
  getDirectContact as onGetDirectContact,
} from "../../slices/thunks";
import GrapesJS from "./GrapesJs";
import WireframeRecepiModal from "./RecipeModalWireframe";
import SitemapModal from "./SiteMapForData";
import "./animation.css";
import { WIREFRAME_EDITOR } from "Mike/constants";
import { editWireFrame } from "services/wireFrameGenratorServices";

const GenerateWireFrame = () => {
  const userChatShow: any = useRef();
  const dispatch = useDispatch<any>();
  const [Chat_Box_Username] = useState<any>("Michelangelo");
  const [user_Status] = useState<string | null>("Wireframe Creator");
  const [projectName, setProjectName] = useState<string>("Sample");
  const [Chat_Box_Image] = useState<any>(mlo);
  const [currentRoomId] = useState<any>(1);
  const [curMessage, setcurMessage] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const [showGrapesPage, setShowGrapesPage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setApiResponse] = useState<any>(null);
  const [messages] = useState([
    "Generating your design...",
    "Finding the right components...",
    "Have a cup of coffe while we finalise the design...",
    "Finalizing...",
  ]);
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<any>([
    {
      id: 1,
      roomId: 1,
      sender: "1",
      createdAt: "",
      usermessages: [],
    },
  ]);
  const { accounts } = useMsal();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [sitemapData, setSitemapData] = useState(null);
  const [generatedResponse, setGeneratedResponse] = useState<{
    design: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    setIsAppModalOpen(true);
  }, []);

  React.useEffect(() => {
    AOS.init({ duration: 800 }); // You can adjust the duration of the animation here
  }, []);

  const toggleAppModal = (state: any) => {
    setIsAppModalOpen(state !== undefined ? state : !isAppModalOpen);
    console.log("Check status of app modal state", isAppModalOpen);
  };
  const toggleSitemapModal = () => setIsSitemapModalOpen(!isSitemapModalOpen);

  console.log("Generated Response from  siteMap Modal: ", generatedResponse);

  const [closeCard, setCloseCard] = useState(false);

  const handleOpenCard = () => {
    const element = document.getElementById("card-container");

    // Remove fade-out class and add fade-in class when opening
    element?.classList.remove("fade-out");
    element?.classList.add("fade-in");

    setTimeout(() => {
      setCloseCard(false); // Set the card to open
    }, 100); // Delay to ensure the state has updated
  };

  const handleCloseClick = () => {
    const element = document.getElementById("card-container");

    // Remove fade-in class and add fade-out class when closing
    element?.classList.remove("fade-in");
    element?.classList.add("fade-out");

    setTimeout(() => {
      setCloseCard(true); // Set the card to close
    }, 800); // Delay to match the fade-out animation duration
  };

  const handleAppSubmit = (data: React.SetStateAction<null>) => {
    console.log("App data submitted:", data); // Add this line for debugging
    setSitemapData(data);
    setIsAppModalOpen(false);
    setIsSitemapModalOpen(true);
  };

  useEffect(() => {
    dispatch(onGetDirectContact());
    dispatch(getMessages(currentRoomId));
  }, [dispatch, currentRoomId]);

  const backToUserChat = () => {
    userChatShow.current.classList.remove("user-chat-show");
  };

  const toggleModal = () => {
    setView(false);
  };

  const viewDesign = () => {
    setView(true);
  };

  useEffect(() => {
    console.log("chat messages", chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isLoading) {
      const totalDuration = 4 * 60 * 1000; // 4 minutes
      const intervalTime = totalDuration / 100; // Interval time for 1% progress
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setLoading(false);
            return 100;
          }
          setCurrentMessageIndex(Math.floor(newProgress / 25));

          return newProgress;
        });
      }, intervalTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
        setCurrentMessageIndex(0);
      }
    };
  }, [isLoading]);

  const convertToCode = () => {
    // const code = `<html><body>Sample test <body></html>`
    // console.log("Generated code for conversion:", generatedResponse?.code)
    navigate("/image_to_app", {
      state: {
        code: generatedResponse?.code,
        appName: projectName,
        design: generatedResponse?.design,
      },
      replace: true,
    });
  };

  const extractHtmlContent = (html: string): string => {
    const match = html.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    return match ? match[0] : "";
  };

  const addDAMessage = async () => {
    if (curMessage === "") return;
    const messageIdToUpdate = 1;
    setLoading(true);
    const newMessage = {
      id: 1,
      from_id: 1,
      to_id: 2,
      msg: curMessage,
      reply: "",
      isImages: false,
      has_images: [],
      datetime: "",
    };
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    newMessage.datetime = `${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;

    const updatedChatMessages = chatMessages.map(
      (message: { id: number; usermessages: any }) =>
        message.id === messageIdToUpdate
          ? {
              ...message,
              usermessages: [...message.usermessages, newMessage],
            }
          : message
    );
    setChatMessages(updatedChatMessages);

    let furtherUpdatedChatMessages: any[] = [];
    setTimeout(() => {
      const responseMsg = {
        id: Math.floor(Math.random() * 100),
        from_id: 2,
        to_id: 1,
        msg: "Please hold on while I work on a design.",
        reply: "",
        isImages: false,
        has_images: [],
        datetime: `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`,
      };
      furtherUpdatedChatMessages = updatedChatMessages.map(
        (message: { id: number; usermessages: any }) =>
          message.id === messageIdToUpdate
            ? {
                ...message,
                usermessages: [...message.usermessages, responseMsg],
              }
            : message
      );
      setChatMessages(furtherUpdatedChatMessages);
    }, 1000);
    setcurMessage("");
    const apiPayload = {
      userSignature: accounts[0].username,
      prompt: `${curMessage}\nHere is my previously generated HTML code:\n${generatedResponse?.code}\nMake the change as suggested and provide the complete updated HTML.`,
    };

    try {
      // const response = await axiosInstance.post(
      //   WIREFRAME_EDITOR,
      //   apiPayload
      // );
      const response = await editWireFrame(apiPayload);
      if (response.data.status_code !== 200) {
        console.log("There seems to be some error");
        addResponse(
          furtherUpdatedChatMessages,
          "Something went wrong, please try again!"
        );
        setLoading(false);
        setProgress(0);
        return;
      }

      const design = response.data.code;
      const image = response.data.design;
      const updatedHtmlContent = extractHtmlContent(design);
      console.log("Updated HTML Content:", updatedHtmlContent);
      setGeneratedResponse({ design: image, code: updatedHtmlContent });

      addResponse(
        furtherUpdatedChatMessages,
        "Here is your updated App",
        true,
        [{ id: 1, image: design }]
      );
      setApiResponse(response);
      console.log("response from mlo", response);
      setLoading(false);
      setProgress(0);
    } catch (error: any) {
      setLoading(false);
      setProgress(0);
      setTimeout(() => {
        addResponse(
          furtherUpdatedChatMessages,
          "Something went wrong, please try again",
          false
        );
      }, 20000);

      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        addResponse(
          furtherUpdatedChatMessages,
          "Something went wrong, please try again!"
        );
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }

    setcurMessage("");
  };

  const addResponse = (
    updatedChatMessages: any,
    message: string,
    isImage?: boolean,
    images?: { id: number; image: string }[]
  ) => {
    const newResponse = {
      id: Math.floor(Math.random() * 100),
      from_id: 2,
      to_id: 1,
      msg: message,
      reply: "",
      isImages: isImage || false,
      has_images: isImage ? images : [],
      datetime: "",
    };

    const finalUpdatedChatMessages = updatedChatMessages.map(
      (message: { id: number; usermessages: any }) =>
        message.id === 1
          ? {
              ...message,
              usermessages: [...message.usermessages, newResponse],
            }
          : message
    );

    setChatMessages(finalUpdatedChatMessages);
  };
  const chatRef = useRef<any>(null);
  const onKeyPress = (e: any) => {
    const { key, value } = e;
    if (key === "Enter") {
      e.preventDefault();
      setcurMessage(value);
      addDAMessage();
    }
  };
  const [, setemojiArray] = useState<any>([]);
  const [grapesContent, setGrapesContent] = useState({ code: "", design: "" });
  const handleEditClick = async () => {
    setShowGrapesPage(true);
    if (generatedResponse) {
      const { code, design } = generatedResponse;
      setGrapesContent({ code, design });
    } else {
      console.log("No API response available");
    }
  };

  if (showGrapesPage) {
    return (
      <GrapesJS
        html={grapesContent.code}
        cssUrl={grapesContent.design}
        design={grapesContent.design}
        setHtml={setGeneratedResponse}
        setShowGrapes={setShowGrapesPage}
      />
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4">
            <div className="user-chat w-100 overflow-hidden" ref={userChatShow}>
              <div className="chat-content d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                  <div className="position-relative">
                    <div className="p-3 user-chat-topbar">
                      <Row className="align-items-center">
                        <Col sm={4} xs={8}>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 d-block d-lg-none me-3">
                              <Link
                                to="#"
                                onClick={backToUserChat}
                                className="user-chat-remove fs-18 p-1"
                              >
                                <i className="ri-arrow-left-s-line align-bottom"></i>
                              </Link>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 chat-user-img online user-own-img align-self-center me-3 ms-0">
                                  {Chat_Box_Image === undefined ? (
                                    <img
                                      src={userDummayImage}
                                      className="rounded-circle avatar-xs"
                                      alt=""
                                    />
                                  ) : (
                                    <img
                                      src={Chat_Box_Image}
                                      className="rounded-circle avatar-xs"
                                      alt=""
                                    />
                                  )}
                                  <span className="user-status"></span>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                  <h5 className="text-truncate mb-0 fs-16">
                                    <a
                                      className="text-reset username"
                                      data-bs-toggle="offcanvas"
                                      href="#userProfileCanvasExample"
                                      aria-controls="userProfileCanvasExample"
                                    >
                                      {Chat_Box_Username}
                                    </a>
                                  </h5>
                                  <p className="text-truncate text-muted fs-14 mb-0 userStatus">
                                    <small>
                                      {user_Status === null
                                        ? "24 Members"
                                        : user_Status}
                                    </small>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col sm={8} xs={4}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "end",
                            }}
                          >
                            <Button
                              onClick={handleOpenCard}
                              className="btn-info rounded-pill shadow-sm btn btn-icon m-2 btn-lg p-2 rounded-pill"
                            >
                              <i
                                className="ri-add-fill"
                                style={{ fontSize: "20px" }}
                              ></i>
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div id="users-chat">
                      <div
                        className="chat-conversation p-3 p-lg-4 simplebar-scrollable-y"
                        id="chat-conversation"
                      >
                        <SimpleBar ref={chatRef} style={{ height: "100%" }}>
                          <>
                            {generatedResponse?.code &&
                            generatedResponse?.design ? (
                              ""
                            ) : sitemapData === null ||
                              isAppModalOpen === true ? (
                              <div id="card-container" data-aos="fade-right">
                                <WireframeRecepiModal
                                  isOpen={isAppModalOpen}
                                  toggle={toggleAppModal}
                                  onSubmit={handleAppSubmit}
                                  closeCard={closeCard}
                                  handleCloseClick={handleCloseClick}
                                  setProjectName={setProjectName}
                                />
                              </div>
                            ) : (
                              <div id="card-container" data-aos="fade-right">
                                <SitemapModal
                                  setGeneratedResponse={setGeneratedResponse}
                                  isOpen={isSitemapModalOpen}
                                  toggle={toggleSitemapModal}
                                  sitemapData={sitemapData}
                                />
                              </div>
                            )}
                          </>

                          <ul
                            className="list-unstyled chat-conversation-list"
                            id="users-conversation"
                          >
                            {(chatMessages || []).map(
                              (message: userMessagesType) =>
                                message.usermessages.map(
                                  (userChat: UserMessage, key: number) => (
                                    <li
                                      className={
                                        userChat.to_id === 1
                                          ? "chat-list left"
                                          : "chat-list right"
                                      }
                                      key={key}
                                    >
                                      <div className="conversation-list">
                                        {message.sender === Chat_Box_Username &&
                                          userChat.to_id === 1 && (
                                            <div className="chat-avatar">
                                              {Chat_Box_Image === undefined ? (
                                                <img
                                                  src={userDummayImage}
                                                  alt=""
                                                />
                                              ) : (
                                                <img
                                                  src={Chat_Box_Image}
                                                  alt=""
                                                />
                                              )}
                                            </div>
                                          )}
                                        <div className="user-chat-content">
                                          {" "}
                                          <div className="ctext-wrap">
                                            {userChat.isImages === true ? (
                                              <>
                                                <div className="message-img mb-0">
                                                  {userChat.has_images &&
                                                    userChat.has_images.map(
                                                      (
                                                        img: {
                                                          id: number;
                                                          image: string;
                                                        },
                                                        key: number
                                                      ) => (
                                                        <div key={key}>
                                                          <div>
                                                            <a
                                                              className="popup-img d-inline-block"
                                                              href={img.image}
                                                            >
                                                              <img
                                                                src={img.image}
                                                                alt=""
                                                                className="rounded border"
                                                              />
                                                            </a>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                                <UncontrolledDropdown className="align-self-start message-box-drop">
                                                  <DropdownToggle
                                                    href="#"
                                                    className="btn nav-btn"
                                                    tag="a"
                                                  >
                                                    <i className="ri-more-2-fill"></i>
                                                  </DropdownToggle>
                                                  <DropdownMenu>
                                                    <DropdownItem
                                                      href="#"
                                                      onClick={viewDesign}
                                                    >
                                                      <i className="ri-eye-line me-2 text-muted align-bottom"></i>
                                                      View
                                                    </DropdownItem>

                                                    <DropdownItem
                                                      href="#"
                                                      onClick={handleEditClick}
                                                    >
                                                      <i className="ri-pencil-line me-2 text-muted align-bottom"></i>
                                                      Edit
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      href="#"
                                                      onClick={() =>
                                                        convertToCode()
                                                      }
                                                    >
                                                      <i className="ri-lightbulb-line me-2 text-muted align-bottom"></i>
                                                      Convert to code
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </UncontrolledDropdown>
                                              </>
                                            ) : (
                                              <>
                                                <div className="ctext-wrap-content">
                                                  {userChat.reply ? (
                                                    <>
                                                      <div className="ctext-wrap-content">
                                                        <div className="replymessage-block mb-0 d-flex align-items-start">
                                                          <div className="flex-grow-1">
                                                            <h5 className="conversation-name">
                                                              {
                                                                userChat.reply
                                                                  .sender
                                                              }
                                                            </h5>
                                                            <p className="mb-0">
                                                              {
                                                                userChat.reply
                                                                  .msg
                                                              }
                                                            </p>
                                                          </div>
                                                          <div className="flex-shrink-0">
                                                            <button
                                                              type="button"
                                                              className="btn btn-sm btn-link mt-n2 me-n3 font-size-18"
                                                            ></button>
                                                          </div>
                                                        </div>
                                                        <p className="mb-0 ctext-content mt-1">
                                                          {userChat.msg}
                                                        </p>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <p className="mb-0 ctext-content">
                                                      {userChat.msg}
                                                    </p>
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                          <div className="conversation-name">
                                            <small className="text-muted time">
                                              {userChat.datetime}
                                            </small>
                                            <span className="text-success check-message-icon">
                                              <i className="ri-check-double-line align-bottom"></i>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                )
                            )}
                          </ul>
                          {generatedResponse?.code && (
                            <Row>
                              <Col md={6} lg={6}>
                                <Card
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "30px",
                                    marginTop: "20px",
                                    marginLeft: "20px",
                                    marginBottom: "20px",
                                    padding: "20px",
                                    boxShadow:
                                      "0 4px 8px rgba(0, 0.2, 0.2, 0.3)", // Add shadow
                                    backgroundColor: "#f1f1f1",
                                    position: "relative", // Add relative positioning to the card
                                  }}
                                >
                                  <UncontrolledDropdown
                                    className="message-box-drop"
                                    style={{
                                      position: "absolute",
                                      top: "10px", // Adjust as needed
                                      right: "10px", // Adjust as needed
                                    }}
                                  >
                                    <DropdownToggle
                                      href="#"
                                      className="btn nav-btn"
                                      tag="a"
                                    >
                                      <i className="ri-more-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <DropdownItem
                                        href="#"
                                        onClick={viewDesign}
                                      >
                                        <i className="ri-eye-line me-2 text-muted align-bottom"></i>
                                        View
                                      </DropdownItem>
                                      <DropdownItem
                                        href="#"
                                        onClick={handleEditClick}
                                      >
                                        <i className="ri-pencil-line me-2 text-muted align-bottom"></i>
                                        Edit
                                      </DropdownItem>
                                      <DropdownItem
                                        href="#"
                                        onClick={() => convertToCode()}
                                      >
                                        <i className="ri-lightbulb-line me-2 text-muted align-bottom"></i>
                                        Convert to code
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                  <iframe
                                    srcDoc={generatedResponse?.code}
                                    style={{
                                      width: "100%",
                                      height: "400px",
                                      transition: "width 0.3s ease-in-out",
                                      padding: "20px",
                                      overflow: "hidden", // Hide scrollbar
                                    }}
                                    title="Example Page"
                                  ></iframe>
                                </Card>
                              </Col>
                            </Row>
                          )}
                        </SimpleBar>
                      </div>
                      {isLoading && (
                        <div style={{ paddingLeft: 30, paddingBottom: 10 }}>
                          <div className="text-muted mb-0">
                            <p>{messages[currentMessageIndex]}</p>
                          </div>
                          <Progress value={progress} striped animated />
                        </div>
                      )}
                    </div>
                    <div className="chat-input-section p-3 p-lg-4">
                      <form id="chatinput-form">
                        <Row className="g-0 align-items-center">
                          <div className="col-auto">
                            <div className="chat-input-links me-2"></div>
                          </div>
                          <div className="col">
                            <div className="chat-input-feedback">
                              Please Enter a Message
                            </div>
                            <input
                              type="text"
                              value={curMessage}
                              onKeyDown={onKeyPress}
                              onChange={(e) => setcurMessage(e.target.value)}
                              className="form-control chat-input bg-light border-light"
                              id="chat-input"
                              placeholder="Type your message..."
                            />
                          </div>
                          <div className="col-auto">
                            <div className="chat-input-links ms-2">
                              <div className="links-list-item">
                                <button
                                  type="button"
                                  disabled={curMessage === ""}
                                  onClick={() => {
                                    addDAMessage();
                                    setemojiArray("");
                                  }}
                                  className="btn btn-success chat-send waves-effect waves-light disable"
                                >
                                  <i className="ri-send-plane-2-fill align-bottom"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Row>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Modal isOpen={view} toggle={toggleModal} size="lg">
        <ModalHeader>Design Preview</ModalHeader>
        <ModalBody>
          {generatedResponse?.design && (
            <img
              src={"data:image/png;base64," + generatedResponse.design}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default GenerateWireFrame;
