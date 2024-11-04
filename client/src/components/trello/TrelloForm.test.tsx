import { screen, waitFor } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import TrelloForm from "./TrelloForm";

it("Opens textarea and submits a new task using button", async () => {
  const mockSubmitFn = jest.fn();
  const mockItem = "task";

  const { user } = setupRender(
    <TrelloForm onSubmit={mockSubmitFn} item={mockItem} />,
  );

  // Open trello form component
  await user.click(screen.getByRole("button", { name: /add a task/i }));

  // Enter new task name
  const trelloTextarea = screen.getByRole("textbox", {
    name: /create\-new\-task\-textarea/i,
  });

  await user.type(trelloTextarea, "Example task");
  await waitFor(() => {
    expect(trelloTextarea).toHaveValue("Example task");
  });

  // Submit task with button
  await user.click(screen.getByRole("button", { name: /add task/i }));
  expect(mockSubmitFn).toHaveBeenCalledTimes(1);
});

it("Opens textarea and submits a new task using enter key", async () => {
  const mockSubmitFn = jest.fn();
  const mockItem = "task";

  const { user } = setupRender(
    <TrelloForm onSubmit={mockSubmitFn} item={mockItem} />,
  );

  // Open trello form component
  await user.click(screen.getByRole("button", { name: /add a task/i }));

  // Enter new task name
  const trelloTextarea = screen.getByRole("textbox", {
    name: /create\-new\-task\-textarea/i,
  });

  await user.type(trelloTextarea, "Example task");
  await waitFor(() => {
    expect(trelloTextarea).toHaveValue("Example task");
  });

  // Submit task with enter key
  await user.type(trelloTextarea, "{enter}");
  expect(mockSubmitFn).toHaveBeenCalledTimes(1);
});

it("Closes textarea on blur and does not create a new task", async () => {
  const mockSubmitFn = jest.fn();
  const mockItem = "task";

  const { user } = setupRender(
    <TrelloForm onSubmit={mockSubmitFn} item={mockItem} />,
  );

  // Open trello form component
  await user.click(screen.getByRole("button", { name: /add a task/i }));

  // Enter new task name
  const trelloTextarea = screen.getByRole("textbox", {
    name: /create\-new\-task\-textarea/i,
  });

  await user.type(trelloTextarea, "Example task");
  await waitFor(() => {
    expect(trelloTextarea).toHaveValue("Example task");
  });

  // Blur textarea
  await user.click(document.body);

  expect(mockSubmitFn).toHaveBeenCalledTimes(0);
});
