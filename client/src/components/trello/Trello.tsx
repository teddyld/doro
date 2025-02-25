import ColumnsList from "./ColumnsList";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { ScrollShadow } from "@nextui-org/react";

import TrelloForm from "./TrelloForm";
import TrelloPagination from "./TrelloPagination";
import TrelloDefaultHeader from "./TrelloDefaultHeader";

import { useBoardStore, useAuthStore } from "../../store";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import { useUnloadAlertUser } from "../../hooks/useUnloadAlertUser";

export default function Trello() {
  const userBoards = useBoardStore((state) => state.userBoards);
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  useUnloadAlertUser(loggedIn);

  const handleDragEnd = (result: DropResult<string>) => {
    const { destination, source, draggableId, type } = result;

    // Item was not dragged anywhere
    if (!destination) return;

    // Item was dragged to the same starting position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Reorder columns
    if (type === "column") {
      const newColumnOrder = Array.from(board.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newBoard = {
        ...board,
        columnOrder: newColumnOrder,
      };

      setBoard(newBoard);
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    // Reorder within column
    if (start === finish) {
      // Copy column tasks
      const newTaskIds = Array.from(start.taskIds);

      // Move task from old to new index
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      // Create new board state with updated tasks list
      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      return;
    }

    // Reorder between columns
    // Remove task from starting column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    // Add task to destination column
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setBoard(newBoard);
  };

  // Add new column to board
  const createColumn = (value: string) => {
    if (value === "") {
      return;
    }

    const newColumnId = `column-${board.columnCount + 1}`;
    const newColumn = {
      [newColumnId]: {
        id: newColumnId,
        title: value,
        taskIds: [],
      },
    };

    const newColumnOrder = Array.from(board.columnOrder);
    newColumnOrder.push(newColumnId);

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        ...newColumn,
      },
      columnOrder: newColumnOrder,
      columnCount: board.columnCount + 1,
    };

    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col p-8 pt-4">
      {loggedIn ? (
        <TrelloPagination userBoards={userBoards || []} />
      ) : (
        <TrelloDefaultHeader />
      )}
      {userBoards?.length === 0 && loggedIn ? (
        <></>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <ScrollShadow
                size={0}
                orientation="horizontal"
                className="flex gap-2 pb-4"
                ref={scrollRef}
              >
                <div
                  className="flex items-start gap-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {board.columnOrder.map((columnId, index) => {
                    const column = board.columns[columnId];

                    return (
                      <ColumnsList
                        key={column.id}
                        column={column}
                        taskMap={board.tasks}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                </div>
                <TrelloForm onSubmit={createColumn} item="list" />
              </ScrollShadow>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
