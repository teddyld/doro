import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import DropdownUser from "./DropdownUser";

it("Allows login when user is not logged in", async () => {
  const { user } = setupRender(
    <MemoryRouter>
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/" element={<DropdownUser />} />
      </Routes>
    </MemoryRouter>,
  );

  // Trigger dropdown
  const dropdownTriggerBtn = screen.getByRole("button", {
    name: /open profile options/i,
  });
  await user.click(dropdownTriggerBtn);

  expect(screen.getByText("Log in")).toBeTruthy();
});
