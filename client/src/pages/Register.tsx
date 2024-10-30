import React from "react";
import axios from "axios";
import { Link } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";

import DoroHero from "../components/login/DoroHero";
import LoginForm from "../components/login/LoginForm";
import GoogleLogin from "../components/login/GoogleLogin";

import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [submitError, setSubmitError] = React.useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (userRegister: { email: string; password: string }) => {
      return axios.post("/user/register", userRegister).then((res) => res.data);
    },
  });

  const handleRegister = async (email: string, password: string) => {
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
        <DoroHero />
        <h2 className="mb-4 self-center text-2xl">Register</h2>
        <LoginForm
          onSubmit={handleRegister}
          submitError={submitError}
          loading={mutation.isPending}
        />
        <p>
          Already have an account?{" "}
          <Link
            className="cursor-pointer hover:underline"
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
