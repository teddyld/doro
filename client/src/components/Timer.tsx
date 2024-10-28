import React from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button, ButtonGroup } from "@nextui-org/react";

import { useDoroStore, useAuthStore } from "../store";
import { TimerType } from "../utils/timerTypes";

export default function Timer() {
  const doroAlarm = useDoroStore((state) => state.doroAlarm);
  const doroTimer = useDoroStore((state) => state.doroTimer);
  const doroBreaks = useDoroStore((state) => state.doroBreaks);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const [time, setTime] = React.useState(doroTimer.pomodoro);
  const [timeInterval, setTimeInterval] = React.useState<NodeJS.Timeout | null>(
    null,
  );

  const [long, setLong] = React.useState(doroBreaks.longInterval);
  const [paused, setPaused] = React.useState(true);
  const [start, setStart] = React.useState(false);
  const [autoStart, setAutoStart] = React.useState(false);
  const [selected, setSelected] = React.useState(TimerType.Pomodoro);

  const [audio, _] = React.useState<HTMLAudioElement>(new Audio());

  // Persist state changes in current component when settings change
  React.useEffect(() => {
    audio.src = doroAlarm.sound;
    audio.volume = doroAlarm.volume;
  }, [doroAlarm]);

  React.useEffect(() => {
    setLong(doroBreaks.longInterval);
  }, [doroBreaks]);

  React.useEffect(() => {
    if (selected === TimerType.Pomodoro) {
      setTime(doroTimer.pomodoro);
    } else if (selected === TimerType.Short) {
      setTime(doroTimer.short);
    } else {
      setTime(doroTimer.long);
    }
  }, [doroTimer]);

  const handleTimer = () => {
    setStart(true);
    setPaused(!paused);
  };

  React.useEffect(() => {
    if (start && !paused) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            // Timer finished
            clearInterval(interval);
            audio.play();
            handleTimerFinish();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      setTimeInterval(interval);
    } else if (paused) {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    }
  }, [start, paused, autoStart]);

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

  const handleTimerSelection = (timerType: number) => {
    if (timerType === selected) return;

    if (timeInterval) {
      clearInterval(timeInterval);
    }

    setTimeToType(timerType);
    setStart(false);
    setPaused(true);
  };

  // Handle autostart functionality
  const handleTimerFinish = async () => {
    // Autostart breaks enabled
    if (doroBreaks.autoBreak) {
      if (selected === TimerType.Pomodoro) {
        // Check if long interval meets long break condition
        if (long - 1 === 0) {
          setTimeToType(TimerType.Long);
          setLong(doroBreaks.longInterval);
        } else {
          // Autostart short break
          setTimeToType(TimerType.Short);
          setLong((prev) => prev - 1);
        }
      } else {
        // Autostart pomodoro
        setTimeToType(TimerType.Pomodoro);
      }
      setAutoStart(!autoStart);
    }
    updateActivity();
  };

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

  // Manage time (number) conversion to string
  const timeString = React.useMemo(() => {
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

  return (
    <div className="mt-8 flex w-full flex-col items-center justify-center gap-8 rounded-lg border-2 p-16">
      <ButtonGroup variant="bordered">
        <Button
          onClick={() => handleTimerSelection(TimerType.Pomodoro)}
          className={
            selected === TimerType.Pomodoro ? "bg-primary font-bold" : ""
          }
        >
          Pomodoro
        </Button>
        <Button
          onClick={() => handleTimerSelection(TimerType.Short)}
          className={selected === TimerType.Short ? "bg-primary font-bold" : ""}
        >
          Short Break
        </Button>
        <Button
          onClick={() => handleTimerSelection(TimerType.Long)}
          className={selected === TimerType.Long ? "bg-primary font-bold" : ""}
        >
          Long Break
        </Button>
      </ButtonGroup>
      <h2 className="text-7xl font-semibold tracking-wider">{timeString}</h2>
      <Button
        color="primary"
        variant="solid"
        size="lg"
        onClick={handleTimer}
        className={paused ? "" : "border-b-4 border-secondary"}
      >
        {start ? (paused ? "Resume" : "Pause") : "Start"}
      </Button>
    </div>
  );
}
