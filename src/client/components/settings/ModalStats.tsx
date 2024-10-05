import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  Switch,
} from "@nextui-org/react";

export default function ModalStats({
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
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex justify-center border-b-[1px] border-primary text-xl">
          Your Statistics
        </ModalHeader>
        <ModalBody className="py-6"></ModalBody>
        <ModalFooter className="border-t-[1px] border-secondary">
          <Button onPress={onClose}>Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
