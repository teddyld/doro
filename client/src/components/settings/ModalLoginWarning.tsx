import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";

export default function ModalLoginWarning({
  isOpen,
  onClose,
  hideWarning,
}: {
  isOpen: boolean;
  onClose: () => void;
  hideWarning: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      scrollBehavior="outside"
      backdrop="blur"
      size="md"
      className="z-[100]"
    >
      <ModalContent>
        <ModalHeader className="flex justify-center border-b-[1px] border-primary text-xl">
          Activity is not available!
        </ModalHeader>
        <ModalBody className="py-6">
          <p className="text-center">
            Login or register an account with Doro to track your statistics.
          </p>
          <div className="flex justify-center gap-8 font-semibold">
            <Link
              className="cursor-pointer text-lg underline"
              onClick={() => navigate("/login")}
            >
              Login
            </Link>
            <Link
              className="cursor-pointer text-lg underline"
              onClick={() => navigate("/register")}
            >
              Register
            </Link>
          </div>
        </ModalBody>
        <ModalFooter className="border-t-[1px] border-primary">
          <Button
            onPress={() => {
              onClose();
              hideWarning();
            }}
          >
            Don't show again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
