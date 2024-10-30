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
  color: "Default",
  tasks: {},
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: [],
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
  taskCount: 0,
  // Total number of columns created on this board
  columnCount: 3,
};

export const labelData = [
  {
    name: "Default",
    color: "bg-default",
    darkColor: "bg-default",
  },
  {
    name: "Red",
    color: "bg-red-400/80",
    darkColor: "bg-red-900",
  },
  {
    name: "Green",
    color: "bg-green-400/80",
    darkColor: "bg-green-900",
  },
  {
    name: "Blue",
    color: "bg-blue-400/80",
    darkColor: "bg-blue-900",
  },
  {
    name: "Yellow",
    color: "bg-yellow-400/80",
    darkColor: "bg-yellow-700",
  },
  {
    name: "Pink",
    color: "bg-fuchsia-400/80",
    darkColor: "bg-fuchsia-900",
  },
  {
    name: "Purple",
    color: "bg-purple-400/80",
    darkColor: "bg-purple-950",
  },
];

export const labelToColor = (labelName: string, theme: string | undefined) => {
  for (const label of labelData) {
    if (label.name === labelName) {
      if (theme === "light") {
        return label.color;
      } else {
        return label.darkColor;
      }
    }
  }
};
