import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import PreferencesSettings from "./PreferencesSettings";

it("Changes theme to dark mode and light mode", async () => {
  const { user } = setupRender(<PreferencesSettings />);
  const darkModeBtn = screen.getByRole("button", { name: /dark\-mode/i });
  const lightModeBtn = screen.getByRole("button", { name: /light\-mode/i });

  // Change theme to dark mode
  await user.click(darkModeBtn);
  expect(darkModeBtn).toHaveAttribute("data-focus", "true");
  expect(lightModeBtn).not.toHaveAttribute("data-focus", "true");

  // Change theme to light mode
  await user.click(lightModeBtn);
  expect(darkModeBtn).not.toHaveAttribute("data-focus", "true");
  expect(lightModeBtn).toHaveAttribute("data-focus", "true");
});
