import { Navigate, Route, Routes } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register";
import AuthHandler from "./components/AuthHandler";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./context/AuthContext";
import './css/InventoryApp.css'



function InventoryApp() {
  const { setAccessToken } = useAuth();
  const URL = import.meta.env.PROD ? "https://fullstack-portfolio-1-41oq.onrender.com" : "http://localhost:5500";
  


  // login in state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState({userId: "", username: "", role: ""});
  //register state
  const [registerUser, setRegisterUser] = useState('')
  const [registerPass, setRegisterPass] = useState('')
  const [regData, setRegData] = useState(null)

  const darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const ranOnce = useRef(false);

    const decodePayload = (token) => {
      const payloadPart = token.split(".")[1];

      // JWT is base64url, not plain base64
      const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const payloadJson = atob(base64);

      return JSON.parse(payloadJson);
    }
  
  function setUserFromAccessToken(accessToken) {
    const payload = decodePayload(accessToken);

    setCurrentUser({
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    });
  }

  async function tryRefreshLogin() {
  try {
    const res = await fetch(URL + "/refresh", {
      method: "GET",
      credentials: "include",
    });

    const contentType = res.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    if (!res.ok) {
      console.error("no credentials found:", res.status, data);
      return false;
    }

    setAccessToken(data.accessToken);
    setUserFromAccessToken(data.accessToken);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

  useEffect(() => {
  if (ranOnce.current) {
    return;
  }
  ranOnce.current = true;

  tryRefreshLogin();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${URL}/auth`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({username: username, password: password})
      });
      const json = await response.json()
      
      if(!response.ok) {
        console.error(`Login Failed: ${json}`);
        return false;
      }
      
      setAccessToken(json.accessToken)
      setUserFromAccessToken(json.accessToken)


      return true
    } catch (error) {
      console.error(error.message)
      return false
    }
  }




  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username: registerUser, password: registerPass})
      });

      const json = await response.json()
      if(!response.ok) {
        console.error(`Failed to register: ${json}`)
        return false
      }
      setRegData(json)
      return true

    } catch (error) {
      console.error(error.message)
      return false
    }
  }

  return (
    <>

    <div className="content">
      <Routes>
        <Route index element={<AuthHandler />} />
        <Route path="login" element={<Login 
          username={username} 
          password={password} 
          setUsername={setUsername} 
          setPassword={setPassword} 
          handleLogin={handleLogin} 
          setCurrentUser={setCurrentUser}
          darkTheme={darkTheme}
          />
        }>
        </Route>

        <Route path="register" element={
          <Register registerUser={registerUser} 
          registerPass={registerPass} 
          setRegisterUser={setRegisterUser} 
          setRegisterPass={setRegisterPass} 
          handleRegister={handleRegister} 
          darkTheme={darkTheme}

          />
        }>
        </Route>
        
        <Route path="home" element={<RequireAuth>
          <Home currentUser={currentUser} registerUser={registerUser} darkTheme={darkTheme}/>
        </RequireAuth>} />
        
        {/* ✅ optional fallback */}
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </div>

    </>
  )
}

export default InventoryApp
