import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { TaskType } from "./boardData";
import { useBoardStore } from "../../store";
import clsx from "clsx";

type TaskActionsType = {
  task: TaskType;
  showAction: boolean;
};

const TaskActions = React.memo(({ task, showAction }: TaskActionsType) => {
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);

  // Delete the current task from column
  const deleteTask = () => {
    const taskId = task.id;
    const newTasks = board.tasks;
    delete newTasks[taskId];

    const newColumns = structuredClone(board.columns);
    for (const columnId in newColumns) {
      const taskIds = newColumns[columnId].taskIds;
      // Column contains task to remove
      if (taskIds.includes(taskId)) {
        const taskIndex = taskIds.indexOf(taskId);
        taskIds.splice(taskIndex, 1);
      }
    }

    const newBoard = {
      ...board,
      tasks: newTasks,
      columns: newColumns,
    };

    setBoard(newBoard);
  };

  return (
    <Dropdown showArrow>
      <Tooltip content="Task actions" delay={1000} size="sm" radius="none">
        <div
          className={clsx(
            showAction ? "flex" : "hidden",
            "absolute right-1 top-1",
          )}
        >
          <DropdownTrigger>
            <Button isIconOnly className="opacity-50" size="sm" variant="light">
              <FaPen />
            </Button>
          </DropdownTrigger>
        </div>
      </Tooltip>
      <DropdownMenu aria-label="Task Actions" variant="flat">
        <DropdownSection
          title="Task Actions"
          classNames={{
            heading: "flex justify-center",
          }}
        >
          <DropdownItem
            key="delete-column"
            color="danger"
            className="text-danger"
            startContent={<FaTrashAlt />}
            onClick={deleteTask}
          >
            Delete task
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
});

export default TaskActions;
