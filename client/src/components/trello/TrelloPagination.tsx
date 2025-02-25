import React from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Divider,
  Button,
  Tooltip,
  ScrollShadow,
  Spinner,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { FaPlus } from "react-icons/fa";

import TrelloTitleItem from "./TrelloTitleItem";

import { BoardType, UserBoardsType, labelToColor } from "./boardData";
import { useBoardStore, useAuthStore } from "../../store";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";

export default function TrelloPagination({
  userBoards,
}: {
  userBoards: UserBoardsType[];
}) {
  const setUserBoards = useBoardStore((state) => state.setUserBoards);

  const setBoard = useBoardStore((state) => state.setBoard);
  const selectedBoard = useBoardStore((state) => state.selectedBoard);
  const setSelectedBoard = useBoardStore((state) => state.setSelectedBoard);
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  const user = useAuthStore((state) => state.user);
  const token = user.token;

  const { theme } = useTheme();

  const [loading, setLoading] = React.useState(false);

  // Create a new empty board
  const createBoard = async () => {
    try {
      setLoading(true);

      const data = await axios.post("/board/create", { token }).then((res) => {
        setLoading(false);
        return res.data;
      });

      toast.success("Board created successfully.");

      // Add board to client-side user boards
      const newUserBoards = Array.from(userBoards);
      newUserBoards.push({ name: data.boardName, board: data.board });
      setUserBoards(newUserBoards);
    } catch (err) {
      toast.error(err as string);
    }
  };

  // Delete user board
  const deleteBoard = async (boardName: string) => {
    try {
      await axios.delete("/board/delete", { data: { token, boardName } });

      // Set new board as previous
      const indexOfBoard = userBoards
        .map((board) => board.name)
        .indexOf(boardName);

      if (indexOfBoard > 0) {
        setSelectedBoard(
          userBoards[indexOfBoard - 1].name,
          userBoards[indexOfBoard - 1].board,
        );
      }

      toast.success("Board deleted successfully.");
      // Remove from client-side user boards
      const newUserBoards = Array.from(userBoards);
      newUserBoards.splice(indexOfBoard, 1);
      setUserBoards(newUserBoards);
    } catch (err) {
      toast.error(err as string);
    }
  };

  // Rename user board
  const renameBoard = async (boardName: string, newBoardName: string) => {
    try {
      await axios.put("/board/update/title", {
        token,
        boardName,
        newBoardName,
      });

      toast.success("Updated successfully!");

      // Update client-side user board
      const indexOfBoard = userBoards
        .map((board) => board.name)
        .indexOf(boardName);

      const newUserBoards = Array.from(userBoards);
      newUserBoards[indexOfBoard].name = newBoardName;
      setUserBoards(newUserBoards);
    } catch (err) {
      toast.error(err as string);
    }
  };

  // Update color of user board
  const updateColor = (
    boardName: string,
    board: BoardType,
    boardColor: string,
  ) => {
    const newBoard = {
      ...board,
      color: boardColor,
    };
    setBoard(newBoard);
    setSelectedBoard(boardName, newBoard);

    // Update client-side user boards
    const indexOfBoard = userBoards
      .map((board) => board.name)
      .indexOf(boardName);

    const newUserBoards = Array.from(userBoards);
    newUserBoards[indexOfBoard].board.color = boardColor;
    setUserBoards(newUserBoards);
  };

  return (
    <>
      <ScrollShadow
        size={0}
        orientation="horizontal"
        ref={scrollRef}
        className="flex"
        hideScrollBar
      >
        <div className="flex items-end gap-2">
          {userBoards.map((data: UserBoardsType, index: number) => {
            return (
              <TrelloTitleItem
                board={data.board}
                boardNames={userBoards.map((board) => board.name)}
                boardName={data.name}
                deleteBoard={deleteBoard}
                renameBoard={renameBoard}
                updateColor={updateColor}
                key={index}
              />
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
              {loading ? <Spinner size="sm" /> : <FaPlus />}
            </Button>
          </Tooltip>
        </div>
      </ScrollShadow>
      <Divider
        className={`${labelToColor(selectedBoard.color, theme)} mb-4 h-1`}
      />
    </>
  );
}
