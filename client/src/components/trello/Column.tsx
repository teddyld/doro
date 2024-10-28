import clsx from "clsx";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import TrelloForm from "./TrelloForm";
import ColumnTitle from "./ColumnTitle";
import TasksList from "./TasksList";
import ColumnActions from "./ColumnActions";

import { ColumnType, TaskType } from "./boardData";
import { useBoardStore } from "../../store";

type ColumnProps = {
  column: ColumnType;
  tasks: TaskType[];
  index: number;
};

export default function Column({ column, tasks, index }: ColumnProps) {
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);

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
        labels: [],
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
              <div className="flex justify-between gap-1">
                <ColumnTitle column={column} />
                <ColumnActions column={column} />
              </div>
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
