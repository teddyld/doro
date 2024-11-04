import { screen, act } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import ColumnActions from "./ColumnActions";

it("Opens column actions on button press and closes on blur", async () => {
  const mockDeleteColumnFn = jest.fn();
  const mockTextAreaFn = jest.fn();

  const { user } = setupRender(
    <ColumnActions
      deleteColumn={mockDeleteColumnFn}
      setTextArea={mockTextAreaFn}
    />,
  );

  // Open column actions dropdown
  await act(async () => {
    const columnActionsBtn = screen.getByRole("button", {
      name: /open list actions/i,
    });

    await user.click(columnActionsBtn);
  });

  // Expect column actions
  expect(
    screen.getByRole("menuitem", {
      name: /rename/i,
    }),
  ).toBeTruthy();

  expect(
    screen.getByRole("menuitem", {
      name: /delete/i,
    }),
  ).toBeTruthy();

  // Blur dropdown by clicking on document body
  await user.click(document.body);

  // Wait for closing animation to terminate
  await act(async () => {
    await new Promise((r) => setTimeout(r, 2000));
  });

  expect(
    screen.queryByRole("menuitem", {
      name: /rename/i,
    }),
  ).not.toBeTruthy();

  expect(
    screen.queryByRole("menuitem", {
      name: /delete/i,
    }),
  ).not.toBeTruthy();
});

it("Sets textarea on rename using column action", async () => {
  const mockDeleteColumnFn = jest.fn();
  const mockTextAreaFn = jest.fn();

  const { user } = setupRender(
    <ColumnActions
      deleteColumn={mockDeleteColumnFn}
      setTextArea={mockTextAreaFn}
    />,
  );

  // Open column actions dropdown
  await act(async () => {
    const columnActionsBtn = screen.getByRole("button", {
      name: /open list actions/i,
    });

    await user.click(columnActionsBtn);
  });

  // Click rename button
  const renameBtn = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameBtn);

  expect(mockTextAreaFn).toHaveBeenCalledTimes(1);
});

it("Deletes column using column action", async () => {
  const mockDeleteColumnFn = jest.fn();
  const mockTextAreaFn = jest.fn();

  const { user } = setupRender(
    <ColumnActions
      deleteColumn={mockDeleteColumnFn}
      setTextArea={mockTextAreaFn}
    />,
  );

  // Open column actions dropdown
  await act(async () => {
    const columnActionsBtn = screen.getByRole("button", {
      name: /open list actions/i,
    });

    await user.click(columnActionsBtn);
  });

  // Click delete button
  const deleteBtn = screen.getByRole("menuitem", { name: /delete/i });
  await user.click(deleteBtn);

  expect(mockDeleteColumnFn).toHaveBeenCalledTimes(1);
});
