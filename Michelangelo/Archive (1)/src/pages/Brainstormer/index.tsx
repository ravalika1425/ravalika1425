import { useMsal } from "@azure/msal-react";
import axios from "axios";
import classnames from "classnames";
import {
  ADD_BRAINSTORMER_ENDPOINT,
  PRODUCT_RESEARCH,
  UPDATE_BRAINSTORMER_ENDPOINT,
} from "Mike/constants";
import { AddPayload, EditPayload } from "Mike/models/playResponse";
import {
  BaseFragment,
  BrainstormerRequest,
  CompetitorAnalysisFragment,
  FeaturesFragment,
  PersonaFragment,
  RoadmapFragment,
  SwotAnalysisFragment,
  UnderstandingFragment,
} from "Mike/models/response";
import { axiosInstance } from "Mike/utils/axiosConfig";
import { isObjectEmpty } from "Mike/utils/utils";
import Error500 from "pages/AuthenticationInner/Errors/Error500";
import ComingSoon from "pages/Pages/ComingSoon/ComingSoon";
import RecipeForm from "pages/RecipeForm/RecipeForm";
import React, { useEffect, useState } from "react";
import { BlockerFunction, useBlocker, useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Feature from "./Features";
import ConfirmNavigation from "./Misc/ConfirmNavigation";
import Persona from "./Persona";
import Roadmap from "./Roadmap";
import SwotAnalysis from "./SwotAnalysis";
import Understanding from "./Understanding";
import CompetitorAnalysis from "./CompetitorAnalysis";
import { createBrainStormer, getBrainStormer, reloadBrainStormer, updateBrainStormer } from "services/brainStormerServices";

type TabCategory =
  | "understanding"
  | "userPersona"
  | "featuresList"
  | "competitorAnalysis"
  | "swotAnalysis"
  | "roadmap";
const Brainstormer = () => {
  document.title = "Brainstormer | Michelangelo";
  const [justifyPillsTab, setjustifyPillsTab] = useState<number>(1);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastTry, setLastTry] = useState<number>(1);
  const [maxStepper, setMaxStepper] = useState(1);
  const [projectID, setProjectID] = useState<string>("");
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(true);
  const [understanding, setUnderstanding] = useState<
    UnderstandingFragment | null | undefined
  >(null);
  const [features, setFeatures] = useState<FeaturesFragment | null | undefined>(
    null
  );
  const [base, setBaseData] = useState<BaseFragment | null | undefined>(null);
  const [persona, setPersona] = useState<PersonaFragment[] | null | undefined>(
    null
  );
  const [swotAnalysis, setSwotAnalysis] = useState<
    SwotAnalysisFragment | null | undefined
  >(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<
    CompetitorAnalysisFragment | null | undefined
  >(null);
  const [roadmap, setRoadmap] = useState<RoadmapFragment | null | undefined>(
    null
  );
  const [isOpen, setIsOpen] = useState(false); // Adjust as necessary
  const location = useLocation();
  let { state } = location;
  const { accounts } = useMsal();
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!state) return;
    if (state._id) {
      setProjectID(state._id);
      if (state.base) setBaseData(state.base);
      if (state.understanding && !isObjectEmpty(state.understanding))
        setUnderstanding(state.understanding);
      if (state.persona && state.persona.length !== 0) {
        setPersona(state.persona);
        setMaxStepper(2);
      }
      
      if (state.feature && !isObjectEmpty(state.feature)) {
        setFeatures(state.feature);
        setMaxStepper(3);
      }
      if (
        state.competitorAnalysis && !isObjectEmpty(state.competitorAnalysis)
      ) {
        setFeatures(state.competitorAnalysis);
        setMaxStepper(4);
      }
      if (state.swotAnalysis && !isObjectEmpty(state.swotAnalysis)) {
        console.log("setting swot");
        setSwotAnalysis(state.swotAnalysis);
        setMaxStepper(5);
      }
      if (state.roadmap && !isObjectEmpty(state.roadmap)) {
        setRoadmap(state.roadmap);
        setMaxStepper(6);
      }
    } else {
      createNewBrainstormer(accounts[0].username, state.base);
    }
    state = null;
  }, [state]);

  useEffect(() => {
    console.log("isUnsavedChange", isUnsavedChanges);
  }, [isUnsavedChanges]);

  useEffect(() => {
    justifyPillsToggle(maxStepper);
  }, [maxStepper]);

  useEffect(() => {
    console.log("Inside base useEffect", base);
    if (base && understanding === null) {
      console.log("Making api call to get data");
      handleReload();
    }
  }, [base, understanding]);

  useEffect(() => {
    saveProjectData({ understanding: understanding });
  }, [understanding]);
  useEffect(() => {
    saveProjectData({ persona: persona });
  }, [persona]);

  useEffect(() => {
    saveProjectData({ feature: features });
  }, [features]);
  useEffect(() => {
    saveProjectData({ competitorAnalysis: competitorAnalysis });
  }, [competitorAnalysis]);
  useEffect(() => {
    saveProjectData({ swotAnalysis: swotAnalysis });
  }, [swotAnalysis]);
  useEffect(() => {
    saveProjectData({ roadmap: roadmap });
  }, [roadmap]);

  let shouldBlock = React.useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      isUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
    [isUnsavedChanges]
  );
  let blocker = useBlocker(shouldBlock);

  const usecaseDictionary: { [key: number]: string } = {
    1: "MLO_PR_UNDERSTANDING",
    2: "MLO_PR_PERSONA",
    3: "MLO_PR_FEATURE_DISCUSSION",
    4: "MLO_PR_COMPETITOR_ANALYSIS",
    5: "MLO_PR_SWOT_ANALYSIS",
    6: "MLO_PR_ROADMAP",
  };
  const generateTextDictionary: { [key: number]: string } = {
    1: "Generate User Persona",
    2: "Generate Feature List",
    3: "Generate Competitor Analysis",
    4: "Generate SWOT Analysis",
    5: "Generate Product Roadmap",
    6: "Done",
  };
  const currentTabText = (): TabCategory => {
    switch (justifyPillsTab) {
      case 1:
        return "understanding";
      case 2:
        return "userPersona";
      case 3:
        return "featuresList";
      case 4:
        return "competitorAnalysis";
      case 5:
        return "swotAnalysis";
      case 6:
        return "roadmap";
      default:
        return "understanding";
    }
  };
  async function handleGeneration() {
    if (justifyPillsTab < 6) setLastTry(justifyPillsTab + 1);
    const payload: BrainstormerRequest = {
      recipe: {
        name: usecaseDictionary[justifyPillsTab + 1],
        recipeSettings: {
          temperature: 0.2,
        },
        userSignature:accounts[0].username
      },
      base: base === undefined ? null : base,
      understanding: understanding === undefined ? null : understanding,
      persona: persona === undefined ? null : persona,
      feature: features === undefined ? null : features,
      swotAnalysis: swotAnalysis === undefined ? null : swotAnalysis,
      competitorAnalysis: null,
      roadmap: roadmap === undefined ? null : roadmap,
    };
    setLoading(true);
    let updateData;
    console.log("payload:", payload);
    try {
      // const response = await axiosInstance.post(PRODUCT_RESEARCH, payload);
      const response = await getBrainStormer(payload);
      if (response.data.status_code !== 200) {
        console.log("There seems to be some error");
        setError(
          new Error(
            "Error " + response.data.response + "\nFailed to generate response"
          )
        );
        setLoading(false);
        return;
      }
      setLoading(false);
      switch (justifyPillsTab) {
        case 1:
          console.log("response in :", response.data.response);
          setPersona(response.data.response);
          updateData = { persona: response.data.response };
          setMaxStepper(2);
          break;
        case 2:
          setMaxStepper(3);
          setFeatures(response.data.response);
          updateData = { feature: response.data.response };
          break;
        case 3:
          setMaxStepper(4);
          setCompetitorAnalysis(response.data.response);
          updateData = { swotAnalysis: response.data.response };
          break;
        case 4:
          setMaxStepper(5);
          setSwotAnalysis(response.data.response);
          updateData = { competitorAnalysis: response.data.response };
          break;
        case 5:
          setMaxStepper(6);
          setRoadmap(response.data.response);
          updateData = { roadmap: response.data.response };
          break;
        default:
          break;
      }
    } catch (error: any) {
      setError(
        new Error("Error " + error.code + "\nFailed to generate response")
      );
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        // Accessing and logging error details from Axios response
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }

    // saveProjectData(updateData)
    setLoading(false);
  }

  async function handleReload() {
    let updateData;
    setError(null);
    console.log('last try:', lastTry)
    const payload: BrainstormerRequest = {
      
      recipe: {
        userSignature:accounts[0].username,
        name: usecaseDictionary[lastTry],
        recipeSettings: {
          temperature: 0.2,
        },
      },
      base: base === undefined ? null : base,
      understanding: understanding === undefined ? null : understanding,
      persona: persona === undefined ? null : persona,
      feature: features === undefined ? null : features,
      swotAnalysis: swotAnalysis === undefined ? null : swotAnalysis,
      competitorAnalysis: competitorAnalysis === undefined ? null : competitorAnalysis,
      roadmap: roadmap === undefined ? null : roadmap,
    };
    console.log("payload:", payload);
    setLoading(true);
    try {
      // const response = await axiosInstance.post(PRODUCT_RESEARCH, payload);
      const response = await reloadBrainStormer(payload);
      if (response.data.status_code !== 200) {
        console.log("There seems to be some error");
        setError(
          new Error(
            "Error " + response.data.response + "\nFailed to generate response"
          )
        );
        setLoading(false);
        return;
      }
      switch (lastTry) {
        case 1:
          setUnderstanding(response.data.response);
          updateData = { understanding: response.data.response };
          setMaxStepper(1);
          break;
        case 2:
          setPersona(response.data.response);
          updateData = { persona: response.data.response };
          setMaxStepper(2);
          break;
        case 3:
          // data.feature = response.data.features
          console.log("In 3")
          setFeatures(response.data.response);
          updateData = { feature: response.data.response };
          setMaxStepper(3);
          break;
        case 4:
          setCompetitorAnalysis(response.data.response);
          updateData = { competitorAnalysis: response.data.response };
          setMaxStepper(4);
          break;
        case 5:
          setSwotAnalysis(response.data.response);
          updateData = { swotAnalysis: response.data.response };
          setMaxStepper(5);
          break;
        case 6:
          setRoadmap(response.data.response);
          updateData = { roadmap: response.data.response };
          setMaxStepper(6);
          break;
        default:
          break;
      }
    } catch (error: any) {
      setError(
        new Error("Error " + error.code + "\nFailed to generate response")
      );
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        // Accessing and logging error details from Axios response
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
    // saveProjectData(updateData)
    setLoading(false);
  }

  async function saveProjectData(updateData: any) {
    if (!projectID) return;
    try {
      const payload: EditPayload = { userSignature : accounts[0].username,id: projectID, updateData: updateData };
      // const response = await axiosInstance.post(
      //   UPDATE_BRAINSTORMER_ENDPOINT,
      //   payload
      // );
      const response  = await updateBrainStormer(payload)
      console.log("updated successfully", response);
    } catch (error: any) {
      // setError(
      //   new Error("Error " + error.code + "\nFailed to generate response")
      // );
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        // Accessing and logging error details from Axios response
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  async function createNewBrainstormer(user: string, base: BaseFragment) {
    try {
      const payload: AddPayload = { userEmail: user, base: base };
      // const response: any = await axiosInstance.post(
      //   ADD_BRAINSTORMER_ENDPOINT,
      //   payload
      // );
      const response :any = await createBrainStormer(payload);
      console.log("create response", response.data);
      setBaseData(base);
      setProjectID(response._id);
    } catch (error: any) {
      // setError(
      //   new Error("Error " + error.code + "\nFailed to generate response")
      // );
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        // Accessing and logging error details from Axios response
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }
  function handleOpenModal() {
    setIsOpen(!isOpen);
  }
  const justifyPillsToggle = (tab: number) => {
    if (justifyPillsTab !== tab) {
      if (maxStepper >= tab) 
      setjustifyPillsTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        {error ? (
          <Error500 reload={handleReload} errorState={setError} />
        ) : (
          <Container fluid>
            <BreadCrumb title="Brainstormer" pageTitle="Product Research" />
            {loading ? (
              ""
            ) : (
              <Button
                toggle={toggle}
                onClick={handleOpenModal}
                className="btn-info rounded-pill shadow-sm btn btn-icon m-3 btn-lg p-2 rounded-pill"
              >
                <i
                  // onClick={toggleSidebar}
                  className="ri-add-fill fs-30"
                  style={{ fontSize: "35px" }}
                ></i>
              </Button>
            )}

            <form className="vertical-navs-step form-steps mt-5">
              <Row className="gy-5">
                <Col lg={2} md={12}>
                  <Nav className="flex-column custom-nav nav-pills">
                    <NavItem>
                      <NavLink
                        href="#"
                        style={{
                          cursor: 1 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 1,
                          done: 1 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(1);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 1
                        </span>
                        Understanding
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: 2 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 2,
                          done: 2 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(2);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 2
                        </span>
                        User Persona
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: 3 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 3,
                          done: 3 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(3);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 3
                        </span>
                        Features List
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: 4 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 4,
                          done: 4 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(4);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 4
                        </span>
                        Competitor Analysis
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: 5 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 5,
                          done: 5 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(5);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 5
                        </span>
                        Swot Analysis
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          cursor: 5 <= maxStepper ? "pointer" : "initial",
                        }}
                        className={classnames({
                          active: justifyPillsTab === 6,
                          done: 6 <= maxStepper && justifyPillsTab >= 1,
                        })}
                        onClick={() => {
                          justifyPillsToggle(6);
                        }}
                      >
                        <span className="step-title me-2">
                          <i className=" ri-checkbox-blank-circle-fill step-icon me-2"></i>
                          Step 6
                        </span>
                        Product Roadmap
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {!loading ? (
                    understanding ? (
                      <Row className="mt-3 w-100">
                        <Col xs={12} className="mt-2">
                          <Button
                            color="primary"
                            className="btn-label w-100"
                            onClick={handleReload}
                            outline
                          >
                            {" "}
                            <i className=" ri-refresh-line label-icon align-middle fs-16 me-2"></i>{" "}
                            Reload{" "}
                          </Button>
                        </Col>
                        <Col xs={12}>
                          {justifyPillsTab < 6 ?
                            <Button
                              color="primary"
                              className="btn-label mt-2 w-100"
                              onClick={handleGeneration}
                              disabled={justifyPillsTab === 6}
                              outline
                            >
                              {" "}
                              <i className=" ri-magic-line label-icon align-middle fs-16 me-2"></i>{" "}
                              {generateTextDictionary[justifyPillsTab]}{" "}
                            </Button> : null
                          }

                        </Col>
                      </Row>
                    ) : null
                  ) : null}
                </Col>
                <Col lg={10} md={12}>
                  {loading ? (
                    <ComingSoon currentTab={currentTabText()} />
                  ) : (
                    <TabContent
                      activeTab={justifyPillsTab}
                      className="text-muted"
                    >
                      <TabPane tabId={1} id="pill-justified-home-1">
                        {understanding ? (
                          <Understanding
                            understanding={understanding}
                            setUnderstanding={setUnderstanding}
                          ></Understanding>
                        ) : (
                          // <Maintenance></Maintenance>
                          null
                        )}
                      </TabPane>

                      <TabPane tabId={2} id="pill-justified-profile-1">
                        <Persona
                          persona={persona}
                          setPersona={setPersona}
                        ></Persona>
                      </TabPane>

                      <TabPane tabId={3} id="pill-justified-messages-1">
                        <Feature
                          features={features}
                          setFeatures={setFeatures}
                        ></Feature>
                      </TabPane>

                      <TabPane tabId={4} id="pill-justified-settings-1">
                        <CompetitorAnalysis
                          competitorData={competitorAnalysis}
                        ></CompetitorAnalysis>
                      </TabPane>
                      <TabPane tabId={5} id="pill-justified-settings-1">
                        <SwotAnalysis
                          swotAnalysis={swotAnalysis}
                          setSwotAnalysis={setSwotAnalysis}
                        ></SwotAnalysis>
                      </TabPane>
                      <TabPane tabId={6} id="pill-justified-settings-1">
                        <Roadmap
                          roadmap={roadmap}
                          setRoadmap={setRoadmap}
                        ></Roadmap>
                      </TabPane>
                    </TabContent>
                  )}
                </Col>
              </Row>
            </form>
          </Container>
        )}
      </div>
      {blocker ? <ConfirmNavigation blocker={blocker} /> : null}
      <RecipeForm isOpen={isOpen} toggle={toggle} />
    </React.Fragment>
  );
};

export default Brainstormer;
