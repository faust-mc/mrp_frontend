import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from "../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants'
import Header from '../components/Header'
//import '../styles/ContainerDetails.css'





import {jwtDecode} from "jwt-decode";




const ContainerDetails = () => {
    const {containerId} = useParams();
    const token = localStorage.getItem(ACCESS_TOKEN);
    const [BL, setBL] = useState(null);
    const [lastMove, setLastMove] = useState(null)

    useEffect(() => {
        getDetails();
      }, []);

  const getDetails = () => {
    if (token) {

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };

      api.get(`ect/get-bl/${containerId}/`, config)
        .then(response => {

            setBL(response.data);

        })
        .catch(error => {
          console.error('Error fetching protected resource', error);
        });
    } else {
      console.error('No access token found');
    }
  }

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
                             
                          </div>
                      </div>
                      <div className="row px-3">
                          <div className="col-12 detail">
                             
                          </div>
                      </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-12">
                      <div className="row px-3">
                          <div className="col-12 detail">
                             
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row info-container px-3">
                
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