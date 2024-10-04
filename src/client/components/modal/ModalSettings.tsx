import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

import TimerSettings from "./TimerSettings";
import SoundSettings from "./SoundSettings";
import PreferencesSettings from "./PreferencesSettings";

export default function ModalSettings({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      scrollBehavior="outside"
      backdrop="transparent"
      size="sm"
    >
      <ModalContent>
        <ModalHeader className="flex justify-center border-b-[1px] border-primary text-xl">
          Settings
        </ModalHeader>
        <ModalBody className="py-6">
          <TimerSettings />
          <SoundSettings />
          <PreferencesSettings />
        </ModalBody>
        <ModalFooter className="border-t-[1px] border-primary">
          <Button onPress={onClose}>Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
