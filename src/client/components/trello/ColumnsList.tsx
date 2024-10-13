import React from "react";
import { ColumnType, TaskType, BoardType } from "./initialData";
import Column from "./Column";

type ColumnsList = {
  key: string;
  column: ColumnType;
  taskMap: Record<string, TaskType>;
  index: number;
  board: BoardType;
  setBoard: React.Dispatch<React.SetStateAction<BoardType>>;
};

const ColumnsList = React.memo(
  ({ column, taskMap, index, board, setBoard }: ColumnsList) => {
    const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
    return (
      <Column
        column={column}
        tasks={tasks}
        index={index}
        board={board}
        setBoard={setBoard}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.column === nextProps.column &&
    prevProps.taskMap === nextProps.taskMap &&
    prevProps.index === nextProps.index,
);

export default ColumnsList;
