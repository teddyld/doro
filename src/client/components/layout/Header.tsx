import { useMediaQuery } from "react-responsive";
import { useDisclosure, Button } from "@nextui-org/react";
import { IoMdSettings, IoIosStats } from "react-icons/io";

import ModalStatistics from "../settings/ModalStatistics";
import ModalSettings from "../settings/ModalSettings";
import DropdownUser from "../settings/DropdownUser";

import { useDoroStore } from "../../store";

import DoroStatic from "../../assets/doro-static.gif";
import DoroGif from "../../assets/doro-spin.gif";

import { clsx } from "clsx";

export default function Header() {
  const settingsModal = useDisclosure();
  const statsModal = useDisclosure();

  const doroSpinning = useDoroStore((state) => state.doroSpinning);

  const removeTitle = useMediaQuery({ query: "(min-width: 516px)" });
  return (
    <header className="z-50 flex h-16 items-center justify-between bg-transparent px-4 backdrop-blur-md">
      {doroSpinning ? (
        <img src={DoroGif} alt="Doro" className="h-16 w-16" />
      ) : (
        <img src={DoroStatic} alt="Doro" className="h-16 w-16" />
      )}

      <h1
        className={clsx(removeTitle ? "block" : "hidden", "text-xl lg:pl-32")}
      >
        Pomo<span className="text-primary">doro</span>
      </h1>
      <div className="flex gap-2">
        <Button
          startContent={<IoIosStats />}
          onClick={statsModal.onOpen}
          variant="ghost"
        >
          Stats
        </Button>
        <Button
          startContent={<IoMdSettings />}
          onClick={settingsModal.onOpen}
          variant="ghost"
        >
          Settings
        </Button>
        <DropdownUser />
      </div>

      <ModalStatistics
        isOpen={statsModal.isOpen}
        onClose={statsModal.onClose}
      />
      <ModalSettings
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
      />
    </header>
  );
}
