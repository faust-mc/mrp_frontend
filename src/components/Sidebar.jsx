import React, { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from '../constants';
import "bootstrap/dist/css/bootstrap.min.css";
import SvgSymbols from "./SvgSymbols.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfilePic from "../images/blank dp.png";
import UserComponent from "./UserComponent.jsx"; // Import your DataTable component
import "../styles/Sidebars.css";
import "../styles/Sidebar_main.css";

const Sidebar = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [modules, setModules] = useState([]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };


const getModules = () => {
    if (token) {
      const config = {
        headers: { Authorization: `CTGI7a00fn ${token}` },
        withCredentials: true,
      };

      api.get('/mrp/modules/',config)
        .then(response => {
          const results = response;
          setModules(results.data);
        })
        .catch(error => {
          console.error('Error fetching tickets', error);
        });
    } else {
      console.error('No access token found');
    }
  };

  const handleMenuClick = (componentName, submenu) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Expand the sidebar if collapsed
    }
    if (activeComponent !== componentName && submenu) {
      
      
      setActiveComponent(componentName); // Handle specific component logic
    }
    
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    const handleCollapse = () => {
      if (isCollapsed) {
        // Close all collapsible menus when the sidebar is collapsed
        document.querySelectorAll(".collapse").forEach((menu) => {
          menu.classList.remove("show");
        });
      }
    };

    // Initial checks
    //handleResize();
    handleCollapse();
    getModules();

    // Add event listener for resizing
    // window.addEventListener("resize", handleResize);

    // // Clean up event listener on unmount
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, [isCollapsed]);

  return (
    <>
      <SvgSymbols />
      <main className="d-flex flex-nowrap">
        <div
          className={`d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar ${
            isCollapsed ? "collapsed" : ""
          }`}
          style={{
            width: isCollapsed ? "80px" : "280px",
            transition: "width 0.3s",
            overflowY: "auto", // Enables scrolling
            maxHeight: "100vh", // Restricts height to the viewport
          }}
        >
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <svg className="bi pe-none me-2" width={40} height={32}>
              <use xlinkHref="#bootstrap" />
            </svg>
            {!isCollapsed && <span className="fs-4">CTGI</span>}
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">


           {
            modules.map((module) => (
                <li className="nav-item" key={module.id}>
                  <a
                    href="#"


                    className={`nav-link ${activeComponent === module.slug ? "active text-white" : "text-white"}`}
                    {...(module.submodules.length > 0
                      ? {
                          "data-bs-toggle": "collapse",
                          "data-bs-target": `#${module.slug}-collapse`,
                          onClick: () => handleMenuClick(module.slug),
                        }
                      : {
                          onClick: () => handleMenuClick(module.slug, "submenu"),
                        })}>
                    <svg className="bi pe-none me-2" width={16} height={16}>
                      <use xlinkHref={module.icon} />
                    </svg>
                  {!isCollapsed && <span className="module-text">{module.module}</span>}
                  </a>

                     {module.submodules.length > 0 && (
                    <div className="collapse" id={`${module.slug}-collapse`}>
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        {module.submodules.map((submodule) => (
                          <li key={submodule.id}>
                            <a
                              href="#"
                              className={`nav-link ${activeComponent === submodule.slug ? "active" : ""}`}
                              onClick={() => handleMenuClick(submodule.slug, "submenu")}
                            >
                              {submodule.submodule}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            }
          </ul>
          <hr />
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={ProfilePic}
                alt=""
                width={32}
                height={32}
                className="rounded-circle me-2"
              />
              {!isCollapsed && <strong>Fausto</strong>}
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              
              <li>
                <a className="dropdown-item" href="#">
                  Change Password
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="b-example-divider b-example-vr">
          <button
            className="btn btn-outline-light btn-sm mb-3 toggle-btn collapse_button"
            onClick={toggleSidebar}
          >
            {isCollapsed ? ">>" : "<<"}
          </button>
        </div>
        <div className="main_component flex-grow-1">
          {/* Render the active component */}
          {activeComponent === "home" && <div>Home Component</div>}
          {activeComponent === "user" && <UserComponent />}
        </div>
      </main>
    </>
  );
};

export default Sidebar;
