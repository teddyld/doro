import { useMediaQuery } from "react-responsive";
import { useDisclosure, Button } from "@nextui-org/react";
import { IoMdSettings, IoIosStats } from "react-icons/io";

import ModalStats from "../modal/ModalStats";
import ModalSettings from "../modal/ModalSettings";

import { useDoroStore } from "../../store";
import DoroStatic from "../../assets/doro-static.gif";
import DoroGif from "../../assets/doro-spin.gif";

export default function Header() {
  const settingsModal = useDisclosure();
  const statsModal = useDisclosure();
  const doroSpinning = useDoroStore((state) => state.doroSpinning);

  const removeTitle = useMediaQuery({ query: "(min-width: 420px)" });
  return (
    <header className="z-50 flex h-16 items-center justify-between bg-transparent px-4 backdrop-blur-md">
      {doroSpinning ? (
        <img src={DoroGif} alt="Doro" className="h-16 w-16" />
      ) : (
        <img src={DoroStatic} alt="Doro" className="h-16 w-16" />
      )}
      {removeTitle ? (
        <>
          <h1 className="text-xl lg:pl-32">
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
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button
            aria-label="Statistics"
            isIconOnly
            onClick={statsModal.onOpen}
            variant="ghost"
          >
            <IoIosStats />
          </Button>
          <Button
            aria-label="Settings"
            isIconOnly
            onClick={settingsModal.onOpen}
            variant="ghost"
          >
            <IoMdSettings />
          </Button>
        </div>
      )}

      <ModalStats isOpen={statsModal.isOpen} onClose={statsModal.onClose} />
      <ModalSettings
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
      />
    </header>
  );
}
