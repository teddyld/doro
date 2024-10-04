import React from "react";
import { Select, SelectItem, Slider } from "@nextui-org/react";
import { alarmSelection } from "../../utils/alarmSounds";
import { useDoroStore } from "../../store";
import { IoMdVolumeHigh } from "react-icons/io";

export default function SoundSettings() {
  const doroAlarm = useDoroStore((state) => state.doroAlarm);
  const setDoroAlarm = useDoroStore((state) => state.setDoroAlarm);

  const [audio, _] = React.useState<HTMLAudioElement>(new Audio());
  const [volume, setVolume] = React.useState(doroAlarm.volume * 100);

  const defaultValue = [
    alarmSelection.find((item) => item.sfx === doroAlarm.sound)?.key,
  ];

  const handleAlarmPreview = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = alarmSelection.findIndex(
      (alarm) => alarm.key == e.target.value,
    );
    const sound = alarmSelection[index]["sfx"];
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
    setDoroAlarm(audio.src, audioVolume);
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
          items={alarmSelection}
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
