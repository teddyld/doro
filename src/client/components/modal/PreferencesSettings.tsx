import { Button, ButtonGroup, Switch } from "@nextui-org/react";

import { MdDarkMode, MdLightMode } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";

import { useTheme } from "next-themes";
import { useDoroStore } from "../../store";

export default function PreferencesSettings() {
  const { theme, setTheme } = useTheme();

  const doroSpinning = useDoroStore((state) => state.doroSpinning);
  const setDoroSpinning = useDoroStore((state) => state.setDoroSpinning);
  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <BiSolidCustomize />
        <h2>Preferences</h2>
      </div>
      <div className="flex items-center justify-between">
        <p>Theme</p>
        <ButtonGroup variant="shadow">
          <Button
            isIconOnly
            className={theme === "light" ? "bg-primary" : ""}
            onClick={() => setTheme("light")}
          >
            <MdLightMode />
          </Button>
          <Button
            isIconOnly
            className={theme === "dark" ? "bg-secondary" : ""}
            onClick={() => setTheme("dark")}
          >
            <MdDarkMode />
          </Button>
        </ButtonGroup>
      </div>
      <div className="flex items-center justify-between">
        <p>Doro spins</p>
        <Switch
          aria-label="Spinning Doro"
          isSelected={doroSpinning}
          onValueChange={setDoroSpinning}
        />
      </div>
    </>
  );
}
