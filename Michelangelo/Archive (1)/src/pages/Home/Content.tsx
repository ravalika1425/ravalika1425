import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import RecipeForm from "pages/RecipeForm/RecipeForm";
import { axiosInstance } from "Mike/utils/axiosConfig";
import { GET_BRAINSTORMER_ENDPOINT } from "Mike/constants";
import {  ProjectsResponse } from "Mike/models/playResponse";

// Images
import image07 from "../../../src/assets/images/products/image7.png";
import image7 from "../../../src/assets/images/products/generate.jpeg";
import img14 from "../../../src/assets/images/products/img1.jpeg";
import img15 from "../../../src/assets/images/products/img2.jpeg";
import img10 from "../../../src/assets/images/products/img3.jpeg";
import img11 from "../../../src/assets/images/products/img4.jpeg";
import img6 from "../../../src/assets/images/products/img7.jpeg";
import image10 from "../../../src/assets/images/products/new.jpeg";
import image14 from "../../../src/assets/images/products/website.jpeg";
import { getBrainStormerData } from "services/brainStormerServices";




// JSON data
const newIdeas = [
  {
    status: "New",
    image: image10,
    title: "Brainstorm an idea",
    link: undefined
  },
  {
    status: "New",
    image: image14,
    title: "Generate UI design",
    nav: "/generate_wireframe",
    link: undefined
  },
  {
    status: "New",
    image: image7,
    title: "Image to App",
    nav: "/image_to_app",
    link: undefined
  },

  {
    status: "New",
    image: image07,
    title: "Design Analysis",
    nav: "/design_analyser",
    link: undefined
  }
  // {
  //   status: "Coming Soon",
  //   image: image2,
  //   title: "AI DESIGN",
  //   // link: 'https://angelo.avateam.io/'
  // },
];

const imagePool = [img15, img10, img14, img11, img6];

interface HomeProps {
  heading: string;
  textFieldPlaceholder: string;
  generateButtonText: string;
}

const Content: React.FC<HomeProps> = ({
  heading,
  textFieldPlaceholder,
  generateButtonText
}) => {

  document.title = "Ascendion AVA - MichelAngelo";

  const { accounts } = useMsal();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<ProjectsResponse>({
    brainstormerProjects: []
  });
  const toggle = () => setIsOpen(!isOpen);

  function handleCardClick(link?: string, href?: string) {
    if (link) {
      window.location.href = link;
    } else if (href) {
      navigate(href);
    } else {
      setIsOpen(true);
    }
  }

  function handleProjectClick(card: any) {
    navigate("/brainstormer", { state: card });
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-sidebar-size", "sm");
  }, []);

  useEffect(() => {
    const fetchBrainstormerProjects = async () => {
      try {
        const response = await getBrainStormerData({
          userEmail: accounts[0].username
        });
        if (response.status === 200) {
          setProjectData({ brainstormerProjects: response.data });
        }
      } catch (error) {
        console.error("Error fetching brainstormer projects:", error);
      }
    };

    fetchBrainstormerProjects();
  }, [accounts]);

  // useEffect(() => {
  //   axiosInstance
  //   .get(GET_BRAINSTORMER_ENDPOINT, { params:{
  //     userEmail: accounts[0].username 
  //   }})
  //   .then((response) => {
  //     if (response.status === 200) {
  //       setProjectData({brainstormerProjects: response.data});
  //     }
  //   });
  //   // const fetchBrainstormerProjects = async () => {
  //   //   try {
  //   //     const response = await getBrainStormerProject({
  //   //       userEmail: accounts[0].username
  //   //     });
  //   //     if (response.status === 200) {
  //   //       setProjectData({ brainstormerProjects: response.data });
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error fetching brainstormer projects:", error);
  //   //   } 
  //   // };
  //   // fetchBrainstormerProjects();// const fetchBrainstormerProjects = async () => {
  //   //   try {
  //   //     const response = await getBrainStormerProject({
  //   //       userEmail: accounts[0].username
  //   //     });
  //   //     if (response.status === 200) {
  //   //       setProjectData({ brainstormerProjects: response.data });
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error fetching brainstormer projects:", error);
  //   //   }
  //   // };
  //   // fetchBrainstormerProjects();
  // }, [accounts]);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="cards-container-wrapper">
            <div className="cards-container">
              <h5 className="head" style={{ textAlign: "left" }}>
                Let's craft something new today !
              </h5>
              <Row>
                {newIdeas.map((card, index) => (
                  <Col sm={2} xl={2} key={index} style={{ minWidth: "200px" }}>
                    <Card
                      className="ribbon-box explore-box card-animate"
                      onClick={() => handleCardClick(card.link, card.nav)}
                      style={{ cursor: card.link ? "pointer" : "default" }}
                    >
                      <div className={`ribbon ribbon-primary ribbon-shape`}>
                        {card.status}
                      </div>
                      <img
                        className="card-img-top img-fluid"
                        src={card.image}
                        alt="Card cap"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{card.title}</h5>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              {projectData.brainstormerProjects.length !== 0 ? (
                <Row className="recent">
                  <h5 className="head" style={{ textAlign: "left" }}>
                    Recent creations
                  </h5>
                  {projectData.brainstormerProjects
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((card, index) => (
                      <Col
                        sm={2}
                        xl={2}
                        key={index}
                        onClick={() => handleProjectClick(card)}
                        style={{ minWidth: "200px" }}
                      >
                        <Card className="explore-box card-animate">
                          <div className="position-relative">
                            <img
                              className="card-img img-fluid"
                              src={imagePool[index % imagePool.length]}
                              alt="Card cap"
                            />
                          </div>
                          <div className="card-body">
                            <h4 className="card-title1 mb-2">
                              {card.base.name}
                            </h4>
                            <h6 className="card-title2 ">Brainstormer</h6>
                            <p className="card-title3 ">
                              {card.roadmap ? "Done" : "In Progress"}
                            </p>
                          </div>
                        </Card>
                      </Col>
                    ))}
                </Row>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <RecipeForm isOpen={isOpen} toggle={toggle} />
    </React.Fragment>
  );
};

export default Content;
