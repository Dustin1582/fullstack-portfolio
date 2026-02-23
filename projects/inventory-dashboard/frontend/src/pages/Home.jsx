import SideBar from '../components/SideBar'
import HeaderInside from '../components/HeaderInside'
import ViewInventory from './ViewInventory'
import Purchase from './Purchase'
import Reporting from './Reporting'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import '../css/Home.css'
import Support from './Support'
import fetchWithAuth from '../helpers/Authorization'
import Credits from '../pages/Credits'
import Admin from './Admin'


const Home = ({currentUser, registerUser, darkTheme}) => {
  
  const { accessToken, setAccessToken, URL } = useAuth();
  
  //create inventory items states
  const [active, setActive] = useState("Inventory");
  const [confirmedOrder, setConfirmedOrder] = useState(0);
  const [confirmIssue, setConfirmIssue] = useState(0);
  
  // orders
  const [order, setOrder] = useState([])
  const [totalOrders, setTotalOrders] = useState(null);
  const [dbFiles, setDbFiles] = useState([]);

  const [fullProfile, setFullProfile] = useState([])
  
  useEffect(() => {
    const controller = new AbortController()

    try {
      
      const load = async () => {
        const res = await fetchWithAuth({
          URL: URL,
          endpoint: 'user-profile',
          accessToken: accessToken,
          setAccessToken: setAccessToken,
          options: {
            method: "GET",
            credentials: "include"
          }
        });

        const json = await res.json().catch(() => null);

        if(!res.ok) {
          console.error("Home Get Profile Failed with: ", json);
          return;
        }

        setFullProfile(json.json)
      }
      
      load();
      
      return () => {
        controller.abort()
      }
    } catch (error) {
      console.error("Home Server Error: ", error.message);
      return;
    }
    
    
    
  }, [])
  
// ---------------------------- Content Pages -----------------------------------

  const content = (active) => {
    switch(active) {
      case "Inventory":
        return <ViewInventory confirmedOrder={confirmedOrder} dbFiles={dbFiles} setDbFiles={setDbFiles} />
      case "Purchase":
        return <Purchase 
          currentUser={currentUser} 
          setConfirmedOrder={setConfirmedOrder}
          order={order}
          setOrder={setOrder}
          darkTheme={darkTheme}
         />
      case "Reporting":
        return <Reporting 
            confirmedOrder={confirmedOrder} 
            setTotalOrders={setTotalOrders} 
            registerUser={registerUser}
            dbFiles={dbFiles}    
          />
        case "Support":
          return <Support currentUser={currentUser} setConfirmIssue={setConfirmIssue}/>
        case "Credits":
          return <Credits />
        case "Admin":
          return <Admin setConfirmIssue={setConfirmIssue} confirmIssue={confirmIssue}/>
      default:
        return ///fix later
    }
  }

// -------------------------------------------------------------------------------

  return (
    <main className='home-main'>
      <div className="sidebar">
        <SideBar currentUser={currentUser} active={active} setActive={setActive} darkTheme={darkTheme} fullProfile={fullProfile}/>
      </div>
      <div className="home-content">
        {content(active)}

      </div>
    </main>
  )
}

export default Home
