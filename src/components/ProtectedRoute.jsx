import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';

import {useState, useEffect} from 'react';



function ProtectedRoute({children}){
	const [isAuthorized, setIsAuthorized] = useState(null);


	useEffect(()=>{
		func_autht().catch(()=>setIsAuthorized(false))
	},[])


	const refreshToken = async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);
		// console.log(refreshToken);
		try {
			const res = await api.post('/ect_api/token/refresh/', {
				refresh: refreshToken,
			});
			if (res.status === 200){
				// console.log("ress");
				// console.log(res);

				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				setIsAuthorized(true);

			}
			else {
                setIsAuthorized(false)
            }
		}catch(error){
			console.log(error);
			setIsAuthorized(false);

		}
	}



	const func_autht = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);

// 		console.log("new tokens>>>>");
// 		console.log(jwtDecode(token));

		if (!token) {
			setIsAuthorized(false);
			return;
		}
		const decoded = jwtDecode(token);

		const tokenExpiration = decoded.exp;
		const now = Date.now() / 1000;


		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			setIsAuthorized(true);
		}
	};

	if (isAuthorized === null) {
		return <div>Loading...</div>
	}

	return isAuthorized ? children : <Navigate to='/login' />
}

export default ProtectedRoute;