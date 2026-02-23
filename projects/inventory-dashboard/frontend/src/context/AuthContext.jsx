import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const children = props.children;
    const [accessToken, setAccessToken] = useState("");
    const [status, setStatus] = useState('loading'); // loading | authed | unauthed
    const URL = "http://localhost:5500"
    useEffect(() => {
        let isMounted = true
        const bootstrap = async () => {
            try {
                const res = await fetch("http://localhost:5500/refresh", {
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
        }
    }, []);

    const value = useMemo(() => {
        
        return {
            accessToken: accessToken,
            setAccessToken: setAccessToken,
            status: status,
            setStatus: setStatus,
            URL:URL
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