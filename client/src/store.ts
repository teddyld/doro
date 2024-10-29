import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { alarmTypes } from "./utils/timerTypes";
import { UserBoardsType } from "./components/trello/boardData";
import { fetchUserBoards } from "./utils/fetchUserBoards";

/* 
  Validate "doroAlarm" state key-values from localStorage
*/
const validDoroAlarm = () => {
  if (!localStorage.getItem("doroAlarm")) return false;
  const doroAlarm = JSON.parse(localStorage.getItem("doroAlarm") as string);
  const sfx = doroAlarm.sound;
  const volume = doroAlarm.volume;

  if (
    alarmTypes.map((a) => a.sfx).includes(sfx) &&
    typeof volume == "number" &&
    volume >= 0 &&
    volume <= 1.0
  ) {
    return true;
  }

  return false;
};

/* 
  Validate "doroTimer" state key-values from localStorage
*/
const validDoroTimer = () => {
  if (!localStorage.getItem("doroTimer")) return false;
  const doroTimer = JSON.parse(localStorage.getItem("doroTimer") as string);

  for (const key in doroTimer) {
    if (
      typeof doroTimer[key] !== "number" &&
      !["pomodoro", "short", "long"].includes(key)
    ) {
      return false;
    }
  }

  return true;
};

/* 
  Validate "doroBreaks" state key-values from localStorage
*/
const validDoroBreaks = () => {
  if (!localStorage.getItem("doroBreaks")) return false;
  const doroBreaks = JSON.parse(localStorage.getItem("doroBreaks") as string);
  const autoBreak = doroBreaks.autoBreak;
  const autoDoro = doroBreaks.autoDoro;
  const longInterval = doroBreaks.longInterval;

  if (
    typeof autoBreak !== "boolean" &&
    typeof autoDoro !== "boolean" &&
    typeof longInterval !== "number"
  )
    return false;

  return true;
};

type DoroState = {
  doroAlarm: {
    sound: string;
    volume: number;
  };
  setDoroAlarm: (sound: string, volume: number) => void;
  doroTimer: {
    pomodoro: number;
    short: number;
    long: number;
  };
  setDoroTimer: (pomodoro: number, short: number, long: number) => void;
  doroBreaks: {
    autoBreak: boolean;
    autoDoro: boolean;
    longInterval: number;
  };
  setDoroBreaks: (
    autoBreak: boolean,
    autoDoro: boolean,
    longInterval: number,
  ) => void;
};

export const useDoroStore = create<DoroState>((set) => ({
  doroAlarm: validDoroAlarm()
    ? JSON.parse(localStorage.getItem("doroAlarm") as string)
    : {
        sound: "/src/client/assets/sounds/digital.mp3",
        volume: 0.5,
      },
  setDoroAlarm: (sound, volume) => {
    set(() => {
      localStorage.setItem("doroAlarm", JSON.stringify({ sound, volume }));
      return {
        doroAlarm: {
          sound,
          volume,
        },
      };
    });
  },
  doroTimer: validDoroTimer()
    ? JSON.parse(localStorage.getItem("doroTimer") as string)
    : {
        pomodoro: 1500,
        short: 300,
        long: 900,
      },
  setDoroTimer: (pomodoro, short, long) => {
    set(() => {
      localStorage.setItem(
        "doroTimer",
        JSON.stringify({ pomodoro, short, long }),
      );
      return {
        doroTimer: {
          pomodoro,
          short,
          long,
        },
      };
    });
  },
  doroBreaks: validDoroBreaks()
    ? JSON.parse(localStorage.getItem("doroBreaks") as string)
    : {
        autoBreak: false,
        autoDoro: false,
        longInterval: 4,
      },
  setDoroBreaks: (autoBreak, autoDoro, longInterval) => {
    set(() => {
      localStorage.setItem(
        "doroBreaks",
        JSON.stringify({ autoBreak, autoDoro, longInterval }),
      );
      return {
        doroBreaks: {
          autoBreak,
          autoDoro,
          longInterval,
        },
      };
    });
  },
}));

type User = {
  name: string;
  token: string | null;
};

type AuthState = {
  user: User;
  setUser: (user: User) => void;
  loggedIn: boolean;
  setLoggedIn: (login: boolean) => void;
  checkLoginState: () => void;
};

/* 
  Validate user from localStorage
*/
const validUser = () => {
  if (!localStorage.getItem("user")) return false;

  const { name, token } = JSON.parse(localStorage.getItem("user") as string);
  if (!name || !token) {
    return false;
  }

  return true;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: validUser()
    ? JSON.parse(localStorage.getItem("user") as string)
    : {
        name: "",
        token: null,
      },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set(() => {
      return {
        user: user,
      };
    });
  },
  loggedIn: validUser(),
  setLoggedIn: (login) => {
    if (login === false) {
      localStorage.removeItem("user");
      useAuthStore.getState().setUser({
        name: "",
        token: null,
      });
      useBoardStore.getState().setUserBoards([]);
      useBoardStore.getState().setBoard(defaultBoard);
    } else {
      const token = useAuthStore.getState().user.token;
      fetchUserBoards(token);
    }

    set(() => {
      return {
        loggedIn: login,
      };
    });
  },
  checkLoginState: async () => {
    try {
      const {
        data: { loggedIn: logged_in, name, token },
      } = await axios.get("/auth/logged_in");

      const user = {
        name: name || "",
        token: token || "",
      };

      localStorage.setItem("user", JSON.stringify(user));
      name && useAuthStore.getState().setUser(user);
      useAuthStore.getState().setLoggedIn(logged_in);
    } catch (err) {
      toast.error(err as string);
    }
  },
}));

import { BoardType, defaultBoard } from "./components/trello/boardData";

export type SelectBoardType = {
  name: string;
  color: string;
};

type BoardState = {
  userBoards: UserBoardsType[];
  setUserBoards: (boards: UserBoardsType[]) => void;
  board: BoardType;
  setBoard: (board: BoardType) => void;
  selectedBoard: SelectBoardType;
  setSelectedBoard: (name: string, board: BoardType) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  userBoards: [], // Facilitate client-side fetching of boards
  setUserBoards: (boards) => {
    set(() => {
      return {
        userBoards: boards,
      };
    });
  },
  board: defaultBoard,
  setBoard: (board) => {
    // Write board to DB
    const user = useAuthStore.getState().user;
    const token = user.token;
    const boardName = useBoardStore.getState().selectedBoard.name;

    if (token) {
      axios
        .put("/board/update", { token, board, boardName })
        .then(() => {
          // Update client-side user boards
          const userBoards = useBoardStore.getState().userBoards;
          const setUserBoards = useBoardStore.getState().setUserBoards;

          const indexOfBoard = userBoards
            .map((value) => value.name)
            .indexOf(boardName);

          const newUserBoards = Array.from(userBoards);
          newUserBoards[indexOfBoard].board = board;
          setUserBoards(newUserBoards);
        })
        .catch((_) => {
          // swallow error
        });
    }

    set(() => {
      return {
        board: board,
      };
    });
  },
  selectedBoard: {
    name: "",
    color: "",
  },
  setSelectedBoard: async (name, board) => {
    set(() => {
      return {
        selectedBoard: {
          name: name,
          color: board.color,
        },
        board: board,
      };
    });
  },
}));
