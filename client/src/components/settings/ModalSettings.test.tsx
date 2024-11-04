import { screen } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import ModalSettings from "./ModalSettings";

it("Modal is hidden when not open", () => {
  const onCloseFn = jest.fn();
  setupRender(<ModalSettings isOpen={false} onClose={onCloseFn} />);

  expect(screen.queryByRole("dialog")).not.toBeTruthy();
});

it("Modal is visible when open", () => {
  const onCloseFn = jest.fn();
  setupRender(<ModalSettings isOpen={true} onClose={onCloseFn} />);

  expect(screen.queryByRole("dialog")).toBeTruthy();
});

it("Modal becomes hidden when closed", async () => {
  const onCloseFn = jest.fn();
  const { user } = setupRender(
    <ModalSettings isOpen={true} onClose={onCloseFn} />,
  );

  const closeBtn = screen.getByRole("button", {
    name: /done/i,
  });

  await user.click(closeBtn);
  expect(onCloseFn).toHaveBeenCalledTimes(1);
});
