import axios from 'axios';
import {ACCESS_TOKEN} from './constants';


//const apiURL = 'http://122.49.215.244:8000/';
const apiURL = '';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiURL
});


api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `CTGI7a00fn ${token}`;
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default api