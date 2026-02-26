import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const children = props.children;
    const [accessToken, setAccessToken] = useState("");
    const [status, setStatus] = useState('loading'); // loading | authed | unauthed
    const [currentUser, setCurrentUser] = useState({userId: "", username: "", role: ""});
    const URL = import.meta.env.PROD ? "https://fullstack-portfolio-1-41oq.onrender.com" : "http://localhost:5500";
    
    const setUserFromAccessToken = (accessToken) => {
        const payload = decodePayload(accessToken);

        setCurrentUser({
            userId: payload.userId,
            username: payload.username,
            role: payload.role
        });
    }


    let ranOnce = useRef(false);
    useEffect(() => {
        if(ranOnce.current) return;
        ranOnce.current = true;
        let isMounted = true

        const bootstrap = async () => {
            try {
                const res = await fetch(URL + "/refresh", {
                method: 'GET',
                credentials: "include"
                });
                
                const json = await res.json().catch(() => null);

                if (res.status === 401) {
                    if (isMounted) {
                        setAccessToken("");
                        setStatus("unauthed");
                    }
                return;
                }

                if(!res.ok || !json || !json.accessToken) {
                    if(isMounted){
                        setAccessToken("");
                        setStatus("unauthed");
                    }
                    console.error('Refreshing Issue (AuthContext): ', json);
                    return;
                }

                if(isMounted) {
                    setAccessToken(json.accessToken);
                    setUserFromAccessToken(json.accessToken)
                    setStatus("authed");
                }

                
            } catch (error) {
                if(isMounted) {
                    setAccessToken("");
                    setStatus("unauthed")
                }
                console.error(error.message)
                return
            }
        }

        bootstrap();

        return () => {
            isMounted = false
            ranOnce.current = false
        }
    }, [URL]);

    const value = useMemo(() => {
        
        return {
            accessToken: accessToken,
            setAccessToken: setAccessToken,
            status: status,
            setStatus: setStatus,
            URL:URL,
            currentUser: currentUser,
            setCurrentUser: setCurrentUser
        }
        
    }, [accessToken, status]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) {
        throw new Error("useAuth must be used inside AuthProvider.")
    }

    return ctx
}