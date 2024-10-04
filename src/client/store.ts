import { create } from "zustand";
import { alarmSelection } from "./utils/alarmSounds";

/* 
  Validate "doroAlarm" state key-values from localStorage
*/
const validDoroAlarm = () => {
  if (!localStorage.getItem("doroAlarm")) return false;
  const doroAlarm = JSON.parse(localStorage.getItem("doroAlarm") as string);
  const sfx = doroAlarm.sound;
  const volume = doroAlarm.volume;

  if (
    alarmSelection.map((a) => a.sfx).includes(sfx) &&
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
  doroSpinning: boolean;
  setDoroSpinning: () => void;
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
  doroSpinning: localStorage.getItem("doroSpinning")
    ? localStorage.getItem("doroSpinning") === "true"
    : true,
  setDoroSpinning: () => {
    set((state) => {
      localStorage.setItem("doroSpinning", JSON.stringify(!state.doroSpinning));
      return {
        doroSpinning: !state.doroSpinning,
      };
    });
  },
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
