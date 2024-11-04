import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import ModalStatistics from "./ModalStatistics";

it("Modal is hidden when not open", async () => {
  const onCloseFn = jest.fn();
  setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<ModalStatistics isOpen={false} onClose={onCloseFn} />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.queryByRole("dialog")).not.toBeTruthy();
});

it("Modal is visible when open", async () => {
  const onCloseFn = jest.fn();
  setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<ModalStatistics isOpen={true} onClose={onCloseFn} />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.queryByRole("dialog")).toBeTruthy();
});

it("Modal becomes hidden when closed", async () => {
  const onCloseFn = jest.fn();
  const { user } = setupRender(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<ModalStatistics isOpen={true} onClose={onCloseFn} />}
        />
      </Routes>
    </MemoryRouter>,
  );

  // Initially close the login warning
  const closeLoginWarningBtn = screen.getByRole("button", {
    name: /close/i,
  });
  await user.click(closeLoginWarningBtn);

  // Close with button
  const closeSettingsModalBtn = screen.getByRole("button", {
    name: /done/i,
  });
  await user.click(closeSettingsModalBtn);

  // Close with modal blur
  await user.click(document.body);

  expect(onCloseFn).toHaveBeenCalledTimes(2);
});
