import React from "react";
import Column from "./Column";
import { ColumnType, TaskType } from "./boardData";

type ColumnsList = {
  key: string;
  column: ColumnType;
  taskMap: Record<string, TaskType>;
  index: number;
};

const ColumnsList = React.memo(
  ({ column, taskMap, index }: ColumnsList) => {
    const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
    return <Column column={column} tasks={tasks} index={index} />;
  },
  (prevProps, nextProps) =>
    prevProps.column === nextProps.column &&
    prevProps.taskMap === nextProps.taskMap &&
    prevProps.index === nextProps.index,
);

export default ColumnsList;
