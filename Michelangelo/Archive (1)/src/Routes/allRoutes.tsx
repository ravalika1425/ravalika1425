import { Navigate } from "react-router-dom";

//Dashboard
import Brainstormer from "../pages/Brainstormer";
import Home from "pages/Home";
import GenerateWireFrame from "pages/ProductDesign/GenerateWireFrame";
import FormData from "pages/DataForm";
//pages
import Starter from '../pages/Pages/Starter/Starter';
//login
import Logout from "../pages/Authentication/Logout";
//Job pages
// import JobGrid from "../pages/Jobs/JobList/Grid";
// User Profile
import CompetitorAnalysis from "pages/ProductResearch/CompetitorAnalysis";
import GenerateProposal from "pages/ProductResearch/GenerateProposal";
import GenerateArchitectureDiagram from "pages/ProductResearch/GenerateArchitectureDiagram";
import MyIdeas from "pages/ProductResearch";
import ImageTOApp from "pages/ImageToCode";
// import LoginForm from "pages/ImageToCode/checkREact";
import DesignAnalyser from "pages/DesignAnalyser/DesignAnalyser";
import DesignAnalysisResults from "pages/DesignAnalyser/results";

const publicRoutes = [

  { path: "/brainstormer", component: <Brainstormer /> },
  { path: "/", component: <Home /> },
  { path: "/image_to_app", component: <ImageTOApp /> },
  { path: "/competitoranalysis", component: <CompetitorAnalysis /> },
  { path: "/generateproposal", component: <GenerateProposal />},
  { path: "/generateproposal", component: <GenerateProposal />},
  { path: "/generate_architecture_diagram", component: <GenerateArchitectureDiagram />},
  { path: "/generateproposal", component: <GenerateProposal />},
  { path: "/my_ideas", component: <MyIdeas /> },
  // { path: "/showcase", component: <LoginForm /> },
  { path: "/generate_wireframe", component: <GenerateWireFrame />},
  { path: "/pages-starter", component: <Starter /> },
  // { path: "/apps-job-grid-lists", component: <JobGrid /> },
  { path: "/design_analyser", component: <DesignAnalyser /> },
  { path: "/design_analyser/results", component: <DesignAnalysisResults /> },
  { path: "/admin/embeddings", component: <FormData/> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/home" />,
  },
  { path: "*", component: <Navigate to="/home" /> },
  // Authentication Page
  { path: "/logout", component: <Logout /> },

];

export { publicRoutes };