import React, { useEffect } from "react";
import { Button, Card, CardBody } from "reactstrap";
import { useEditable } from "./Contaxt";
import APIError from "./Error/API-Error-page";
import ImageToCodeContainer from "./ImageToCodeContainer";
import "./input-field.css";
const ImageTOApp = () => {
  const {
    inputValue,
    handleChange,
    textareaRef,
    loading,
    showAppComponent,
    error,
    setIsSendButtonDisabled,
    // handleButtonClick,
    handleGenerateCode,
    handleGenerateCodeForEditedImage
  } = useEditable();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (
        showAppComponent === "ImageDropper" ||
        showAppComponent === "priviewIframe"
      ) {
        handleGenerateCode();
      } else if (showAppComponent === "AppDraw") {
        handleGenerateCodeForEditedImage();
      }
    }
  };

  useEffect(() => {
    setIsSendButtonDisabled(!inputValue);
  }, [inputValue, setIsSendButtonDisabled]);

  const renderInputCard = () => (
    <Card className="container-fluid input-card">
      <CardBody>
        <div className="d-flex justify-content-end align-items-center chat-input-container">
          <textarea
            ref={textareaRef}
            className="chat-input chat-input bg-light border-light"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
          <Button
            className={`send-button ${inputValue ? "enabled" : ""}`}
            disabled={!inputValue}
            onClick={() => {
              if (
                showAppComponent === "ImageDropper" ||
                showAppComponent === "priviewIframe"
              ) {
                handleGenerateCode();
              } else if (showAppComponent === "AppDraw") {
                handleGenerateCodeForEditedImage();
              }
              // else {
              //   handleGenerateCode();
              // }
            }}
          >
            <i className="text-white ri-send-plane-2-fill"></i>
          </Button>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <React.Fragment>
      {error ? (
        <APIError />
      ) : (
        <>
          <ImageToCodeContainer />
          {!loading &&
            (showAppComponent === "ImageDropper" ||
              showAppComponent === "priviewIframe" ||
              showAppComponent === "AppDraw") &&
            renderInputCard()}
        </>
      )}
    </React.Fragment>
  );
};

export default ImageTOApp;
