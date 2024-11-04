import React from "react";
import clsx from "clsx";
import { Textarea } from "@nextui-org/react";

import ColumnActions from "./ColumnActions";
import { ColumnType } from "./boardData";
import { useBoardStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";

const ColumnTitle = React.memo(
  ({ column }: { column: ColumnType }) => {
    const [value, setValue] = React.useState(column.title);
    const [textArea, setTextArea] = React.useState(false);
    const board = useBoardStore((state) => state.board);
    const setBoard = useBoardStore((state) => state.setBoard);

    const titleRef = React.useRef<HTMLDivElement>(null);
    useClickOutside(titleRef, () => {
      updateColumnTitle();
    });

    // Update title of current column to value
    const updateColumnTitle = () => {
      setTextArea(false);
      // Set value back to default column title
      if (value === "" || value === column.title) {
        setValue(column.title);
        return;
      }

      const newColumn = {
        ...column,
        title: value,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [column.id]: newColumn,
        },
      };

      setBoard(newBoard);
    };

    // Update title on "Enter" key in textarea
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        updateColumnTitle();
      }
    };

    // Delete the current column
    const deleteColumn = () => {
      const newColumnOrder = Array.from(board.columnOrder);
      const columnIndex = newColumnOrder.indexOf(column.id);
      newColumnOrder.splice(columnIndex, 1);

      const newColumns = structuredClone(board.columns);
      delete newColumns[column.id];

      const newBoard = {
        ...board,
        columns: {
          ...newColumns,
        },
        columnOrder: newColumnOrder,
      };

      setBoard(newBoard);
    };

    return (
      <div className="flex justify-between gap-1">
        <div ref={titleRef} className="flex-grow pb-2">
          <Textarea
            aria-label="edit-column-title-textarea"
            value={value}
            onValueChange={setValue}
            size="sm"
            color="danger"
            maxRows={1}
            classNames={{
              input: "font-semibold text-md",
            }}
            className={textArea ? "" : "hidden"}
            onKeyDown={handleEnterKey}
          />

          <h3
            className={clsx(
              textArea ? "hidden" : "z-50 pb-2 pl-2 pt-2 font-semibold",
            )}
            onClick={() => setTextArea(true)}
          >
            {column.title}
          </h3>
        </div>
        <ColumnActions deleteColumn={deleteColumn} setTextArea={setTextArea} />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.column === nextProps.column,
);

export default ColumnTitle;
