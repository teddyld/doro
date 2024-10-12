import React from "react";
import { TaskType } from "./initialData";
import Task from "./Task";

const TasksList = React.memo(
  ({ tasks }: { tasks: TaskType[] }) => {
    return (
      <>
        {tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} />
        ))}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.tasks === nextProps.tasks,
);

export default TasksList;
