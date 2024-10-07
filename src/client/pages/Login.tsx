import React from "react";
import axios from "axios";
import { Link } from "@nextui-org/react";

import DoroHero from "../components/login/DoroHero";
import LoginForm from "../components/login/LoginForm";
import GoogleLogin from "../components/login/GoogleLogin";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [submitError, setSubmitError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await axios.post("/user/login", { email, password });
      console.log(data);
      // navigate("/");
    } catch (_) {
      setSubmitError(
        "User does not exist. Check password or register an account.",
      );
    }
  };

  return (
    <div className="mx-auto flex min-h-screen justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground p-8">
        <DoroHero />
        <h2 className="mb-4 self-center text-2xl">Login</h2>
        <LoginForm onSubmit={handleLogin} submitError={submitError} />
        <Link
          className="cursor-pointer font-semibold text-primary underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </Link>

        <p>
          Dont have an account?{" "}
          <Link
            className="cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Sign up
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
