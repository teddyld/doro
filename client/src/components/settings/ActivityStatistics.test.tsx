import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import ActivityStatistics from "./ActivityStatistics";

it("Assigns default activity (0, 0.0) when not logged in", async () => {
  setupRender(<ActivityStatistics />);

  // Match with number of pomodoro's completed
  expect(screen.getByText(/^0$/i)).toBeTruthy();
  // Match with number of hours focused
  expect(screen.getByText(/0.0/i)).toBeTruthy();
});
