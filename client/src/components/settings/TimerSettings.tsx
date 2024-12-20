import React from "react";
import { Input, Switch } from "@nextui-org/react";
import { IoIosTimer } from "react-icons/io";
import { useDoroStore } from "../../store";
import { timerData } from "../../utils/timerTypes";

type TimeState = {
  pomodoro: string;
  short: string;
  long: string;
};

export default function TimerSettings() {
  const doroTimer = useDoroStore((state) => state.doroTimer);
  const setDoroTimer = useDoroStore((state) => state.setDoroTimer);

  const doroBreaks = useDoroStore((state) => state.doroBreaks);
  const setDoroBreaks = useDoroStore((state) => state.setDoroBreaks);

  // Converts minutes -> seconds for each time
  const [timer, setTimer] = React.useState<TimeState>({
    pomodoro: (doroTimer.pomodoro / 60).toString(),
    short: (doroTimer.short / 60).toString(),
    long: (doroTimer.long / 60).toString(),
  });

  const [timerInvalid, setTimerInvalid] = React.useState({
    pomodoro: false,
    short: false,
    long: false,
  });

  const [longInterval, setLongInterval] = React.useState({
    interval: doroBreaks.longInterval.toString(),
    invalid: false,
  });

  // Update timer duration
  const handleTimer = (e: React.ChangeEvent<HTMLInputElement>) => {
    for (const key in timerInvalid) {
      timerInvalid[key as keyof TimeState] = false;
    }

    const timerType = e.target.id;
    let time = e.target.value;

    // Time cannot be less than a minute long
    if (parseInt(time) < 1) {
      return;
    } else if (!time) {
      time = "1";
      timerInvalid[timerType as keyof TimeState] = true;
    }

    setTimerInvalid({ ...timerInvalid });
    timer[timerType as keyof TimeState] = time;

    setTimer({ ...timer });

    // Convert minutes -> seconds
    const pomodoro = parseInt(timer.pomodoro) * 60;
    const short = parseInt(timer.short) * 60;
    const long = parseInt(timer.long) * 60;

    setDoroTimer(pomodoro, short, long);
  };

  // Update long break interval
  const handleLongInterval = (e: React.ChangeEvent<HTMLInputElement>) => {
    longInterval.invalid = false;
    let interval = e.target.value;
    if (!interval) {
      interval = "1";
      longInterval.invalid = true;
    } else if (parseInt(interval) < 1) {
      return;
    }

    longInterval.interval = interval;
    setLongInterval({
      ...longInterval,
    });

    setDoroBreaks(
      doroBreaks.autoBreak,
      doroBreaks.autoDoro,
      parseInt(interval),
    );
  };

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <IoIosTimer />
        <h2>Timer</h2>
      </div>
      <p>Timer duration (minutes)</p>
      <div className="flex gap-2">
        {timerData.map((data, i) => {
          return (
            <Input
              key={`time-input-${i}`}
              type="number"
              label={data.name}
              id={data.id}
              radius="sm"
              className="text-nowrap"
              value={timer[data.id as keyof TimeState]}
              isInvalid={timerInvalid[data.id as keyof TimeState]}
              onChange={handleTimer}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <p>Autostart Breaks</p>
        <Switch
          isSelected={doroBreaks.autoBreak}
          aria-labelledby="autoBreak"
          id="autoBreak"
          onValueChange={(value) => {
            setDoroBreaks(value, doroBreaks.autoDoro, doroBreaks.longInterval);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p>Autostart Doros</p>
        <Switch
          isSelected={doroBreaks.autoDoro}
          aria-labelledby="autoDoro"
          id="autoDoro"
          onValueChange={(value) => {
            setDoroBreaks(doroBreaks.autoBreak, value, doroBreaks.longInterval);
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <p>Long Break Interval</p>
        <Input
          type="number"
          aria-label="Long Break Interval"
          className="w-16"
          value={longInterval.interval}
          isInvalid={longInterval.invalid}
          onChange={handleLongInterval}
        />
      </div>
    </>
  );
}
