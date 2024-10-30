import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import ActivityStatistics from "./ActivityStatistics";
import ModalLoginWarning from "./ModalLoginWarning";
import { useAuthStore } from "../../store";

export default function ModalStatistics({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const warningModal = useDisclosure();

  const [hide, setHide] = React.useState(
    JSON.parse(localStorage.getItem("hideWarning") as string) || false,
  );

  const hideWarning = () => {
    localStorage.setItem("hideWarning", "true");
    setHide(true);
  };

  React.useEffect(() => {
    if (!loggedIn && isOpen && !hide) {
      warningModal.onOpen();
    }
  }, [loggedIn, isOpen]);

  return (
    <>
      <ModalLoginWarning
        isOpen={warningModal.isOpen}
        onClose={warningModal.onClose}
        hideWarning={hideWarning}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        scrollBehavior="outside"
        backdrop="transparent"
        size="xl"
      >
        <ModalContent className="relative">
          <ModalHeader className="flex justify-center border-b-[1px] border-primary text-xl">
            Your Statistics
          </ModalHeader>
          <ModalBody className="py-6">
            <ActivityStatistics />
          </ModalBody>
          <ModalFooter className="border-t-[1px] border-primary">
            <Button onPress={onClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
