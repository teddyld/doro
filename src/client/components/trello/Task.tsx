import { TaskType } from "./initialData";
import { Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";

export default function Task({
  task,
  index,
}: {
  task: TaskType;
  index: number;
}) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(
            snapshot.isDragging ? "bg-primary/50" : "bg-background",
            "border-content mb-2 break-words rounded-md border-2 border-transparent p-2 shadow-sm hover:border-primary focus:border-primary focus:outline-none",
          )}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}
