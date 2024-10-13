import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ColumnType, TaskType, BoardType } from "./initialData";
import { FaPlus } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import { Button, Textarea } from "@nextui-org/react";
import clsx from "clsx";
import TasksList from "./TasksList";
import React from "react";

type ColumnProps = {
  column: ColumnType;
  tasks: TaskType[];
  index: number;
  board: BoardType;
  setBoard: React.Dispatch<React.SetStateAction<BoardType>>;
};

export default function Column({
  column,
  tasks,
  index,
  board,
  setBoard,
}: ColumnProps) {
  const [content, setContent] = React.useState("");
  const [textArea, setTextArea] = React.useState(false);

  // Create task on "Enter" key in textarea
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTask();
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask();
  };

  // Add new task to column
  const createTask = () => {
    // New task properties
    const newTaskId = `task-${board.taskCount + 1}`;
    const newTask = {
      [newTaskId]: {
        id: newTaskId,
        content: content,
      },
    };

    // Update board with new task
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.push(newTaskId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        ...newTask,
      },
      columns: {
        ...board.columns,
        [column.id]: newColumn,
      },
      taskCount: board.taskCount + 1,
    };

    setBoard(newBoard);
    setContent("");
    setTextArea(false);
  };

  const cancelTask = () => {
    setContent("");
    setTextArea(false);
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(columnProvided, columnSnapshot) => (
        <Droppable droppableId={column.id} type="task">
          {(provided, snapshot) => (
            <div
              {...columnProvided.draggableProps}
              {...columnProvided.dragHandleProps}
              ref={columnProvided.innerRef}
              className={clsx(
                snapshot.isDraggingOver
                  ? "border-primary"
                  : "border-transparent",
                columnSnapshot.isDragging ? "opacity-75" : "",
                "min-w-64 rounded-md border-2 bg-card p-2",
              )}
            >
              <h3 className="pb-2 pl-2 font-semibold">{column.title}</h3>
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-2"
              >
                <TasksList tasks={tasks} />
                {provided.placeholder}
              </div>
              {textArea ? (
                <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                  <Textarea
                    placeholder="Enter a task"
                    aria-label="New task"
                    value={content}
                    onValueChange={setContent}
                    minRows={2}
                    classNames={{
                      inputWrapper: "bg-background",
                    }}
                    type="submit"
                    onKeyDown={handleEnterKey}
                  />
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="solid"
                      radius="sm"
                      type="submit"
                    >
                      Add task
                    </Button>
                    <Button
                      isIconOnly
                      variant="light"
                      className="text-2xl hover:bg-background"
                      onClick={cancelTask}
                    >
                      <IoIosClose />
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="light"
                  className="w-full justify-start"
                  onClick={() => setTextArea(true)}
                >
                  <FaPlus />
                  Add a task
                </Button>
              )}
            </div>
          )}
        </Droppable>
      )}
    </Draggable>
  );
}
