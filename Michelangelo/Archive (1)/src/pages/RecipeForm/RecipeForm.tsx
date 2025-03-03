import { FormGroup } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormFeedback,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

interface RecipeFormProps {
  isOpen: boolean;
  toggle: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ isOpen, toggle }) => {
  const [ideaName, setIdeaName] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [vertical, setVertical] = useState("");
  const [strategy, setStrategy] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [businessNature, setBusinessNature] = useState("");
  const navigate = useNavigate();
  const [painPoints, setPainPoints] = useState("");
  const [userType, setUserType] = useState<string[]>([]);
  const [otherIndustry, setOtherIndustry] = useState("");
  // New state for error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const collapseSidebar = () => {
    document.documentElement.setAttribute("data-sidebar-size", "sm");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!ideaName.trim()) newErrors.ideaName = "Idea name is required";
    if (!ideaDescription.trim())
      newErrors.ideaDescription = "Idea description is required";
    if (!vertical) newErrors.vertical = "Industry is required";
    if (vertical === "Other" && !otherIndustry.trim())
      newErrors.otherIndustry = "Please specify your industry";
    if (!strategy) newErrors.strategy = "Strategy is required";
    if (strategy === "Product Modernization" && !painPoints.trim())
      newErrors.painPoints = "Pain points are required";
    if (userType.length === 0)
      newErrors.userType = "At least one user group is required";
    if (!businessNature.trim())
      newErrors.businessNature = "Nature of business is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDataSubmission = () => {
    if (validateForm()) {
      const newData = {
        name: ideaName,
        idea: ideaDescription,
        vertical: vertical === "Other" ? otherIndustry : vertical,
        strategy,
        competitors,
        natureOfBusiness: businessNature,
        painPoints: painPoints,
        userType,
      };

      setIdeaName("");
      setIdeaDescription("");
      setVertical("");
      setStrategy("");
      setCompetitors("");
      setBusinessNature("");
      setPainPoints("");
      setUserType([]);
      toggle();
      navigate("/brainstormer", { state: { base: newData }, replace: true });
    }
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserType((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
    if (errors.userType) setErrors((prev) => ({ ...prev, userType: "" }));
  };

  const handleVerticalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVertical(value);
    if (value !== "Other") {
      setOtherIndustry("");
    }
    if (errors.vertical) setErrors((prev) => ({ ...prev, vertical: "" }));
  };

  const handleStrategyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStrategy(filterEmoji(value));
    if (errors.strategy) setErrors((prev) => ({ ...prev, strategy: "" }));
  };

  const filterEmoji = (value: string) => {
    return value
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Miscellaneous Symbols and Pictographs
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport and Map Symbols
      .replace(/[\u{1F700}-\u{1F77F}]/gu, "") // Alchemical Symbols
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, "") // Geometric Shapes Extended
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, "") // Supplemental Arrows-C
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols and Pictographs
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "") // Chess Symbols
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
      .replace(/[\u{2600}-\u{26FF}]/gu, "") // Miscellaneous Symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
      .replace(/[\u{FE00}-\u{FE0F}]/gu, ""); // Variation Selectors
  };

  return (
    <React.Fragment>
      <div data-aos="flip-left">
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          centered={true}
          size="lg"
          scrollable={true}
          style={{ maxWidth: "630px" }}
        >
          <ModalHeader className="p-3 text" toggle={toggle}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#29817d",
                textAlign: "center",
                marginLeft: "10px",
                width: "100%",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Create New Idea
            </div>
          </ModalHeader>

          <ModalBody className="p-0">
            <div
              className="mb-3 form-label"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                textAlign: "left",
                padding: "1px 13px 0px 15px",
                margin: "3px 13px 0px 15px",
              }}
            >
            
              <h6>
                Every amazing creation starts with a brilliant idea, share your
                idea with{" "}
                <span
                  style={{
                    color: "#695EEF",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  MichelAngelo
                </span>{" "}
                and see in realtime your idea transforming into reality.
              </h6>
            </div>
            <div
              style={{
                padding: "0px 13px 10px 15px",
                margin: "0px 13px 10px 15px",
                color: "#29817d",
              }}
            >
              <div className="mb-3">
                <label htmlFor="ideaName" className="form-label">
                  Name your idea
                </label>
                <Input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Your idea name"
                  id="ideaName"
                  value={ideaName}
                  onChange={(e) => {
                    setIdeaName(filterEmoji(e.target.value));
                    if (errors.ideaName)
                      setErrors((prev) => ({ ...prev, ideaName: "" }));
                  }}
                  invalid={!!errors.ideaName}
                />
                <FormFeedback>{errors.ideaName}</FormFeedback>
              </div>
              <div className="mb-3">
                <label htmlFor="ideaDescription" className="form-label">
                  Describe your idea
                </label>
                <Input
                  type="textarea"
                  required={true}
                  className="form-control"
                  placeholder="Highlight the key features of your app. Explain why they are important, how they benefit the users, and what is the end goal?"
                  id="ideaDescription"
                  rows={3}
                  value={ideaDescription}
                  onChange={(e) => {
                    setIdeaDescription(filterEmoji(e.target.value));
                    if (errors.ideaDescription)
                      setErrors((prev) => ({ ...prev, ideaDescription: "" }));
                  }}
                  invalid={!!errors.ideaDescription}
                />
                <FormFeedback>{errors.ideaDescription}</FormFeedback>
              </div>
              <div className="mb-3">
                <FormGroup>
                  <label htmlFor="vertical" className="form-label">
                    Select the industry
                  </label>
                  <Input
                    type="select"
                    name="vertical"
                    id="vertical"
                    value={vertical}
                    onChange={handleVerticalChange}
                    invalid={!!errors.vertical}
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
                  <FormFeedback>{errors.vertical}</FormFeedback>
                </FormGroup>
              </div>
              {vertical === "Other" && (
                <div className="mb-3">
                  <label htmlFor="otherIndustry" className="form-label">
                    Specify your industry
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    id="otherIndustry"
                    placeholder="Enter your industry"
                    value={otherIndustry}
                    onChange={(e) => {
                      setOtherIndustry(filterEmoji(e.target.value));
                      if (errors.otherIndustry)
                        setErrors((prev) => ({ ...prev, otherIndustry: "" }));
                    }}
                    invalid={!!errors.otherIndustry}
                    required={vertical === "Other"}
                  />
                  <FormFeedback>{errors.otherIndustry}</FormFeedback>
                </div>
              )}
              <div className="mb-3">
                <FormGroup>
                  <label htmlFor="strategy" className="form-label">
                    Choose your strategy
                  </label>
                  <Input
                    type="select"
                    name="strategy"
                    id="strategy"
                    value={strategy}
                    onChange={handleStrategyChange}
                    invalid={!!errors.strategy}
                  >
                    <option value="">Select your strategy</option>
                    <option value="New Product Innovation">
                      New Product Innovation
                    </option>
                    <option value="Product Modernization">
                      Product Modernization
                    </option>
                  </Input>
                  <FormFeedback>{errors.strategy}</FormFeedback>
                </FormGroup>
              </div>

              {strategy === "Product Modernization" && (
                <div className="mb-3">
                  <label htmlFor="painPoints" className="form-label">
                    What are your pain points?
                  </label>
                  <Input
                    type="textarea"
                    required={true}
                    className="form-control"
                    placeholder="Bad inventory system, delayed notification, poor marketing"
                    id="painPoints"
                    rows={3}
                    value={painPoints}
                    onChange={(e) => {
                      setPainPoints(filterEmoji(e.target.value));
                      if (errors.painPoints)
                        setErrors((prev) => ({ ...prev, painPoints: "" }));
                    }}
                    invalid={!!errors.painPoints}
                  />
                  <FormFeedback>{errors.painPoints}</FormFeedback>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Select user groups</label>
                <div className="users-grid">
                  <label
                    className="user-checkbox"
                    style={{ color: "rgba(60, 61, 61, 0.876)" }}
                  >
                    <Input
                      type="checkbox"
                      value="Business Users"
                      checked={userType.includes("Business Users")}
                      style={{ border: "1px solid black" }}
                      onChange={handleUserTypeChange}
                      invalid={!!errors.userType}
                    />
                    Business Users
                  </label>
                
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="endConsumers"
                      value="End Consumers"
                      style={{ border: "1px solid black" }}
                      checked={userType.includes("End Consumers")}
                      onChange={handleUserTypeChange}
                      invalid={!!errors.userType}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="endConsumers"
                      style={{ color: "rgba(60, 61, 61, 0.876)" }}
                    >
                      End Consumers
                    </label>
                   
                  </div>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="technicalUsers"
                      value="Technical Users"
                      style={{ border: "1px solid black" }}
                      checked={userType.includes("Technical Users")}
                      onChange={handleUserTypeChange}
                      invalid={!!errors.userType}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="technicalUsers"
                      style={{ color: "rgba(60, 61, 61, 0.876)" }}
                    >
                      Technical Users
                    </label>
                 
                  </div>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="creativeUsers"
                      value="Creative Users"
                      style={{ border: "1px solid black" }}
                      checked={userType.includes("Creative Users")}
                      onChange={handleUserTypeChange}
                      invalid={!!errors.userType}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="creativeUsers"
                      style={{ color: "rgba(60, 61, 61, 0.876)" }}
                    >
                      Creative Users
                    </label>
                   
                  </div>
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="governmentUsers"
                      value="Government Users"
                      style={{ border: "1px solid black" }}
                      checked={userType.includes("Government Users")}
                      onChange={handleUserTypeChange}
                      invalid={!!errors.userType}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="governmentUsers"
                      style={{ color: "rgba(60, 61, 61, 0.876)" }}
                    >
                      Government Users
                    </label>
                 
                  </div>
                  {errors.userType && (
                    <div className="text-danger">{errors.userType}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="businessNature" className="form-label">
                    Describe the nature of your business
                  </label>
                  <Input
                    required={true}
                    type="textarea"
                    className="form-control"
                    id="businessNature"
                    placeholder="eg..Business to Customer, Business to Business or any other additional information regarding the product. "
                    rows={3}
                    value={businessNature}
                    onChange={(e) => {
                      setBusinessNature(filterEmoji(e.target.value));
                      if (errors.businessNature)
                        setErrors((prev) => ({ ...prev, businessNature: "" }));
                    }}
                    invalid={!!errors.businessNature}
                  />
                  <FormFeedback>{errors.businessNature}</FormFeedback>
                </div>
                <Button
                  color="primary"
                  className="btn-label"
                  style={{ width: "100%" }}
                  onClick={() => {
                    collapseSidebar();
                    handleDataSubmission();
                  }}
                >
                  {" "}
                  <i className="ri-magic-line label-icon align-middle fs-16 me-2"></i>{" "}
                  Transform your idea
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default RecipeForm;
