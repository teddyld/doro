import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ColumnType, TaskType, BoardType } from "./initialData";
import TrelloForm from "./TrelloForm";
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
  // Add new task to column
  const createTask = (value: string) => {
    if (value === "") {
      return;
    }

    // New task properties
    const newTaskId = `task-${board.taskCount + 1}`;
    const newTask = {
      [newTaskId]: {
        id: newTaskId,
        content: value,
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
                "max-w-72 rounded-md border-2 bg-card p-2 shadow-md",
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
              <TrelloForm onSubmit={createTask} item="task" />
            </div>
          )}
        </Droppable>
      )}
    </Draggable>
  );
}
