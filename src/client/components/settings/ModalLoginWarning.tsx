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
  setHide,
}: {
  isOpen: boolean;
  onClose: () => void;
  setHide: React.Dispatch<React.SetStateAction<boolean>>;
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
          Your statistics won't be saved!
        </ModalHeader>
        <ModalBody className="py-6">
          <p>
            Only the{" "}
            <span className="font-bold">current session's statistics</span> will
            be tracked. To save and track your statistics forever, login or
            register an account with Doro.
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
              setHide(true);
            }}
          >
            Don't show again
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
