import { Link, useNavigate } from "react-router-dom"
import '../css/registerPage.css'
const Register = ({registerUser, registerPass, setRegisterUser, setRegisterPass, handleRegister}) => {
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        const ok = await handleRegister(e);
        setTimeout(() => {
            if(ok) navigate('inventory/login', {replace: true})

        }, 800);
    }

  return (
    <div className="register-container">
        <div className="card-light">
            <h1>Register</h1>
            <form className="register" onSubmit={handleSubmit} method="post" autoComplete="on" action="/login">
                <label htmlFor="username" className="label">Username</label>
                <input 
                    type="text" 
                    id='username'
                    name="username"
                    value={registerUser}
                    onChange={(e) => setRegisterUser(e.target.value)}
                    autoComplete="username"
                    required
                    autoFocus
                />
                <label htmlFor="password" className="label">Password</label>
                <input 
                    type="password"
                    name="password" 
                    value={registerPass}
                    onChange={(e) => setRegisterPass(e.target.value)} 
                    id="password" 
                    autoComplete="new-password"
                    required    
                    />
                <button 
                    type="submit"
                    className="register-button"
                >Submit</button>
            </form>
        </div>
        <p>Have an account? <Link to='/inventory/login'>Login here.</Link></p>
    </div>
  )
}

export default Register

