import { useEffect, useState, useRef } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import './../Login.css'
import useToggle from '../hooks/useToggle';
import { HiMiniExclamationCircle } from "react-icons/hi2";
import { ToastContainer, toast } from 'react-toastify'
import {Axios} from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const setAuthUser = useStoreActions((actions) => actions.setUser)
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useToggle();
    const userRef = useRef(null);

    //Username
    const [user, setUser] = useState('');
    const [userMissing, setUserMissing] = useState(false);
    
    //Password
    const [pwd, setPwd] = useState('')
    const [pwdMissing, setPwdMissing] = useState(false);

    //Verification

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        // if (user === '') setUserMissing(true)
        // if (pwd === '') setPwdMissing(true)
        setUserMissing(user === '' ? true : false)
        setPwdMissing(pwd === '' ? true : false)
        console.log('useEffect is fired')
    }, [user, pwd])

    const missingMsg = ({ closeToast }) => (
        <div>
            You must provide both username and password
            <button onClick={closeToast}>Close</button>
        </div>
    );
    const wrongCredentials = ({closeToast }) => (
        <div>
            Incorrect username or password
            <button onClick={closeToast}>Close</button>
        </div>
    )
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(userMissing)
        console.log(pwdMissing)
        if (userMissing || pwdMissing) {
            console.log('firing')
            toast(missingMsg, {position: 'top-center'})
            return
        } 
            try{
              console.log('firing')
                const result = await Axios.post("/auth",
                    JSON.stringify({ user, pwd }),
                    {
                        headers: { 'Content-Type': 'application/json'},
                        withCredentials: true,
                    }
                    )
                console.log('hi')
                if(result.status === 200){
                  const token = jwtDecode(result.data.accessToken)
                  console.log(token)
                  const { username, roles, id } = token.UserInfo
                  sessionStorage.setItem("username", username)
                  sessionStorage.setItem("roles", roles)
                  sessionStorage.setItem("id", id)
                  sessionStorage.setItem("isLoggedIn", true)
                  sessionStorage.setItem("token", result.data.accessToken)
                  //setIsLoggedIn(true)
                  console.log(roles)
                  setAuthUser({username: user, roles: result.data.roles})
                  navigate('/dashboard')
                }
            } catch (err) {
              toast(wrongCredentials, {position: 'top-center'})
                console.log(err)
            }
        
    }

    

    return (
        <div className="login-container">
      <ToastContainer />
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please enter your credentials to login</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${userMissing ? 'error' : ''}`}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
            />
            {userMissing && (
              <span className="error-message">
                <HiMiniExclamationCircle /> Username is required
              </span>
            )}
          </div>

          <div className={`form-group ${pwdMissing ? 'error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'password' : 'text'}
                id="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {pwdMissing && (
              <span className="error-message">
                <HiMiniExclamationCircle /> Password is required
              </span>
            )}
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>
      </div>
    </div>

  )
}

export default Login