import axios from "axios";
import { WIREFRAME_LAYOUT, WIREFRAME_REPHRASE } from "Mike/constants";
import { FormErrors, WireframeRecepiModalProps } from "Mike/models/response";
import { axiosInstance } from "Mike/utils/axiosConfig";
import { useMsal } from "@azure/msal-react";
import React, { FC, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Spinner
} from "reactstrap";
import { getWireFrameLayout, rephraseWireFrame } from "services/wireFrameGenratorServices";

const WireframeRecepiModal: FC<WireframeRecepiModalProps> = ({
  onSubmit,
  closeCard,
  handleCloseClick,
  setProjectName
}) => {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [designSystem, setDesignSystem] = useState("");
  const [industry, setIndustry] = useState("");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { accounts } = useMsal();

  const [errors, setErrors] = useState<FormErrors>({
    appName: "",
    appDescription: "",
    industry: "",
    otherIndustry: "",
    designSystem: ""
  });

  const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setIndustry("Other");
      setShowOtherInput(true);
    } else {
      setIndustry(value);
      setOtherIndustry("");
      setShowOtherInput(false);
    }
    setErrors({ ...errors, industry: "" });
  };

  const handleOtherIndustryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setOtherIndustry(value);
    setIndustry(value);
    setErrors({ ...errors, otherIndustry: "" });
  };

  const handlePromptRefined = async () => {
    if (!appDescription) {
      setErrors({ ...errors, appDescription: "App description is required" });
      return;
    }
    console.log("Handle Click Prompt Refined");

    const apiPayload = {
      userSignature:accounts[0].username,
      prompt:
        appDescription + "\n this apps pertains to " + industry + " industry"
    };
    setIsLoading(true);

    try {
      // const response = await axiosInstance.post(
      //   WIREFRAME_REPHRASE,
      //   apiPayload
      // );
      const response  = await rephraseWireFrame(apiPayload);
      if (response.data.status_code === 200) {
        const newPrompt = response.data.prompt;
        console.log("Response from Prompt:", newPrompt);
        setAppDescription(newPrompt);
      } else {
        console.log("There seems to be some error");
        console.error("Error response data:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      appName: "",
      appDescription: "",
      industry: "",
      otherIndustry: "",
      designSystem: ""
    };

    let isValid = true;

    if (!appName.trim()) {
      newErrors.appName = "App name is required";
      isValid = false;
    }

    if (!appDescription.trim()) {
      newErrors.appDescription = "App description is required";
      isValid = false;
    }

    if (!industry) {
      newErrors.industry = "Industry is required";
      isValid = false;
    }

    if (industry === "Other" && !otherIndustry.trim()) {
      newErrors.otherIndustry = "Please specify your industry";
      isValid = false;
    }

    if (!designSystem) {
      newErrors.designSystem = "Design system is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    console.log("Handle Click Submit layout Data");

    const apiPayload = {
      userSignature:accounts[0].username,
      appName: appName,
      prompt: appDescription,
      industry: industry === "Other" ? otherIndustry : industry,
      designSystem: designSystem
    };

    setIsNextLoading(true);

    try {
      // const response = await axiosInstance.post(
      //   WIREFRAME_LAYOUT,
      //   apiPayload
      // );
      const response = await getWireFrameLayout(apiPayload);
      if (response.data.status_code === 200) {
        const newData = response.data.layout_details;
        console.log("Response from layout:", newData);
        setProjectName(appName);
        onSubmit(newData);
      } else {
        console.log("There seems to be an error");
        console.error("Error response data:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsNextLoading(false);
    }

    setAppDescription("");
    setAppName("");
    setIndustry("");
    setDesignSystem("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        padding: "20px"
      }}
    >
      {!closeCard && (
        <Card
          data-aos="fade-right"
          style={{
            background: "#f5f7fa",
            borderRadius: "15px",
            boxShadow: "0 4px 8px rgba(0, 0.2, 0.2, 0.3)",
            minWidth: "400px",
            maxWidth: "600px",
            width: "100%"
          }}
        >
          <CardHeader
            style={{
              background: "#482668",
              color: "white",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
            className="text-white"
          >
            Create Your App
            <i
              className="ri-close-fill cursor-pointer"
              onClick={handleCloseClick}
            ></i>
          </CardHeader>
          <CardBody className="p-4">
            <FormGroup>
              <Label
                for="appName"
                className="text-lg font-semibold text-gray-700"
              >
                App Name
              </Label>
              <Input
                type="text"
                id="appName"
                value={appName}
                onChange={(e) => {
                  setAppName(e.target.value);
                  setErrors({ ...errors, appName: "" });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your app name"
                invalid={!!errors.appName}
              />
              <FormFeedback>{errors.appName}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label
                for="appDescription"
                className="text-lg font-semibold text-gray-700 flex items-center"
              >
                What do you want to create?
                {!isLoading ? (
                  <i
                    className="ri-magic-fill ms-2 cursor-pointer"
                    style={{ fontSize: "1.5rem" }}
                    onClick={handlePromptRefined}
                  ></i>
                ) : (
                  <Spinner size="sm" color="secondary" className="ms-3" />
                )}
              </Label>
              <Input
                type="textarea"
                id="appDescription"
                value={appDescription}
                onChange={(e) => {
                  setAppDescription(e.target.value);
                  setErrors({ ...errors, appDescription: "" });
                }}
                className="resize-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Describe your app idea"
                invalid={!!errors.appDescription}
              />
              <FormFeedback>{errors.appDescription}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label
                for="industry"
                className="text-lg font-semibold text-gray-700"
              >
                Industry
              </Label>
              <Input
                type="select"
                id="industry"
                value={industry}
                onChange={handleIndustryChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                invalid={!!errors.industry}
              >
                <option value="">Select the industry</option>
                <option value="Banking">Banking</option>
                <option value="Finance">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Lifesciences">Lifesciences</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </Input>
              <FormFeedback>{errors.industry}</FormFeedback>

              {showOtherInput && (
                <div className="mb-3 mt-2">
                  <Label
                    htmlFor="otherIndustry"
                    className="form-label text-gray-700"
                  >
                    Specify your industry
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="otherIndustry"
                    placeholder="Enter your industry"
                    value={otherIndustry}
                    onChange={handleOtherIndustryChange}
                    invalid={!!errors.otherIndustry}
                    required
                  />
                  <FormFeedback>{errors.otherIndustry}</FormFeedback>
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label
                for="designSystem"
                className="text-lg font-semibold text-gray-700"
              >
                Design System
              </Label>
              <Input
                type="select"
                id="designSystem"
                value={designSystem}
                onChange={(e) => {
                  setDesignSystem(e.target.value);
                  setErrors({ ...errors, designSystem: "" });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                invalid={!!errors.designSystem}
              >
                <option value="">Select the design system</option>
                <option value="Tailwind">Tailwind</option>
              </Input>
              <FormFeedback>{errors.designSystem}</FormFeedback>
            </FormGroup>
            <div
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                display: "flex",
                justifyContent: "flex-end",
                background: "none",
                border: "none"
              }}
            >
              <Button
                color="primary"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                {!isNextLoading ? (
                  "Next"
                ) : (
                  <div className="flex items-center">
                    <Spinner size="sm" color="info" />
                    <span className="ms-2">Loading...</span>
                  </div>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
export default WireframeRecepiModal;
