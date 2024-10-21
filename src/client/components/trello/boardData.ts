export type TaskType = {
  id: string;
  content: string;
  labels: string[];
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

export type BoardType = {
  color: string;
  tasks: Record<string, TaskType>;
  columns: Record<string, ColumnType>;
  columnOrder: string[];
  taskCount: number;
  columnCount: number;
};

export type UserBoardsType = {
  board: BoardType;
  name: string;
};

export const defaultBoard: BoardType = {
  // Facilitate board pagination
  color: "bg-green-600",
  tasks: {
    "task-1": {
      id: "task-1",
      content: "Task and column editing",
      labels: [],
    },
    "task-2": {
      id: "task-2",
      content: "Pagination of different boards",
      labels: [],
    },
    "task-3": {
      id: "task-3",
      content: "Track task completion in statistics modal",
      labels: [],
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3"],
    },
    "column-2": {
      id: "column-2",
      title: "Doing",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"],
  // Total number of tasks created on this board
  taskCount: 3,
  // Total number of columns created on this board
  columnCount: 3,
};

export const labelData = [
  {
    name: "Red",
    color: "bg-red-500",
  },
  {
    name: "Green",
    color: "bg-green-500",
  },
  {
    name: "Blue",
    color: "bg-blue-500",
  },
  {
    name: "Yellow",
    color: "bg-yellow-500",
  },
  {
    name: "Pink",
    color: "bg-pink-500",
  },
  {
    name: "Purple",
    color: "bg-purple-500",
  },
];

export const labelToColor = (labelName: string) => {
  for (const label of labelData) {
    if (label.name === labelName) {
      return label.color;
    }
  }
};
