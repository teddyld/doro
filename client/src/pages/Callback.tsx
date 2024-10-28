import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { toast } from "sonner";

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
          await axios.get(`/auth/token${window.location.search}`);
          checkLoginState();
          navigate("/");
        } catch (err) {
          toast.error("An error occurred. Please try again later.");
          navigate("/");
        }
      } else if (loggedIn === true) {
        navigate("/");
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
}
