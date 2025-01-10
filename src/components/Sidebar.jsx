import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import ProfilePic from "../images/blank dp.png";
import SvgSymbols from "./SvgSymbols.jsx";
import "../styles/Sidebars.css";
import "../styles/Sidebar_main.css";
import {jwtDecode} from "jwt-decode";
import { useModuleContext } from "./ModuleContext";
import { Modal, Button, Form, Row, Col, Table, Alert } from "react-bootstrap";


const Sidebar = () => {
  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

   const [showWarning, setShowWarning] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(null);
  const [userDetails,setUserDetails] = useState(null);

  const handleSignOut = () => {
    navigate("/logout");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (componentName, submenu) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    if (activeComponent !== componentName && submenu) {
      setActiveComponent(componentName);
    }
  };

  const getModules = () => {
  
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        if (!userId) {
          console.error("User ID not found in token");
          return;
        }
        api
          .get(`/mrp/employees/${userId}/`)
          .then((response) => {
            const results = response.data;
            setAccessPermissions(results.module_permissions);
            setModules(results.modules);
            setUserDetails(results.user.first_name)
          })
          .catch((error) => {
            console.error("Error fetching modules", error);
          });
      } catch (error) {
        console.error("Error decoding token", error);
      }
    
  };

  useEffect(() => {
    getModules();
  }, []);




    const handleShowWarning = () => setShowWarning(true);
  const handleCloseWarning = () => setShowWarning(false);

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
    setError(null); // Clear error message when showing the modal
  };
  const handleCloseChangePassword = () => setShowChangePassword(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post('/mrp/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: {
          'Authorization': `CTGI7a00fn ${localStorage.getItem('ACCESS_TOKEN')}`
        }
      });


      setShowChangePassword(false);
      startCountdown();
    } catch (error) {

      setError(error.response.data.old_password || "Error changing password");
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          handleSignOut();
        }
        return prev - 1;
      });
    }, 1000);
  };
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
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          <Link
            to="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <svg className="bi pe-none me-2" width={40} height={32}>
              <use xlinkHref="#bootstrap" />
            </svg>
            {!isCollapsed && <span className="fs-4"></span>}
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active text-white" : "text-white"
                }`}
              >
                <svg className="bi pe-none me-2" width={16} height={16}>
                  <use xlinkHref="#home" />
                </svg>
                {!isCollapsed && <span>Home</span>}
              </Link>
            </li>
            {modules.map((module) => (
              <li className="nav-item" key={module.id}>
                {module.submodules && module.submodules.length > 0 ? (
                  <>
                    <Link
                      to="#"
                      className={`nav-link ${
                        location.pathname.startsWith(`/module/${module.slug}`)
                          ? "active text-white"
                          : "text-white"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target={`#${module.slug}-collapse`}
                      aria-expanded="false"
                      onClick={() => handleMenuClick(module.slug)}
                    >
                      <svg className="bi pe-none me-2" width={16} height={16}>
                        <use xlinkHref={module.icon} />
                      </svg>
                      {!isCollapsed && <span>{module.module}</span>}
                    </Link>
                    <div className="collapse" id={`${module.slug}-collapse`}>
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        {module.submodules.map((submodule) => (
                          <li key={submodule.id}>
                            <Link
                              to={`/${module.slug}/${submodule.slug}`}
                              className={`nav-link ${
                                location.pathname ===
                                `/module/${module.slug}/${submodule.slug}`
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleMenuClick(submodule.slug, "submenu")
                              }
                            >
                              {!isCollapsed && (
                                <span>{submodule.submodule}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    className={`nav-link ${
                      location.pathname === `/${module.path}`
                        ? "active text-white"
                        : "text-white"
                    }`}
                    to={module.path === "home" ? "/" : `/${module.path}`}
                  >
                    <svg className="bi pe-none me-2" width={16} height={16}>
                      <use xlinkHref={module.icon} />
                    </svg>
                    {!isCollapsed && <span>{module.module}</span>}
                  </Link>
                )}
              </li>
            ))}
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
              {!isCollapsed && <strong>{userDetails}</strong>}
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              <li>
                <button className="dropdown-item" onClick={handleShowWarning}>
                Change Password
              </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
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
          <Outlet />
        </div>
      </main>


      {/* Warning Modal */}
      <Modal show={showWarning} onHide={handleCloseWarning}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Changing your password will log you out. Do you wish to continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarning}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => { handleCloseWarning(); handleShowChangePassword(); }}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Change Password Modal */}
      <Modal show={showChangePassword} onHide={handleCloseChangePassword}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3" controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Countdown Modal */}
      {countdown < 5 && (
        <Modal show={true} onHide={() => {}}>
          <Modal.Header>
            <Modal.Title>Logging Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your password has been changed successfully. You will be logged out in {countdown} seconds.
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
