import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from "../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import Header from '../components/Header'
import '../styles/ContainerDetails.css'
import Information from '../components/Information'
import Container from '../components/Container'
import Requirements from '../components/Requirements'
import MoreInfo from '../components/MoreInfo'
import ContainerMovement from '../components/ContainerMovement'
import {jwtDecode} from "jwt-decode";
import ContainerInfo from '../components/ContainerInfo';
import { useUser } from '../components/UserContext';




const ContainerDetails = () => {
    const {containerId} = useParams();
    const { user,setUser } = useUser();
    const token = localStorage.getItem(ACCESS_TOKEN);
    useEffect(() => {
        getUser();
    console.log();
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

    return (
      <div>
      <div className="container-fluid">
          <div className="container">
          <Header />
          <div className="details">
              <div className="row">
                  <div className="col-lg-9 col-md-8 col-sm-12">
                      <div className="row px-3">
                          <div className="col-12 detail">
                              <Information containerId={containerId}/>
                          </div>
                      </div>
                      <div className="row px-3">
                          <div className="col-12 detail">
                              <Container/>
                          </div>
                      </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-12">
                      <div className="row px-3">
                          <div className="col-12 detail">
                              <Requirements/>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row info-container px-3">
                <ContainerInfo/>
                  {/* <div className="col-12 detail">
                      <MoreInfo/>
                  </div> */}
              </div>
              {/* <div className="row movement-container px-3">
                  <div className="col">
                      <div className="row">
                          <div className="col-12 detail" id='movement-container'>
                              <ContainerMovement/>
                          </div>
                      </div>
                  </div>
              </div> */}
          </div>
          </div>
      </div>
      </div>
    )
  }
  
  export default ContainerDetails