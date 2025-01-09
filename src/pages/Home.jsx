import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Logo from '../components/Logo'

import {jwtDecode} from "jwt-decode";



const Home = () => {
const [searchResultState, setSearchResultState] = useState([]);
const [searchField, setSearchField] = useState('');
const token = localStorage.getItem(ACCESS_TOKEN);



useEffect(() => {
   
  }, []);




      return (
       <>
        {/*<Sidebar/>*/}
       </>



  );
};

export default Home;


