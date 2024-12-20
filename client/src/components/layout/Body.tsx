import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Timer from "../Timer";
import Trello from "../trello/Trello";
import { useAuthStore, useBoardStore } from "../../store";
import { Spinner } from "@nextui-org/react";

export default function Body() {
  // Obtain user boards
  const user = useAuthStore((state) => state.user);
  const token = user.token;
  const setSelectedBoard = useBoardStore((state) => state.setSelectedBoard);
  const setUserBoards = useBoardStore((state) => state.setUserBoards);

  const { isPending, data } = useQuery({
    queryKey: ["boards"],
    queryFn: () => axios.get(`/boards/${token}`).then((res) => res.data),
  });

  // Set active board
  React.useEffect(() => {
    if (!isPending) {
      const boards = data.boards;
      if (boards.length > 0) {
        setSelectedBoard(boards[0].name, boards[0].board);
      }
      setUserBoards(boards);
    }
  }, [isPending]);

  return (
    <main className="flex-1" role="main">
      <div className="flex flex-col justify-center">
        <Timer />
        {isPending ? (
          <div className="flex justify-center p-8 pt-16">
            <Spinner />
          </div>
        ) : (
          <Trello />
        )}
      </div>
    </main>
  );
}
