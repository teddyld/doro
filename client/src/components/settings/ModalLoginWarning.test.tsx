import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import ModalLoginWarning from "./ModalLoginWarning";

it("Modal is hidden when not open", async () => {
  const onCloseFn = jest.fn();
  const hideWarningFn = jest.fn();
  setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <ModalLoginWarning
              isOpen={false}
              onClose={onCloseFn}
              hideWarning={hideWarningFn}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.queryByRole("dialog")).not.toBeTruthy();
});

it("Modal is visible when open", async () => {
  const onCloseFn = jest.fn();
  const hideWarningFn = jest.fn();
  setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <ModalLoginWarning
              isOpen={true}
              onClose={onCloseFn}
              hideWarning={hideWarningFn}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.queryByRole("dialog")).toBeTruthy();
});

it("Modal becomes hidden when closed", async () => {
  const onCloseFn = jest.fn();
  const hideWarningFn = jest.fn();
  const { user } = setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <ModalLoginWarning
              isOpen={true}
              onClose={onCloseFn}
              hideWarning={hideWarningFn}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  // Close with button
  const closeBtn = screen.getByRole("button", {
    name: /close/i,
  });
  await user.click(closeBtn);

  // Close with modal blur
  await user.click(document.body);

  expect(onCloseFn).toHaveBeenCalledTimes(2);
});

it("Modal hides warning when 'Don't show again' button is clicked", async () => {
  const onCloseFn = jest.fn();
  const hideWarningFn = jest.fn();
  const { user } = setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <ModalLoginWarning
              isOpen={true}
              onClose={onCloseFn}
              hideWarning={hideWarningFn}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  const hideWarningBtn = screen.getByRole("button", {
    name: /don't show again/i,
  });

  // Closes modal and hides warning
  await user.click(hideWarningBtn);
  expect(onCloseFn).toHaveBeenCalledTimes(1);
  expect(hideWarningFn).toHaveBeenCalledTimes(1);
});

it("Navigates to login and register pages using buttons", async () => {
  const onCloseFn = jest.fn();
  const hideWarningFn = jest.fn();
  const { user } = setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route
          path="/"
          element={
            <ModalLoginWarning
              isOpen={true}
              onClose={onCloseFn}
              hideWarning={hideWarningFn}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  const loginLink = screen.getByRole("link", {
    name: /login/i,
  });

  // Check navigation to login route
  user.click(loginLink);
  expect(screen.getByText("Login")).toBeTruthy();

  const registerLink = screen.getByRole("link", {
    name: /register/i,
  });

  // Check navigation to register route
  user.click(registerLink);
  expect(screen.getByText("Register")).toBeTruthy();
});
