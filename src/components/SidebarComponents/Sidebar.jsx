import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import ProfilePic from "../../images/blank dp.png";
import SvgSymbols from "../HeaderComponents/SvgSymbols.jsx";
import "../../styles/Sidebars.css";
import "../../styles/Sidebar_main.css";
import { jwtDecode } from "jwt-decode";
import { useModuleContext } from "../ControlComponents/ModuleContext.jsx";
import { Modal, Button, Form, Alert, Dropdown } from "react-bootstrap";

const Sidebar = () => {
  const { modules, setModules, accessPermissions, setAccessPermissions } = useModuleContext();
  const token = localStorage.getItem(ACCESS_TOKEN);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(null);


  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSignOut = () => {
    navigate("/logout");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (moduleSlug) => {

    const findModule = (modules, moduleSlug) => {
      for (const module of modules) {
        if (module.slug === moduleSlug) {
          if (module.submodules && module.submodules.length > 0) {
            setIsCollapsed(false);
            setActiveComponent(moduleSlug);
          } else {
            navigate(`/${module.path}/`);
          }
          return true;
        }
        if (module.submodules && module.submodules.length > 0) {
          const found = findModule(module.submodules, moduleSlug);
          if (found) return true; //stop if found
        }
      }
      return false;
    };

    const found = findModule(modules, moduleSlug);
    if (!found) {
      console.log("Module not found.");
    }
  };

  const toggleSubmenu = (moduleSlug, submenuSlug) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [`${moduleSlug}-${submenuSlug}`]: !prev[`${moduleSlug}-${submenuSlug}`],
    }));
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

          setAccessPermissions(results.employee_details.module_permissions

);
          setModules(results.accessible_modules);
          setUserDetails(results.first_name); // Save user first name here
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

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
    setError(null); // Clear error message when showing the modal
  };

  const handleCloseChangePassword = () => setShowChangePassword(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(["Passwords do not match!"]);
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
      setError(error.response.data.new_password || "Error changing password");
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
          className={`d-flex flex-column flex-shrink-0 p-3 text-bg-dark sidebar ${isCollapsed ? "collapsed" : ""}`}
          style={{
            width: isCollapsed ? "80px" : "240px",
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
            {!isCollapsed && <span className="fs-4">TGI</span>}
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            {modules.map((module) => (
              <li className="nav-item" key={module.id}>
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

                {/* Submodules */}
                {module.submodules && module.submodules.length > 0 && (
                  <div className="collapse" id={`${module.slug}-collapse`}>
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                      {module.submodules.map((submodule) => (
                        <li key={submodule.id}>
                          <Link
                            to="#"
                            className={`nav-link ${
                              location.pathname === `/masterdata/${submodule.slug}/`
                                ? "active"
                                : ""
                            }`}
                            data-bs-toggle="collapse"
                            data-bs-target={`#${submodule.slug}-collapse`}
                            onClick={() => {
                              handleMenuClick(submodule.slug);
                              toggleSubmenu(module.slug, submodule.slug); // Toggle submenu
                            }}
                          >
                            {!isCollapsed && <span>{submodule.module}</span>}
                          </Link>

                          {/* Nested Modules */}
                          {submodule.submodules && submodule.submodules.length > 0 && (
                            <div
                              className={`collapse ${openSubmenus[`${module.slug}-${submodule.slug}`] ? "show" : ""}`}
                              id={`${module.slug}-${submodule.slug}-collapse`}
                            >
                              <ul className="nested-toggle-nav list-unstyled ms-3">
                                {submodule.submodules.map((nested) => (
                                  <li key={nested.id}>
                                    <Link
                                      to={`/${module.slug}/${submodule.slug}/${nested.slug}`}
                                      className={`nav-link ${
                                        location.pathname ===
                                        `/module/${module.slug}/${submodule.slug}/${nested.slug}`
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      {!isCollapsed && <span>{nested.module}</span>}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <hr />
          <div className="d-flex align-items-center">
            <div className="dropdown me-3">
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
                  <button className="dropdown-item" onClick={handleShowChangePassword}>
                    Change Password
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>

            <Dropdown size="sm" className="mini-dropdown ms-auto">
              <Dropdown.Toggle variant="secondary" id="dropdown-mini">
                Access Key
              </Dropdown.Toggle>

              <Dropdown.Menu className="mini-dropdown-menu">
                {accessKey.length > 0 ? (
                  accessKey.map((item) => (
                    <Dropdown.Item key={item.id} href={`#/${item.id}`}>
                      {item.access_key}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No access keys available</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
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

      {/* Change Password Modal */}
      <Modal show={showChangePassword} onHide={handleCloseChangePassword}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">
              {typeof error[Symbol.iterator] === 'function' ? (
                error.map((errMsg, index) => (
                  <div key={index}>{errMsg}</div>
                ))
              ) : (
                <div>{error}</div>
              )}
            </Alert>
          )}
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
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Sidebar;
