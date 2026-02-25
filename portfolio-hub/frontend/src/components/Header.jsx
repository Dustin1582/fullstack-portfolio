import '../css/Header.css'
import { Link } from 'react-router-dom'


const Header = () => {

  return (
    <header className='header'>
      <h2>Dustin Routh</h2>
      <h2>Web-Dev Portfolio</h2>
      <nav className='header-nav'>
        <Link className="resume" to={"/resume"}>
          <p>Resume</p>
        </Link>
        <div className="github">
          <a href='https://github.com/Dustin1582/fullstack-portfolio'>GitHub</a>
        </div>
        <div className="linkedin">
          <a href='https://www.linkedin.com/in/dustin-routh-64246a110/'>LinkedIn</a>
        </div>
      </nav>
    </header>
  )
}

export default Header
