import { Link, useNavigate, useLocation } from "react-router-dom"
import '../css/loginPage.css'
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react"

const Login = ({username, password, setUsername, setPassword, handleLogin, isLoading, setIsOpen, isOpen}) => {
  const location = useLocation();
  const shouldAnimateOpen = Boolean(location.state && location.state.animateOpen);
  const navigate = useNavigate()
  const { accessToken, setStatus } = useAuth()
  const navigatedOnce = useRef(false); 

  const [showPassword, setShowPassword] = useState(false)


  useEffect(() => {
    if(!shouldAnimateOpen){
      setIsOpen(true);
      return
    };

    setIsOpen(false);
    requestAnimationFrame(() => {
      setIsOpen(true);
    });

  }, [shouldAnimateOpen, isOpen])


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
    
    const ok = await handleLogin(e)
    
    
    if(ok) {
      setTimeout(() => {
        setUsername('');
        setPassword('');
        setIsOpen(false)
        
      }, 800)
    }
  }

    const shellClassName = [
    "login-open-shell",
    shouldAnimateOpen ? "" : "open no-animate", 
    shouldAnimateOpen && isOpen ? "open" : "", //
    ].filter(Boolean)
      .join(" ");

  return (
    <div className={shellClassName}>
      <div className="login-container">
        <div className={`progress-indecator ${isLoading ? "loading" : ""}`} ></div>
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
                  <div className="password-button">
                    <input 
                        type={`${showPassword ? "text" : "password"}`}
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        id="password" 
                        autoComplete="current-password"
                        required    
                    />
                    
                    <div className="pwd-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img src={`${showPassword ? `${import.meta.env.BASE_URL}/pass/hide.svg` : `${import.meta.env.BASE_URL}/pass/show.svg` }`} alt="toggle password" />
                    </div>
                    
                  </div>
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