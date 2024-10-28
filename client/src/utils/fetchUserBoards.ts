import { useBoardStore } from "../store";
import axios from "axios";

export const fetchUserBoards = async (token: string | null) => {
  const { boards } = await axios
    .get(`/boards/${token}`)
    .then((res) => res.data);

  if (boards.length > 0) {
    useBoardStore.getState().setSelectedBoard(boards[0].name, boards[0].board);
  }
  useBoardStore.getState().setUserBoards(boards);
};
