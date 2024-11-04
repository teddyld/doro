import { screen, waitFor } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import LoginForm from "./LoginForm";

it("Correctly handles errors before onSubmit, then success", async () => {
  const submitFn = jest.fn();

  const { user } = setupRender(
    <LoginForm onSubmit={submitFn} submitError={""} loading={false} />,
  );

  const emailForm = screen.getByLabelText("Email");
  const passwordForm = screen.getByLabelText("Password");
  const submitBtn = screen.getByRole("button", { name: /continue/i });

  // Submit invalid email
  await user.type(emailForm, "example@gmail");
  await user.click(submitBtn);

  expect(screen.getByText(/please input a valid email./i));

  // Clear invalid email input
  await user.clear(emailForm);
  expect(emailForm).toHaveValue("");

  // Submit invalid password less than 8 characters long
  await user.type(emailForm, "example@gmail.com");
  await user.type(passwordForm, "123456");
  await user.click(submitBtn);

  expect(screen.getByText(/password must contain at least 8 characters./i));

  // Clear invalid password input
  await user.clear(passwordForm);
  expect(passwordForm).toHaveValue("");

  // Submit valid email and password
  await user.type(passwordForm, "mypassword123");
  await user.click(submitBtn);

  await waitFor(() => expect(submitFn).toHaveBeenCalledTimes(1));
});

it("Hides/unhides password using the icon in the password form input", async () => {
  const submitFn = jest.fn();

  const { user } = setupRender(
    <LoginForm onSubmit={submitFn} submitError={""} loading={false} />,
  );

  // Enter password
  const passwordForm = screen.getByLabelText("Password");
  await user.type(passwordForm, "example_password");

  // Check type of password input
  expect(passwordForm).toHaveAttribute("type", "password");

  const passwordVisibleBtn = screen.getByRole("button", {
    name: /toggle password visibility/i,
  });

  // Change type of password input
  await user.click(passwordVisibleBtn);
  expect(passwordForm).toHaveAttribute("type", "text");
});

it("Sets error message when submitError is provided", async () => {
  const submitFn = jest.fn();

  setupRender(
    <LoginForm
      onSubmit={submitFn}
      submitError={"Login error occurred"}
      loading={false}
    />,
  );

  expect(screen.queryByText(/login error occurred/i)).toBeTruthy();
});
