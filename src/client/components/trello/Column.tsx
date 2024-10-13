import { Droppable, Draggable } from "@hello-pangea/dnd";
import { ColumnType, TaskType } from "./initialData";
import clsx from "clsx";
import TasksList from "./TasksList";

type ColumnProps = {
  column: ColumnType;
  tasks: TaskType[];
  index: number;
};

export default function Column({ column, tasks, index }: ColumnProps) {
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
            </div>
          )}
        </Droppable>
      )}
    </Draggable>
  );
}
