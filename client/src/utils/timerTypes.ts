export enum TimerType {
  Pomodoro,
  Short,
  Long,
}

import DigitalSfx from "../assets/sounds/digital.mp3";
import BellsSfx from "../assets/sounds/bells.mp3";
import SingingBowlSfx from "../assets/sounds/singingbowl.mp3";
import KalimbaSfx from "../assets/sounds/kalimba.mp3";

export const alarmTypes = [
  { key: "digital", label: "Digital", sfx: DigitalSfx },
  { key: "singingbowl", label: "Singing Bowl", sfx: SingingBowlSfx },
  { key: "bells", label: "Bells", sfx: BellsSfx },
  { key: "kalimba", label: "Kalimba", sfx: KalimbaSfx },
];

export const timerData = [
  { name: "Pomodoro", id: "pomodoro", type: TimerType.Pomodoro },
  { name: "Short Break", id: "short", type: TimerType.Short },
  { name: "Long Break", id: "long", type: TimerType.Long },
];
