import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import DoroLogo from "./DoroLogo";

it("Navigates to dashboard onClick", async () => {
  const { user } = setupRender(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<DoroLogo />} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );

  // Click dashboard link in DoroLogo component
  const link = screen.getByLabelText("link-dashboard");
  await user.click(link);

  // Check navigation to dashboard route
  expect(screen.getByText("Dashboard")).toBeTruthy();
});
