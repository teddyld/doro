import React from "react";
import axios from "axios";
import { Link } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import DoroLogo from "../components/login/DoroLogo";
import LoginForm from "../components/login/LoginForm";
import GoogleLogin from "../components/login/GoogleLogin";

import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const setUser = useAuthStore((state) => state.setUser);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [submitError, setSubmitError] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loggedIn) {
      navigate("/")
    }
  }, [loggedIn])

  const mutation = useMutation({
    mutationFn: (userLogin: { email: string; password: string }) => {
      return axios.post("/user/login", userLogin).then((res) => res.data);
    },
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      const { loggedIn, name, token } = await mutation.mutateAsync({
        email,
        password,
      });

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
    <div className="mx-auto flex justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground/25 p-8 shadow-2xl">
        <DoroLogo />
        <h2 className="mb-4 self-center text-2xl">Login</h2>
        <LoginForm
          onSubmit={handleLogin}
          submitError={submitError}
          loading={mutation.isPending}
        />
        <Link
          className="cursor-pointer font-semibold text-primary hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </Link>

        <p>
          Dont have an account?{" "}
          <Link
            className="cursor-pointer hover:underline"
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
