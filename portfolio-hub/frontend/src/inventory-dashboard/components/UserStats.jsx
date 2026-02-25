import { useEffect, useState, useMemo } from 'react'
import fetchWithAuth from '../helpers/Authorization'
import { useAuth } from '../context/AuthContext'
import "../css/UserStats.css"

const UserStats = ({registerUser, dbFiles}) => {
    const {accessToken, setAccessToken, URL} = useAuth();
    
    const tabs = [
        {id: 1, name: "Total", icon: "svg-dash/users.svg", bgColor: "#cca763"}, 
        {id: 2, name: "Most Orders", icon: "svg-dash/stock-arrow.svg", bgColor: "#e08c5b"}, 
    ];

    const [userCount, setUserCount] = useState(0)
    const [userProfile, setUserProfile] = useState([])


    const filteredFiles = useMemo(() => {
        if(!Array.isArray(userProfile) || userProfile.length === 0) return []
        if(!Array.isArray(dbFiles) || dbFiles.length === 0) return []
        
        //filter
        const filteredResults = dbFiles.reduce((groups, purchase) => {
            const user = purchase.createdBy;
            if(!groups[user]) {
                groups[user] = []
            }

            groups[user].push(purchase)
            return groups
        }, {})


        const topUser = Object.entries(filteredResults).reduce((best, [name, purchases]) => {
            const count = purchases.length;
            if(!best || count > best.count) {
                return {name: name, count: count}
            }

            return best
        }, null)

        return topUser
        // return height [name, count of ]
    }, [dbFiles, userCount, userProfile])


    useEffect(() => {
        let isMounted = true

        const usersDb = async () => {
             try {
                const allPromise = await Promise.all([
                    fetchWithAuth({
                        URL: URL,
                        endpoint: "user-count",
                        accessToken: accessToken,
                        setAccessToken: setAccessToken,
                        options: {
                            method: "GET",
                            credentials: "include"
                        }
                    }),
                    fetchWithAuth({
                        URL: URL,
                        endpoint: "user-profile",
                        accessToken: accessToken,
                        setAccessToken: setAccessToken,
                        options: {
                            method: "GET",
                            credentials: "include"
                        }
                    })

                ])
                    const userCountResult = allPromise[0]
                    const userProfileResult = allPromise[1]
                    const userCountJson = await userCountResult.json().catch(() => null)
                    const userProfileJson = await userProfileResult.json().catch(() => null)


                    if(!userCountResult.ok) {
                        console.error("Issue with fetching the user count: ". userCountJson);
                        return
                    }
                    if(!userProfileResult.ok) {
                        console.error("Issue with fetching the user profile: ". userProfileJson);
                        return
                    }

                    setUserCount(userCountJson);
                    setUserProfile(userProfileJson.json)
            }
            catch (error) {
                console.error("User Stats Fetch Error: ", error.message);
                return;
            } 

        } 
        
        usersDb();
        return () => {
            isMounted = false
        }
    }, [registerUser])

  return (
    <div className='user-mr-container'>
        <div className="user-inner-mrc">
            <div className="umr-h-c">
                <div className="umr-h">
                    <h5>User Statistics</h5>
                </div>
            </div>
            <div className="border-width"></div>
            <div className="user-header-tabs">
                {tabs.map(tab => {
                    const firstName = tab.name.split(" ")[0]

                    return (
                        <div className={`user-tab ${firstName}`} 
                            key={tab.id}    
                        >
                            <div className="user-tab-img" style={{backgroundColor: tab.bgColor}}>
                                <img src={tab.icon} alt={tab.name} />
                            </div>
                            <div className="user-name-total">
                                <div className="user-tab-name">
                                    <p>{tab.name} {firstName === "Total" ? "Users" : ""}</p>
                                </div>
                                <div className="user-tab-total">
                                    <p>{firstName === "Total" ? userCount.count : filteredFiles.name}</p>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
            <div className="border-width ps-bw"></div>
            <div className="user-stats-container">
                <div className="us-header">
                    <h4>User Stats</h4>
                </div>
            
                <table className='users-table'>
                    <thead className='uth'>
                        <tr className='utr'>
                            <td className='utr-name'>Name</td>
                            <td className='utr-order'>Orders</td>
                        </tr>
                    </thead>
                    <tbody className='utb'>
                        <tr className='utbr'>
                            <td>{filteredFiles.name}</td>
                            <td>{filteredFiles.count}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  )
}

export default UserStats
