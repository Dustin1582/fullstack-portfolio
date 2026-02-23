import React from 'react'
import '../css/Header.css'
import { useAuth } from '../context/AuthContext'
const Header = () => {
  const { status } = useAuth();
  return (
    <header className='header'>
      <h2>{status === "authed" ? "Inventory Dashboard" : "Inventory Managenment System"}</h2>
    </header>
  )
}

export default Header
