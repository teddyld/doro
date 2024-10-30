import React from "react";
import clsx from "clsx";
import { Input, Button } from "@nextui-org/react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { emailRegex } from "../../utils/validEmailRegex";

export default function LoginForm({
  onSubmit,
  submitError,
  loading,
}: {
  onSubmit: (email: string, password: string) => void;
  submitError: string;
  loading: boolean;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState({
    message: "",
    email: false,
    password: false,
  });

  React.useEffect(() => {
    if (submitError !== "") {
      setError({
        message: submitError,
        email: true,
        password: true,
      });
    }
  }, [submitError]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Reset errors
    setError({
      message: "",
      email: false,
      password: false,
    });

    if (!emailRegex.test(email)) {
      setError({
        message: "Please input a valid email.",
        email: true,
        password: false,
      });
      return;
    } else if (password.length < 8) {
      setError({
        message: "Password must contain at least 8 characters.",
        email: false,
        password: true,
      });
      return;
    }

    onSubmit(email, password);
  };

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
      <Input
        type="email"
        label="Email"
        value={email}
        onValueChange={setEmail}
        isInvalid={error.email}
        placeholder="example@mail.com"
      />
      <Input
        type={visible ? "text" : "password"}
        label="Password"
        value={password}
        onValueChange={setPassword}
        isInvalid={error.password}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label="toggle password visibility"
          >
            {visible ? (
              <FaEyeSlash className="pointer-events-none text-2xl text-default-400" />
            ) : (
              <FaEye className="pointer-events-none text-2xl text-default-400" />
            )}
          </button>
        }
      />
      <p className={clsx(error.message === "" ? "hidden" : "", "text-red-600")}>
        {error.message}
      </p>
      <Button
        type="submit"
        className="my-2"
        variant="shadow"
        isLoading={loading}
      >
        {loading ? "" : "Continue"}
      </Button>
    </form>
  );
}
