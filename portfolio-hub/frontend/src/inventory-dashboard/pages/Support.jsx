import { useEffect, useRef, useState } from 'react'
import { profanity } from '../data/data';
import { issueTypes } from '../data/data';
import fetchWithAuth from '../helpers/Authorization';
import { useAuth } from '../context/AuthContext';
import '../css/Support.css'

const Support = ({currentUser, setConfirmIssue}) => {
    const [active, setIsActive] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('Select An Issue');
    const [email, setEmail] = useState('')
    const [issue, setIssue] = useState('')
    const [err, setErr] = useState('');
    const [errType, setErrType] = useState(null)
    const [success, setSuccess] = useState(false);
    const  [isLoading, setIsLoading] = useState(false);
    const dd_ref = useRef();
    const { accessToken, setAccessToken, URL } = useAuth()

    const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const isValidEmail = (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    };

    const containsProfanity = (issueText, profanityList) => {
        return profanityList.some((badWord) => {
            const pattern = new RegExp(`\\b${escapeRegex(badWord)}\\b`, "i");
            return pattern.test(issueText);
        });
    };
    
    useEffect(() => {
        if(!active) return;
        const handleOutsideClick = (event) => {
            const container = dd_ref.current;
            if(!container) return;

            const insideClick = container.contains(event.target)
            if(!insideClick) setIsActive(false)
        }

        window.addEventListener("click", handleOutsideClick)

        return () => {
            window.removeEventListener("click", handleOutsideClick)
        }
    }, [active]);


    const handleClick = async () => {
        if(err) return;

        
        if(dropdownValue === "Select An Issue") {
            setErr('Must Select an option');
            setErrType("dropdown")
            return;
        }
        
        if(email === "") {
            setErr('Must include a email');
            setErrType("email")
            return;
        }
        if(!isValidEmail)
        
        if(issue === "") {
            setErrType("issue")
            setErr('Must include an issue');
            return;
        }
        
        const badWords = containsProfanity(issue, profanity)
        
        if(badWords) {
            setErr("please remove profanity then resubmit");
            setErrType("profanity")
            return;
        }

        try {
            const res = await fetchWithAuth({
                URL:URL,
                accessToken:accessToken,
                setAccessToken: setAccessToken,
                endpoint: "issue-input",
                options: {
                    method:"POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: currentUser.username,
                        email: email,
                        issueType: dropdownValue,
                        issue: issue
                    })
                }
            });

            const json = await res.json().catch(() => null);

            if(!res.ok) {
                console.error("Support Issues with fetch. Fetch failed to send. \nError: ", json);
                return;
            }
            setIsLoading(true);
            setConfirmIssue((prev) => prev + 1)

            setTimeout(() => {
                setEmail("")
                setIssue('')
                setDropdownValue('Select An Issue');
                setSuccess(false);
                setIsLoading(false)
            }, 2000);

            setSuccess(true);
        } catch (error) {
            console.error("Support Error: ", error.message);
            return
        }
    }

  return (
    <div className='main-support-container'>
        <div className='form'>
            <div className="report-header-container">
                <h4>Create a ticket</h4>
            </div>
            <div className="main-form">
                <div className="m-dd-c" ref={dd_ref}>
                    <div className="dd-top"
                        onClick={() => setIsActive(!active)}
                    >
                        <p>{dropdownValue}</p>
                        <img className={`arrow ${active ? "up" : ""}`}  src={`${import.meta.env.BASE_URL}/arrows/down-arrow.svg`} alt="dropdown arrow" /> 
                                
                    </div>
                    {err && errType === "dropdown" && <p style={{color: "red", margin:"0 0 0 1rem"}}>{err}</p>}
                    {active && 
                        <div className="dd-bottom" >
                            {active && issueTypes.map((issue) => (
                                <p 
                                    key={issue} 
                                    onClick={() => {
                                        setDropdownValue(issue)
                                        setIsActive(false)
                                        setErr('')
                                    }}
                                    className='issue-value'
                                >
                                    {issue}
                                </p>
                            ))}
                            
                        </div>
                    }

                </div>

                <div className="email">
                    <input type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setErr(() => {
                                const checkEmail = isValidEmail(e.target.value);
                                return !checkEmail ? "Enter a valid email." : ""
                            })
                            setErrType(() => {
                                const checkEmail = isValidEmail(e.target.value);
                                return !checkEmail ? "email" : ""
                            })
                        }}
                    />
                    {err && errType === "email" && <p style={{color: "red", margin:"0 0 0 1rem"}}>{err}</p>}
                </div>

                <div className="response-container">
                    <label htmlFor="response">Type a brief message:</label>
                    <textarea 
                        id="response" 
                        cols="70" 
                        rows="20"
                        value={issue}
                        onChange={(e) => {
                            setIssue(e.target.value)
                            setErr(() => {
                                const hasProfanity = containsProfanity(e.target.value, profanity)
                                return hasProfanity ? 'please remove profanity' : ''
                            })
                            setErrType(() => {
                                const hasProfanity = containsProfanity(e.target.value, profanity)
                                return hasProfanity ? "issue" : ""
                            })   
                        }}
                    ></textarea>
                    {err && errType === "issue" && <p style={{color: "red", margin:"0 0 0 1rem"}}>{err}</p>}
                    {err && errType === "profanity" && <p style={{color: "red", margin:"0 0 0 1rem"}}>{err}</p>}
                </div>

                <div className="support-button-container">
                    <div 
                        className="button"
                        onClick={handleClick}
                    >
                        <p>Submit Issue</p>
                    </div>
                </div>

            </div>

            <p className={`success ${success ? "active" : ""} `}>Successfully Submitted</p>
            {isLoading && <div className='loading'></div>}

        </div>
      
    </div>
  )
}

export default Support
