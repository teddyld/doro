import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

import { ColumnType } from "./boardData";
import { useBoardStore } from "../../store";

const ColumnActions = React.memo(
  ({ column }: { column: ColumnType }) => {
    const board = useBoardStore((state) => state.board);
    const setBoard = useBoardStore((state) => state.setBoard);

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
      <Dropdown showArrow>
        <Tooltip content="List actions" delay={1000} size="sm" radius="none">
          <div>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Open list actions"
              >
                <BsThreeDots />
              </Button>
            </DropdownTrigger>
          </div>
        </Tooltip>
        <DropdownMenu aria-label="List Actions" variant="flat">
          <DropdownSection
            title="List Actions"
            classNames={{
              heading: "flex justify-center",
            }}
          >
            <DropdownItem
              key="delete-column"
              color="danger"
              className="text-danger"
              startContent={<FaTrashAlt />}
              onClick={deleteColumn}
            >
              Delete list
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    );
  },
  (prevProps, nextProps) => prevProps.column === nextProps.column,
);

export default ColumnActions;
