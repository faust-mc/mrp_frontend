import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import '../../styles/Login.css';
import ctgiLogo from '../../images/ctgi-logo.jpg';

function LoginForm({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            localStorage.clear();
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Invalid credentials, please try again.");
                setAttempt(prev => prev + 1);
            } else if (error.response.status===400) {
                toast.error(error.response.data.error);
            }  else if (error.response.status===404) {
                toast.error(error.response.data.error);
            } else if (error.response.status===403) {
                toast.error(error.response.data.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container login-container">
            <div className="col-lg-5 col-md-8 col-sm-12 mx-auto">
                <div className="login-form text-center">
                    <img src={ctgiLogo} width="70%" className="mb-3 logo" alt="Logo" />
                    <form onSubmit={handleSubmit}>
                        <h1 className="py-3">Materials Requirement Planning</h1>

                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-control"
                                id="username"
                                placeholder="Username"
                            />
                            <label htmlFor="floatingInput">Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                id="password"
                                placeholder="Password"
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        
                        <button type="submit" className="btn-navy w-100" value="Login">LOGIN</button>
                        
                    </form>
                </div>
            </div>

            {/* Toast Container for showing notifications */}
            <ToastContainer />
        </div>
    );
}

export default LoginForm;
