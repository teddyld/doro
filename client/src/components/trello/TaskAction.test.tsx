import { screen, act } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import TaskAction from "./TaskActions";

it("Opens task actions on button press and close on blur", async () => {
  const mockTask = {
    id: "task-1",
    content: "Example Task",
    labels: [""],
  };
  const setTextAreaFn = jest.fn();
  const { user } = setupRender(
    <TaskAction
      task={mockTask}
      showAction={true} // True when task is hovered to display task actions btn
      setTextArea={setTextAreaFn}
    />,
  );

  await act(async () => {
    // Open task actions dropdown
    const taskActionBtn = screen.getByRole("button");
    await user.click(taskActionBtn);
  });

  expect(screen.getByRole("dialog")).toBeTruthy();

  // Blur dropdown by clicking on document body
  await user.click(document.body);

  // Wait for closing animation to terminate
  await act(async () => {
    await new Promise((r) => setTimeout(r, 2000));
  });

  expect(screen.queryByRole("dialog")).not.toBeTruthy();
});
