import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import fetchWithAuth from "../helpers/Authorization"
import "../css/Sidebar.css"

const SideBar = ({currentUser, active, setActive, fullProfile}) => {
    const { accessToken, setAccessToken, URL, setStatus } = useAuth()
    const navigate = useNavigate();
    
    const navOptionsBlack = [
        {label: "Inventory", icons: `${import.meta.env.BASE_URL}/svg-home/inventory-black.svg`},
        {label: "Purchase", icons: `${import.meta.env.BASE_URL}/svg-home/cart-black.svg`}, 
        {label: "Reporting", icons: `${import.meta.env.BASE_URL}/svg-home/reporting-black.svg`}, 
        {label: "Support", icons: `${import.meta.env.BASE_URL}/svg-home/support-black.svg`},
        {label: "Credits", icons: `${import.meta.env.BASE_URL}/svg-home/medal-black.svg`},
    ]
    const navOptionsWhite = [
        {label: "Inventory", icons: `${import.meta.env.BASE_URL}/svg-home/inventory-white.svg`},
        {label: "Purchase", icons: `${import.meta.env.BASE_URL}/svg-home/cart-white.svg`}, 
        {label: "Reporting", icons: `${import.meta.env.BASE_URL}/svg-home/reporting-white.svg`}, 
        {label: "Support", icons: `${import.meta.env.BASE_URL}/svg-home/support-white.svg`},
        {label: "Credits", icons: `${import.meta.env.BASE_URL}/svg-home/medal-white.svg`},
    ]
    
    const logout = async () => {
        try {
            const res = await fetchWithAuth({
                URL:URL,
                endpoint: "logout",
                accessToken: accessToken,
                setAccessToken: setAccessToken,
                options: {
                    method: "POST",
                    credentials:"include"
                }
            });

            if(!res.ok) {
                console.error("Log out issue occured");
                return;
            }

        } catch (error) {
            console.error("Sidebar (Logout) Error: ", error.message);
            return;
        }
    }

    const handleLogoutClick = async () => {
        try {
            setStatus("unauthed");
            setAccessToken(""); // important, clear local auth
            await logout();     // wait for server cookie clear
        } finally {
            navigate("login", { replace: true });
        }
    };

    let firstInit = ""
    
    if(currentUser && currentUser.username){
        firstInit = currentUser.username.slice(0, 1).toUpperCase()

    }

    return (
        <div className='sidebar-container'>
            <div className="top-c">
                <div className="profile-pic">
                    <div className='outter-circle-dark'>
                        <div className="inner-circle">
                            <h1>{firstInit}</h1>
                        </div>
                    </div>
                </div>
                <nav>
                    {navOptionsBlack.map((item) => (
                            <div className={`button-container ${active === item.label ? "active" : "" }`} 
                                key={item.label}
                                onClick={() => setActive(item.label)}
                            >
                                <span className={`inner-button-container ${active === item.label ? "inner-active" : "" }`}>
                                    <img src={item.icons} alt={item.label} className='svg'/>
                                    <p className='label'>{item.label}</p>
                                </span>
                            </div>
                        ))
                    }

                    {fullProfile.map(user => {
                        if(user.role !== "admin") return
                        return (
                            <div key={user._id} className={`button-container ${active === "Admin" ? "active" : "" }`}
                                onClick={() => setActive('Admin')}
                            >
                                <span className={`${active === "Admin" ? "inner-active" : "" } inner-button-container`}>
                                    <img src={`${import.meta.env.BASE_URL}/svg-home/admin-black.svg`} className="svg"></img>
                                    <p className="label" style={{color: "black"}}>Admin Panel</p>
                                </span>
                            </div>
                        )
                    })}
                </nav>
            </div>
            <div className="logout">
                <p className="light"
                    onClick={() => handleLogoutClick()}
                >
                    Logout
                </p>
            </div>

        </div>
    )
}

export default SideBar
