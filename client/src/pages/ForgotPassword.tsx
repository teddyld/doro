import React from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { emailRegex } from "../utils/validEmailRegex";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { toast } from "sonner";

import DoroHero from "../components/login/DoroHero";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const navigate = useNavigate();

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    try {
      setSent(true);
      await axios
        .post("/user/forgot-password", { email })
        .then((res) => res.data);
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleEmail = (value: string) => {
    setEmailError(false);
    setEmail(value);
  };

  return (
    <div className="mx-auto flex justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground/25 p-8 shadow-2xl">
        <DoroHero />
        <div className="flex flex-col justify-center gap-4">
          <div className={clsx(sent ? "hidden" : "", "flex flex-col gap-4")}>
            <h2 className="text-center text-2xl">Forgot your password?</h2>
            <p className="text-center">
              Enter your email address and we will send you a password reset
              link
            </p>
            <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onValueChange={(value) => handleEmail(value)}
                errorMessage="Please enter a valid email"
                isInvalid={emailError}
                placeholder="example@mail.com"
              />
              <Button type="submit" className="my-1" variant="shadow">
                Send password reset email
              </Button>
            </form>
          </div>
          <div className={clsx(sent ? "flex" : "hidden", "flex-col gap-4")}>
            <h2 className="text-center text-2xl">
              Password reset link has been sent!
            </h2>
            <p className="text-center">
              A password reset link has been sent to your email address. Click
              the link sent to your inbox to reset your password.
            </p>
          </div>
          <Link
            className="mt-4 cursor-pointer self-center font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
