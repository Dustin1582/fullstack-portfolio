import { useEffect, useState } from "react"
import fetchWithAuth from "../helpers/Authorization"
import { useAuth } from "../context/AuthContext"

import '../css/Issue.css'
const Admin = ({confirmIssue, setConfirmIssue}) => {
  
    const { accessToken, setAccessToken, URL } = useAuth();

    const [issueReport, setIssueReport] = useState([]);

    const handleDelete = async (id) => {
        let isClicked = true;
        try {
            if(isClicked) {
                const res = await fetchWithAuth({
                    URL:URL,
                    endpoint: `issue-delete/${id}`,
                    accessToken: accessToken,
                    setAccessToken: setAccessToken,
                    options: {
                        method: "DELETE",
                        credentials: "include"
                    }
                });
                
                const json = await res.json().catch(() => null);
    
                if(!res.ok) {
                    console.error("Failed to delete issues: ", json);
                    return
                }

            }
        
        } catch (error) {
            console.error("Failed to delete issue: ", error.message)
            return
        } finally {
            isClicked = false;
        }
    }
    
    // load ticket reports
    useEffect(() => {
        const controller = new AbortController()

        const load = async () => {
            try {
                
                const res = await fetchWithAuth({
                    URL:URL,
                    endpoint: "issue-report",
                    accessToken: accessToken,
                    setAccessToken: setAccessToken,
                    options: {
                        method: "GET",
                        credentials: "include"
                    }
                });

                const json = await res.json().catch(() => null);

                if(!res.ok) {
                    console.error("Failed to retrieve issues: ", json);
                    return
                }

                setIssueReport(json);
    
            } catch (error) {
                console.error("**: ", error.message);
                return
            }
            
        }  

        load();
        
        return () => {
            controller.abort()
        }

    }, [confirmIssue])

    return (
    <div className="main-aip">
        {issueReport.map(issue => {
            return (
                <div className="aip-c" key={issue._id}>
                    <div className="title-aip">
                        <h3>{issue.issueType}</h3>
                    </div>
                    <div className="user-aip ic">
                        <h5>Name: {issue.username}</h5>
                    </div>
                    <div className="email-aip ic">
                        <p>Email: {issue.email}</p>
                    </div>
                    <div className="issue-aip">
                        <p className="ic">Issue:</p>
                        <div className="issue-box">
                            <p>{issue.issue}</p>
                        </div>
                    </div>

                    <div className="button-aipc"
                        onClick={async () =>{ 
                            await handleDelete(issue._id);
                            setConfirmIssue((prev) => prev - 1)
                        }}
                    >
                        <div className="button-aip">
                            <p>Delete</p>
                        </div>
                    </div>
                    <div className="border-width"></div>
                </div>

            )
        })}
    </div>
  )
}

export default Admin
