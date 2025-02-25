import { clsx } from "clsx";
import { useMediaQuery } from "react-responsive";
import { useDisclosure, Button } from "@nextui-org/react";
import { IoMdSettings, IoIosStats } from "react-icons/io";

import ModalStatistics from "../settings/ModalStatistics";
import ModalSettings from "../settings/ModalSettings";
import DropdownUser from "../settings/DropdownUser";

export default function Header() {
  const settingsModal = useDisclosure();
  const statsModal = useDisclosure();

  const removeTitle = useMediaQuery({ query: "(min-width: 516px)" });
  return (
    <header className="z-50 flex h-16 items-center justify-between bg-transparent px-4 backdrop-blur-md">
      <div />
      <h1
        className={clsx(removeTitle ? "block" : "hidden", "text-2xl lg:pl-32")}
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
