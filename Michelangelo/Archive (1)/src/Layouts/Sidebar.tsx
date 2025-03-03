import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import mikeLogo from "../assets/images/mikeLogo.png";

//Import Components
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";
import TwoColumnLayout from "./TwoColumnLayout";
import VerticalLayout from "./VerticalLayouts";

const Sidebar = ({ layoutType }: any) => {
  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("");
      });
    }
  });

  return (
    <React.Fragment>
      <div className="app-menu navbar-menu" style={{ backgroundColor: "" }}>
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={mikeLogo} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={mikeLogo} alt="" height="17" />
            </span>
          </Link>

          {/* <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={mikeLogo} alt="" height="25" />
            </span>
            <span
              style={{ fontSize: "25px", color: "white", lineHeight:
                "1.2",
               }}
            >
              <span style={{display: "block",margin: "20px 0 0px 0"}}>A.AVA+</span>
              <span style={{margin: "0 0 20px 0"}}>MICHELANGELO</span>
            </span>
          </Link> */}
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={mikeLogo} alt="" height="25" />
            </span>

            <span
              className="logo-lg "
              style={{ fontSize: "x-large", color: "white" }}
            >
              <p
                style={{
                  height: "20px",
                  marginBottom: "10px",
                  fontSize: "1.125rem",
                }}
              >
                A.AVA+
              </p>
              Michelangelo
            </span>
          </Link>
          {/* <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button> */}
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === "twocolumn" ? (
          <React.Fragment>
            <TwoColumnLayout layoutType={layoutType} />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid style={{ paddingTop: 10 }}>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout
                  //  layoutType={layoutType}
                  />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
