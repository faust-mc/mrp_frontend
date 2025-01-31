import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
//import '../styles/Logo.css'
import WallemLogo from '../../images/wallem_no_bg.png';
const Logo = () => {

  return (
    <div>
      <div className="logo-ctgi">
        <img src={WallemLogo}
          className="logo-img"
          alt="logo"/>
      </div>
      <div className="brand">
          <h1 className="brand">Welcome to CTGI MRP</h1>
        </div>
    </div>
  );
};

export default Logo;


