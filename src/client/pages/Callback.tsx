import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";

export default function Callback() {
  const called = React.useRef(false);

  const loggedIn = useAuthStore((state) => state.loggedIn);
  const checkLoginState = useAuthStore((state) => state.checkLoginState);

  const navigate = useNavigate();
  React.useEffect(() => {
    (async () => {
      if (loggedIn === false) {
        try {
          if (called.current) return; // prevent rerender caused by StrictMode
          called.current = true;
          const res = await axios.get(`/auth/token${window.location.search}`);
          checkLoginState();
          navigate("/");
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      } else if (loggedIn === true) {
        navigate("/");
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
}
