import React from "react";
import axios from "axios";
import { toast } from "sonner";

import { TimerType } from "../utils/timerTypes";
import { useDoroStore, useAuthStore } from "../store";

export const useTimerController = (
  timeInterval: NodeJS.Timeout | null,
  setTime: React.Dispatch<React.SetStateAction<number>>,
) => {
  const doroBreaks = useDoroStore((state) => state.doroBreaks);
  const doroTimer = useDoroStore((state) => state.doroTimer);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const [paused, setPaused] = React.useState(true);
  const [start, setStart] = React.useState(false);
  const [reset, setReset] = React.useState(false);
  const [autoStart, setAutoStart] = React.useState(false);
  const [long, setLong] = React.useState(doroBreaks.longInterval);
  const [selected, setSelected] = React.useState(TimerType.Pomodoro);

  // Update long break interval when changed in settings
  React.useEffect(() => {
    setLong(doroBreaks.longInterval);
  }, [doroBreaks]);

  // Update timer when changed in settings
  React.useEffect(() => {
    if (selected === TimerType.Pomodoro) {
      setTime(doroTimer.pomodoro);
    } else if (selected === TimerType.Short) {
      setTime(doroTimer.short);
    } else {
      setTime(doroTimer.long);
    }
  }, [doroTimer]);

  const called = React.useRef(false);

  const updateActivity = async () => {
    try {
      const token = user.token || null;
      const hours = doroTimer.pomodoro / 3600;

      if (called.current) return; // prevent rerender caused by StrictMode
      called.current = true;

      if (!token) return;
      await axios.put("/activity/doro-timer", { token, hours });
    } catch (err) {
      toast.error(err as string);
      setUser({
        name: "",
        token: "",
      });
      setLoggedIn(false);
    }
  };

  // Control timer button
  const handleTimer = () => {
    // Reset timer
    if (reset) {
      setTimeToType(selected);
      setReset(false);
      setPaused(true);
      setStart(false);
    } else {
      // Start timer and control pause/unpause
      setStart(true);
      setPaused(!paused);
    }
  };

  const setTimeToType = (timerType: number) => {
    let time;
    if (timerType === TimerType.Pomodoro) {
      time = doroTimer.pomodoro;
    } else if (timerType === TimerType.Short) {
      time = doroTimer.short;
    } else {
      time = doroTimer.long;
    }
    setTime(time);
    setSelected(timerType);
  };

  // Handle autostart functionality
  const handleTimerFinish = async () => {
    // Autostart breaks enabled and current timer is a Pomodoro
    if (doroBreaks.autoBreak && selected === TimerType.Pomodoro) {
      // Check if long interval meets long break condition
      setLong((prev) => prev - 1);
      if (long - 1 <= 0) {
        setTimeToType(TimerType.Long);
        setLong(doroBreaks.longInterval);
      } else {
        // Autostart short break
        setTimeToType(TimerType.Short);
      }
      setAutoStart(!autoStart);
    } else if (doroBreaks.autoDoro && selected !== TimerType.Pomodoro) {
      // Autostart pomodoro
      setTimeToType(TimerType.Pomodoro);
      setAutoStart(!autoStart);
    } else {
      setReset(true);
    }
    updateActivity();
  };

  // Handle timer type selection
  const handleTimerSelection = (timerType: number) => {
    if (timerType === selected) return;

    if (timeInterval) {
      clearInterval(timeInterval);
    }

    setTimeToType(timerType);
    setReset(false);
    setStart(false);
    setPaused(true);
  };

  return {
    selected,
    start,
    paused,
    reset,
    autoStart,
    handleTimer,
    handleTimerFinish,
    handleTimerSelection,
  };
};
