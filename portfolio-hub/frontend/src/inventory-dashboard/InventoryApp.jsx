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
    const [isLoading, setIsLoading] = useState(false); 
    const [isOpen, setIsOpen] = useState(false)
    //register state
    const [registerUser, setRegisterUser] = useState('')
    const [registerPass, setRegisterPass] = useState('')
    const [regData, setRegData] = useState(null)


  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
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
    } finally {
        setIsLoading(false);
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
          isLoading={isLoading}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          />
        }>
        </Route>

        <Route path="register" element={
          <Register registerUser={registerUser} 
          registerPass={registerPass} 
          setRegisterUser={setRegisterUser} 
          setRegisterPass={setRegisterPass} 
          handleRegister={handleRegister} 
          />
        }>
        </Route>
        
        <Route path="home" element={<RequireAuth>
          <Home registerUser={registerUser} />
        </RequireAuth>} />
        
        {/* ✅ optional fallback */}
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </div>

    </>
  )
}

export default InventoryApp
