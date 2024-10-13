import React from "react";
import { Textarea } from "@nextui-org/react";
import { BoardType, ColumnType } from "./initialData";
import { useClickOutside } from "../../hooks/useClickOutside";
import clsx from "clsx";

type ColumnTitleType = {
  column: ColumnType;
  board: BoardType;
  setBoard: React.Dispatch<React.SetStateAction<BoardType>>;
};

const ColumnTitle = React.memo(
  ({ column, board, setBoard }: ColumnTitleType) => {
    const [value, setValue] = React.useState(column.title);
    const [textArea, setTextArea] = React.useState(false);

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
    return (
      <div ref={titleRef} className="pb-2">
        <Textarea
          aria-label="Set list title"
          value={value}
          onValueChange={setValue}
          size="sm"
          maxRows={1}
          classNames={{
            inputWrapper: "bg-card pt-0",
            input: "font-semibold text-md",
          }}
          color="danger"
          className={textArea ? "" : "hidden"}
          onKeyDown={handleEnterKey}
        />

        <h3
          className={clsx(textArea ? "hidden" : "z-50 pb-2 pl-2 font-semibold")}
          onClick={() => setTextArea(true)}
        >
          {column.title}
        </h3>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.column === nextProps.column,
);

export default ColumnTitle;