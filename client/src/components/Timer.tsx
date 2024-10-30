import React from "react";
import { Button, ButtonGroup } from "@nextui-org/react";

import { useAudio } from "../hooks/useAudio";
import { useTimer } from "../hooks/useTimer";
import { useTimerController } from "../hooks/useTimerController";
import { timerData } from "../utils/timerTypes";

export default function Timer() {
  const audio = useAudio();
  const { timeStr, setTime, timeInterval, setTimeInterval } = useTimer();
  const {
    selected,
    start,
    paused,
    reset,
    autoStart,
    handleTimer,
    handleTimerFinish,
    handleTimerSelection,
  } = useTimerController(timeInterval, setTime);

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

  return (
    <div className="mt-8 flex w-full flex-col items-center justify-center gap-8 rounded-lg border-2 p-16">
      <ButtonGroup variant="bordered">
        {timerData.map((data, i) => {
          return (
            <Button
              key={`timer-${i}`}
              onClick={() => handleTimerSelection(data.type)}
              className={
                selected === data.type
                  ? "bg-primary font-semibold"
                  : "hover:bg-card"
              }
            >
              {data.name}
            </Button>
          );
        })}
      </ButtonGroup>
      <h2 className="text-7xl font-semibold tracking-wider">{timeStr}</h2>
      <Button
        color="primary"
        variant="solid"
        size="lg"
        onClick={handleTimer}
        className={paused ? "" : "shadow-lg"}
      >
        {reset ? "Reset" : start ? (paused ? "Resume" : "Pause") : "Start"}
      </Button>
    </div>
  );
}
