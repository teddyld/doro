import { useTheme } from "next-themes";
import { Button, ButtonGroup } from "@nextui-org/react";

import { MdDarkMode, MdLightMode } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";

export default function PreferencesSettings() {
  const { theme, setTheme } = useTheme();

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
            className={theme === "dark" ? "bg-primary" : ""}
            onClick={() => setTheme("dark")}
          >
            <MdDarkMode />
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
