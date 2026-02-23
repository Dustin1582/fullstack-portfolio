import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthHandler = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const { setAccessToken, setStatus } = useAuth(); // ✅ use context, not props

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkRefresh = async function () {
      try {
        setStatus("loading"); // ✅ replaces setOk(null)

        const response = await fetch("http://localhost:5500/refresh", {
          method: "GET",
          credentials: "include",
        });

        const json = await response.json().catch(() => null);

        if (!response.ok || !json || !json.accessToken) {
          setAccessToken("");
          setStatus("unauthed");
          navigate("/login", { replace: true });
          return;
        }

        setAccessToken(json.accessToken);
        setStatus("authed");
        navigate("/home", { replace: true });
      } catch (error) {
        setAccessToken("");
        setStatus("unauthed");
        navigate("/login", { replace: true });
      }
    };

    checkRefresh();
  }, [navigate, setAccessToken, setStatus]);

  return <div>Loading...</div>;
};

export default AuthHandler;
