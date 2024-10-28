import React from "react";
import { Select, SelectItem, Slider } from "@nextui-org/react";
import { IoMdVolumeHigh } from "react-icons/io";

import { alarmTypes } from "../../utils/timerTypes";
import { useDoroStore } from "../../store";

export default function SoundSettings() {
  const doroAlarm = useDoroStore((state) => state.doroAlarm);
  const setDoroAlarm = useDoroStore((state) => state.setDoroAlarm);

  const [audio, _] = React.useState<HTMLAudioElement>(new Audio());
  const [volume, setVolume] = React.useState(doroAlarm.volume * 100);

  const defaultValue = [
    alarmTypes.find((item) => item.sfx === doroAlarm.sound)?.key,
  ];

  const handleAlarmPreview = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = alarmTypes.findIndex((alarm) => alarm.key == e.target.value);
    const sound = alarmTypes[index]["sfx"];
    const audioVolume = (volume as number) / 100;
    setDoroAlarm(sound, audioVolume);

    audio.src = sound;
    audio.volume = audioVolume;
    audio.play().catch((e) => e);
  };

  const handleVolume = (sliderVolume: number) => {
    setVolume(sliderVolume);
    const audioVolume = sliderVolume / 100;
    audio.volume = audioVolume;
    setDoroAlarm(doroAlarm.sound, audioVolume);
  };

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <IoMdVolumeHigh />
        <h2>Sound</h2>
      </div>
      <div className="flex items-center justify-between">
        <p>Alarm Sound</p>
        <Select
          items={alarmTypes}
          disallowEmptySelection={true}
          aria-label="Alarm sound"
          variant="faded"
          defaultSelectedKeys={defaultValue as string[]}
          onChange={handleAlarmPreview}
          className="w-40"
        >
          {(alarm) => <SelectItem key={alarm.key}>{alarm.label}</SelectItem>}
        </Select>
      </div>
      <Slider
        label="Volume"
        step={1}
        minValue={0}
        maxValue={100}
        value={volume}
        onChange={(sliderVolume) => handleVolume(sliderVolume as number)}
        defaultValue={50}
      />
    </>
  );
}
