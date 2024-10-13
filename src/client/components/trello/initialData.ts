export type TaskType = {
  id: string;
  content: string;
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
    },
    "task-2": {
      id: "task-2",
      content: "Pagination of different boards",
    },
    "task-3": {
      id: "task-3",
      content: "Track task completion in statistics modal",
    },
    "task-4": { id: "task-4", content: "Task labelling and filtering" },
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
