import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import Header from '../components/HeaderComponents/Header'
import Sidebar from '../components/SidebarComponents/Sidebar'
import Logo from '../components/HeaderComponents/Logo'

import {jwtDecode} from "jwt-decode";

import { OverlayTrigger, Popover, Badge } from 'react-bootstrap';

function Home() {


  return (
        <>
            <Header/>
            <p>Lorem Ipsum</p>
        </>
  );
}

export default Home;