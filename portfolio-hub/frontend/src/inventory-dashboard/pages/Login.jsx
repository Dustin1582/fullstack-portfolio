import { Link, useNavigate, useLocation } from "react-router-dom"
import '../css/loginPage.css'
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"

const Login = ({username, password, setUsername, setPassword, handleLogin, setCurrentUser}) => {
  const location = useLocation();
  const shouldAnimateOpen = Boolean(location.state && location.state.animateOpen);
  const navigate = useNavigate()
  const { accessToken, setStatus } = useAuth()

  const [isOpen, setIsOpen] = useState(false)



  const navigatedOnce = useRef(false); 

  useEffect(() => {
    if(!shouldAnimateOpen) return;

    requestAnimationFrame(() => {
      setIsOpen(true);
    })
  }, [shouldAnimateOpen])


  useEffect(function () {
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
    <div className={`login-open-shell ${shouldAnimateOpen && isOpen ? "open" : ""}`}>
      <div className="login-container">
          <div className="card-light">
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
        <p className="login-link reg" style={{color: "white"}}>New? <Link to='/inventory/register'>Register Here</Link></p>
        <p className="login-link hub"><Link to='/'>Return to hub.</Link></p>
      </div>

    </div>
  )
}

export default Login