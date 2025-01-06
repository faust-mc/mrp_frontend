import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
//import '../styles/Header.css';
import profile from '../images/default_pic.png';
import headerLogo from '../images/ctgi-logo.jpg';
import useDarkMode from '../hooks/useDarkMode'; // Adjust path as needed
import api from "../api";
import { useUser } from '../components/UserContext';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'

function Header() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isDarkMode, toggleDarkMode] = useDarkMode(); // Use custom hook
const token = localStorage.getItem(ACCESS_TOKEN);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle modal visibility for Change Password
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(null);
  const { user,setUser } = useUser();

useEffect(() => {
    getUser();
  }, []);


  const getUser = () => {

    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      api.get('ect/get-user/', config)
        .then(response => {

          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching protected resource', error);
        });
    } else {
      console.error('No access token found');
    }
  };


  const handleSignOut = () => {
    navigate('/logout');
  };

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
      setError("Passwords did not match!");
      return;
    }

    try {
      const response = await api.post('/ect/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
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

  // Toggle dropdown open state
  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  return (
    <div>
      <nav className="navbar fixed-top">
        
        <div className="logo-container mx-3">
          <Link to="/"><img src={headerLogo} height="40px" /></Link>
        </div>

          <div className="dropdown" data-bs-auto-close="outside">
            <button
              className="btn text-white dropdown-toggle"
              type="button"
              id="profileDropdown"
              aria-expanded={dropdownOpen}
              onClick={toggleDropdown}

            >
              <img src={profile} className="mx-2" width="30px" alt="" />
              <span className="text-white">{user?user.first_name : ""}</span>
            </button>
            <ul
              className={`dropdown-menu${dropdownOpen ? ' show' : ''}`}
              aria-labelledby="profileDropdown"
            >
              {/* Dark Mode Toggle */}
              <li className="dropdown-item" id="theme">
                <div className="d-flex">
                  <div>
                    <span>Theme</span>
                  </div>
                  <div className="mx-auto">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="checkbox"
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                    />
                    <label htmlFor="checkbox" className="checkbox-label">
                      <i className="fa-solid fa-moon" />
                      <i className="fa-solid fa-sun" />
                      <span className="ball" />
                    </label>
                  </div>
                </div>
              </li>

              {/* Change Password - Triggers Modal */}
              <li className="dropdown-item" onClick={handleShowWarning}>
                Change Password
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              {/* Sign Out - Navigates to Login */}
              <li>
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </ul>
        </div>

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
      </nav>

      {/* Modal for Changing Password */}

    </div>
  );
}

export default Header;
