import LoginForm from '../components/LoginForm'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import {Navigate} from "react-router-dom";
import { useState, useEffect } from 'react';
import '../styles/Login.css'

function Login() {


    const func_autht = async () => {



    if (token) {
       return <Navigate to='/' />;

        }
        }

    return (
        <div className="login-page-main">
            <LoginForm route='/mrp/mrp_api/token/' />
        </div>
    )
}

export default Login