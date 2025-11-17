import { useEffect, useState, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash, FaUser, FaLock } from "react-icons/fa6";
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Axios } from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';
import { jwtDecode } from "jwt-decode";
import logo from "../assets/images/vtsa.png"
import './../Login.css'

const Login = () => {
    const setAuthUser = useStoreActions((actions) => actions.setUser)
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const userRef = useRef(null);

    // Form states
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errors, setErrors] = useState({ user: false, pwd: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const validateForm = () => {
        const newErrors = {
            user: user.trim() === '',
            pwd: pwd.trim() === ''
        };
        setErrors(newErrors);
        return !newErrors.user && !newErrors.pwd;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill in all required fields', {
                position: 'top-center',
                autoClose: 3000
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await Axios.post("/api/auth",
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (result.status === 200) {
                const token = jwtDecode(result.data.accessToken);
                const { username, roles, id, fullName } = token.UserInfo;
                
                // Store session data
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("roles", roles);
                sessionStorage.setItem("id", id);
                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("token", result.data.accessToken);
                sessionStorage.setItem("fullName", fullName);
                
                setAuthUser({ username: user, roles: result.data.roles });
                
                toast.success('Login successful!', {
                    position: 'top-center',
                    autoClose: 2000
                });
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Invalid username or password', {
                position: 'top-center',
                autoClose: 4000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (field === 'user') {
            setUser(value);
            if (errors.user) {
                setErrors(prev => ({ ...prev, user: false }));
            }
        } else {
            setPwd(value);
            if (errors.pwd) {
                setErrors(prev => ({ ...prev, pwd: false }));
            }
        }
    };

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-card">
                {/* Header Section */}
                <div className="login-header">
                    <div className="logo-container">
                        <img src={logo} alt="VTSA Logo" className="logo" />
                    </div>
                    <h1>VTSA Monitor</h1>
                    <p>Welcome back! Please sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Username Field */}
                    <div className={`form-group ${errors.user ? 'error' : ''}`}>
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                value={user}
                                onChange={(e) => handleInputChange('user', e.target.value)}
                                placeholder="Enter your username"
                                className="form-input"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.user && (
                            <span className="error-message">
                                <HiMiniExclamationCircle /> Username is required
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className={`form-group ${errors.pwd ? 'error' : ''}`}>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={pwd}
                                onChange={(e) => handleInputChange('pwd', e.target.value)}
                                placeholder="Enter your password"
                                className="form-input"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {errors.pwd && (
                            <span className="error-message">
                                <HiMiniExclamationCircle /> Password is required
                            </span>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={`login-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner"></div>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="login-footer">
                    <p>Don't have an account? <a href="/contact">Contact administrator</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;