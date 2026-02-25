import { Link, useNavigate, useLocation } from "react-router-dom"
import '../css/loginPage.css'
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef } from "react"

const Login = ({username, password, setUsername, setPassword, handleLogin, setCurrentUser, darkTheme }) => {
    const navigate = useNavigate()
    const { accessToken, setStatus } = useAuth()

    const location = useLocation();


  const navigatedOnce = useRef(false); // CHANGED

  useEffect(function () {
    // CHANGED: only redirect if we are on the login page and haven't redirected yet
    if (!accessToken) {
      navigatedOnce.current = false;
      return;
    }

    if (location.pathname !== "/inventory/login") {
      return;
    }

    if (navigatedOnce.current) {
      return;
    }


    if (accessToken && location.pathname === "/inventory/login" && !navigatedOnce.current) {
      navigatedOnce.current = true;
      setStatus('authed')
      
      setTimeout(() => {
        navigate("/inventory/home", { replace: true });

      }, 800)

    }
}, [accessToken, location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentUser(username)
    
    const ok = await handleLogin(e)
    
    
    if(ok) {
      setTimeout(() => {
        setUsername('');
        setPassword('');
      }, 800)
    }
  }

  return (
    <div className="login-container">
        <div className={`${darkTheme ? "card" : "card-light"}`}>
            <h1>Login</h1>

            <form className="login" onSubmit={handleSubmit} method="post" autoComplete="on" action="/home">
                <label htmlFor="username" className="label">Username</label>
                <input 
                    type="text" 
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    autoComplete="username"
                    required
                    autoFocus
                 />
                <label htmlFor="password" className="label">Password</label>
                <input 
                    type="password"
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    id="password" 
                    autoComplete="current-password"
                    required    
                />
                <button 
                    type="submit"
                    className="login-button"
                >Login</button>
            </form>
        </div>
      <p>New? <Link to='/inventory/register'>Register Here</Link></p>
    </div>
  )
}

export default Login