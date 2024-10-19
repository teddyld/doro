import axios from "axios";
import clsx from "clsx";
import { Divider, Button, Tooltip, ScrollShadow } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import { UserBoards } from "./boardData";
import { useBoardStore, useAuthStore } from "../../store";
import { toast } from "sonner";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import React from "react";

export default function TrelloPagination({ boards }: { boards: UserBoards[] }) {
  const selectedBoard = useBoardStore((state) => state.selectedBoard);
  const setSelectedBoard = useBoardStore((state) => state.setSelectedBoard);
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  const user = useAuthStore((state) => state.user);
  const token = user.token;

  // Load first board
  React.useEffect(() => {
    if (!selectedBoard.name && boards.length > 0) {
      setSelectedBoard(boards[0].name, boards[0].board);
    }
  }, [boards]);

  // Create a new default board
  const createBoard = async () => {
    try {
      const data = await axios
        .post("/board/create", { token })
        .then((res) => res.data);
      setSelectedBoard(data.boardName, data.board);
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <>
      <ScrollShadow
        size={0}
        orientation="horizontal"
        ref={scrollRef}
        className="mb-4 flex"
        hideScrollBar
      >
        <div className="flex flex-col">
          <div className="flex items-end gap-2">
            {boards.map((data: UserBoards, index: number) => {
              return (
                <Button
                  className={clsx(
                    data.name === selectedBoard.name
                      ? "h-9 font-semibold"
                      : "h-8",
                    `${data.board.color} rounded-t-medium px-4 text-sm`,
                  )}
                  radius="none"
                  size="sm"
                  key={index}
                  onClick={() => setSelectedBoard(data.name, data.board)}
                >
                  {data.name}
                </Button>
              );
            })}
            <Tooltip content="New board" delay={750} size="sm" radius="none">
              <Button
                variant="ghost"
                className="rounded-t-medium"
                radius="none"
                size="sm"
                aria-label="Create new board"
                onClick={createBoard}
              >
                <FaPlus />
              </Button>
            </Tooltip>
          </div>
          <Divider className={`${selectedBoard.color} h-1`} />
        </div>
      </ScrollShadow>
    </>
  );
}
