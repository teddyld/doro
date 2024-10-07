import React from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { emailRegex } from "../utils/validEmailRegex";
import { useNavigate } from "react-router-dom";

import DoroHero from "../components/login/DoroHero";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError(false);
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
  };

  const handleEmail = (value: string) => {
    setEmailError(false);
    setEmail(value);
  };

  return (
    <div className="mx-auto flex min-h-screen justify-center py-24 md:px-24">
      <div className="flex w-96 flex-col gap-4 rounded-lg border-1 border-foreground p-8">
        <DoroHero />
        <h2 className="self-center text-2xl">Forgot your password?</h2>
        <p className="text-center">
          Enter your email address and we will send you instructions to reset
          your password
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
          <Button type="submit" className="my-2" variant="shadow">
            Continue
          </Button>
        </form>
        <Link
          className="mt-4 cursor-pointer self-center underline"
          onClick={() => navigate("/")}
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
