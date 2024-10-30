import React from "react";
import { useDoroStore } from "../store";

export const useTimer = () => {
  const doroTimer = useDoroStore((state) => state.doroTimer);

  const [time, setTime] = React.useState(doroTimer.pomodoro);
  const [timeInterval, setTimeInterval] = React.useState<NodeJS.Timeout | null>(
    null,
  );

  // Manage time (number) conversion to string
  const timeStr = React.useMemo(() => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time / 60) % 60);
    const seconds = time % 60;
    const string =
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds);
    return string;
  }, [time]);

  return {
    timeStr,
    setTime,
    timeInterval,
    setTimeInterval,
  };
};
