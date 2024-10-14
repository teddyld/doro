import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button,
  Tooltip,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import {
  FaPen,
  FaTrashAlt,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { MdNewLabel } from "react-icons/md";
import { TaskType, labelData, labelToColor } from "./boardData";
import { useBoardStore } from "../../store";
import { useTheme } from "next-themes";
import clsx from "clsx";

type TaskActionsType = {
  task: TaskType;
  showAction: boolean;
  setTextArea: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskActions = React.memo(
  ({ task, showAction, setTextArea }: TaskActionsType) => {
    const board = useBoardStore((state) => state.board);
    const setBoard = useBoardStore((state) => state.setBoard);

    const [showLabels, setShowLabels] = React.useState(false);
    const [selected, setSelected] = React.useState<string[]>(task.labels);

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

    // Update the current task labels
    const updateTaskLabels = (value: string[]) => {
      setSelected(value);

      if (value === task.labels) return;

      const newTask = {
        ...task,
        labels: value,
      };

      const newBoard = {
        ...board,
        tasks: {
          ...board.tasks,
          [task.id]: newTask,
        },
      };

      setBoard(newBoard);
    };

    const { theme } = useTheme();

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
              <Button
                isIconOnly
                className="opacity-50"
                size="sm"
                variant="light"
              >
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
            showDivider
          >
            <DropdownItem
              key="edit-content"
              startContent={<FaEdit />}
              onClick={() => setTextArea(true)}
            >
              Edit task
            </DropdownItem>
            <DropdownItem
              key="edit-label"
              closeOnSelect={false}
              isReadOnly
              className="p-0"
              textValue="Edit label"
            >
              <Popover className="w-full" placement="right-start">
                <PopoverTrigger>
                  <Button
                    aria-label="Edit labels"
                    className="flex w-full justify-between p-2"
                    variant="light"
                    onClick={() => setShowLabels(!showLabels)}
                  >
                    <div className="flex items-center gap-2">
                      <MdNewLabel />
                      Edit label
                    </div>
                    {showLabels ? <FaChevronRight /> : <FaChevronLeft />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-32 p-2">
                    <CheckboxGroup
                      label="Select labels"
                      color="default"
                      classNames={{
                        base: "w-full",
                      }}
                      value={selected}
                      onValueChange={(value) => updateTaskLabels(value)}
                    >
                      {labelData.map((label) => {
                        return (
                          <Checkbox
                            value={label.name}
                            key={label.name}
                            classNames={{
                              base: "inline-flex w-full max-w-md",
                              label: "w-full",
                            }}
                          >
                            {/* Use empty character */}
                            <div
                              className={`w-full ${labelToColor(label.name, theme || "dark")}`}
                            >
                              ‎
                            </div>
                          </Checkbox>
                        );
                      })}
                    </CheckboxGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
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
  },
);

export default TaskActions;
