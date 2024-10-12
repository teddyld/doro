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
      {(provided, columnSnapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                className={clsx(
                  snapshot.isDraggingOver
                    ? "border-primary"
                    : "border-transparent",
                  columnSnapshot.isDragging ? "opacity-75" : "",
                  "bg-card min-w-64 rounded-md border-2 p-2",
                )}
              >
                <h3 className="pb-2 pl-2 font-semibold">{column.title}</h3>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-12 flex-grow"
                >
                  <TasksList tasks={tasks} />
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
