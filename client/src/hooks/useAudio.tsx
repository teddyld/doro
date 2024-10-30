import React from "react";
import { useDoroStore } from "../store";

export const useAudio = () => {
  const doroAlarm = useDoroStore((state) => state.doroAlarm);

  const [audio, _] = React.useState<HTMLAudioElement>(new Audio());

  // Persist state changes in current component when settings change
  React.useEffect(() => {
    audio.src = doroAlarm.sound;
    audio.volume = doroAlarm.volume;
  }, [doroAlarm]);
  return audio;
};
