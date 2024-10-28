import React from "react";
import { Input, Button } from "@nextui-org/react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store";
import DoroHero from "../components/login/DoroHero";
import axios from "axios";
import clsx from "clsx";

export default function ResetPassword() {
  const params = useParams();
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [visibility, setVisibility] = React.useState({
    password: false,
    passwordConfirm: false,
  });

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    } else if (password.length < 8 || passwordConfirm.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    try {
      const { loggedIn, name, token } = await axios
        .put(`/user/reset-password/${params.token}`, { password })
        .then((res) => res.data);

      setUser({ name, token });
      setLoggedIn(loggedIn);
      navigate("/");
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground p-8">
        <DoroHero />
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <Input
            type={visibility.password ? "text" : "password"}
            label="Password"
            value={password}
            onValueChange={setPassword}
            isInvalid={error !== ""}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() =>
                  setVisibility({
                    ...visibility,
                    password: !visibility.password,
                  })
                }
                aria-label="toggle password visibility"
              >
                {visibility.password ? (
                  <FaEyeSlash className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <FaEye className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <Input
            type={visibility.passwordConfirm ? "text" : "password"}
            label="Confirm Password"
            value={passwordConfirm}
            onValueChange={setPasswordConfirm}
            isInvalid={error !== ""}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() =>
                  setVisibility({
                    ...visibility,
                    passwordConfirm: !visibility.passwordConfirm,
                  })
                }
                aria-label="toggle password visibility"
              >
                {visibility.passwordConfirm ? (
                  <FaEyeSlash className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <FaEye className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <p className={clsx(error === "" ? "hidden" : "", "text-red-600")}>
            {error}
          </p>
          <Button type="submit" className="my-2" variant="shadow">
            Set Password
          </Button>
        </form>
      </div>
    </div>
  );
}
