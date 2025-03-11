import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants'

//import Sidebar from './components/SidebarComponents/Sidebar'
//import Logo from '../components/HeaderComponents/Logo'

import {jwtDecode} from "jwt-decode";

import { OverlayTrigger, Popover, Badge } from 'react-bootstrap';

function Header() {
  const [notifications] = useState([
    'New notification #1',
    'New notification #2',
    'New notification #3'
  ]);

  const [notifCount, setNotifCount] = useState(5);
   const [showBadge, setShowBadge] = useState(true);

  const handleBellClick = () => {
    setNotifCount(0); // Reset the notification count to 0 when bell is clicked
     setShowBadge(false);
  };

  const notificationCount = notifications.length; // Count the notifications

  // Popover content
  const popover = (
    <Popover id="popover-notifications">
      <Popover.Header as="h3">Notifications</Popover.Header>
      <Popover.Body>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="header-container d-flex justify-content-between align-items-center">
      <h1 className="mx-auto">CTGI MRP System</h1>

      {/* Bell Icon with Popover and Badge for Notification Count */}
{/*       <OverlayTrigger */}
{/*         trigger="click" */}
{/*         placement="bottom-end" */}
{/*         overlay={popover} */}
{/*       > */}
{/*         <div style={{ position: 'relative', cursor: 'pointer' }}> */}
{/*           <svg */}
{/*             xmlns="http://www.w3.org/2000/svg" */}
{/*             width="16" */}
{/*             height="16" */}
{/*             fill="currentColor" */}
{/*             className="bi bi-bell" */}
{/*             viewBox="0 0 16 16" */}
{/*           > */}
{/*             <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/> */}
{/*           </svg> */}

{/*           */}{/* Conditionally render the badge */}
{/*           {showBadge && notifCount > 0 && ( */}
{/*             <span className="badge bg-danger" style={{ position: 'absolute', top: '-5px', right: '-5px' }} onClick = {handleBellClick}> */}
{/*               {notifCount} */}
{/*             </span> */}
{/*           )} */}
{/*         </div> */}
{/*       </OverlayTrigger> */}
    </div>
  );
}

export default Header;