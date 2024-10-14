import { useTheme } from "next-themes";

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
  tasks: Record<string, TaskType>;
  columns: Record<string, ColumnType>;
  columnOrder: string[];
  taskCount: number;
  columnCount: number;
};

export const initialData: BoardType = {
  tasks: {
    "task-1": {
      id: "task-1",
      content: "Task and column editing",
      labels: ["green", "blue"],
    },
    "task-2": {
      id: "task-2",
      content: "Pagination of different boards",
      labels: ["red"],
    },
    "task-3": {
      id: "task-3",
      content: "Track task completion in statistics modal",
      labels: ["yellow"],
    },
    "task-4": {
      id: "task-4",
      content: "Task labelling and filtering",
      labels: [],
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
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
  taskCount: 4,
  // Total number of columns created on this board
  columnCount: 3,
};

export const labelData = [
  {
    name: "green",
    color: "bg-green-600",
    darkColor: "bg-green-900",
  },
  {
    name: "red",
    color: "bg-red-600",
    darkColor: "bg-red-900",
  },
  {
    name: "blue",
    color: "bg-blue-600",
    darkColor: "bg-blue-900",
  },
  {
    name: "yellow",
    color: "bg-yellow-400",
    darkColor: "bg-yellow-700",
  },
  {
    name: "orange",
    color: "bg-orange-600",
    darkColor: "bg-orange-800",
  },
  {
    name: "purple",
    color: "bg-purple-600",
    darkColor: "bg-purple-900",
  },
];

export const labelToColor = (labelName: string) => {
  const { theme } = useTheme();

  for (const label of labelData) {
    if (label.name === labelName) {
      if (theme === "dark") {
        return label.darkColor;
      } else {
        return label.color;
      }
    }
  }
};
