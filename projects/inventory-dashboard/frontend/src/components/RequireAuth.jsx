import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireAuth = ({children}) => {
    const { status } = useAuth();
    if(status === "loading") return <div>Loading...</div>
    if(status === "unauthed") return <Navigate to='/login' replace/>
    return children
}

export default RequireAuth
