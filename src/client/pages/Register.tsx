import React from "react";
import axios from "axios";
import { Link } from "@nextui-org/react";
import { useAuthStore } from "../store";

import DoroHero from "../components/login/DoroHero";
import LoginForm from "../components/login/LoginForm";
import GoogleLogin from "../components/login/GoogleLogin";

import { useNavigate } from "react-router-dom";

export default function Register() {
  const [submitError, setSubmitError] = React.useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const navigate = useNavigate();

  const handleRegister = async (email: string, password: string) => {
    try {
      const { loggedIn, name, token } = await axios
        .post("/user/register", { email, password })
        .then((res) => res.data);

      setUser({
        name,
        token,
      });
      setLoggedIn(loggedIn);
      navigate("/");
    } catch (err) {
      setSubmitError(err as string);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground p-8">
        <DoroHero />
        <h2 className="mb-4 self-center text-2xl">Register</h2>
        <LoginForm onSubmit={handleRegister} submitError={submitError} />
        <p>
          Already have an account?{" "}
          <Link
            className="cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </Link>
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="flex-1 border-t-1" />
          <p className="text-xs">OR</p>
          <div className="flex-1 border-t-1" />
        </div>
        <GoogleLogin />
      </div>
    </div>
  );
}
