import React from "react";
import { TaskType } from "./boardData";
import { Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";
import TaskActions from "./TaskActions";

export default function Task({
  task,
  index,
}: {
  task: TaskType;
  index: number;
}) {
  const [showAction, setShowAction] = React.useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(
            snapshot.isDragging ? "bg-primary/50" : "bg-background",
            "border-content relative mb-2 break-words rounded-md border-2 border-transparent p-2 shadow-sm hover:border-primary focus:border-primary focus:outline-none",
          )}
          onMouseEnter={() => setShowAction(true)}
          onMouseLeave={() => setShowAction(false)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.content}
          <TaskActions task={task} showAction={showAction} />
        </div>
      )}
    </Draggable>
  );
}
