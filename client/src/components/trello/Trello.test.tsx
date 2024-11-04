import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import Trello from "./Trello";

it("Displays default Trello board and header when not logged in", async () => {
  setupRender(<Trello />);

  // Displays default header
  expect(screen.queryAllByText(/your board/i)).toBeTruthy();

  // Displays information about user boards
  expect(screen.queryByRole("button", { name: /information/i })).toBeTruthy();

  // Displays Trello board
  expect(
    screen.getByRole("button", {
      name: /to do add a task/i,
    }),
  ).toBeTruthy();

  expect(
    screen.getByRole("button", {
      name: /doing add a task/i,
    }),
  ).toBeTruthy();

  expect(
    screen.getByRole("button", {
      name: /done add a task/i,
    }),
  ).toBeTruthy();

  expect(
    screen.getByRole("button", {
      name: /add a list/i,
    }),
  ).toBeTruthy();
});
