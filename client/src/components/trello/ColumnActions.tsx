import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { BiRename } from "react-icons/bi";

export default function ColumnActions({
  deleteColumn,
  setTextArea,
}: {
  deleteColumn: () => void;
  setTextArea: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dropdown showArrow>
      <Tooltip content="List actions" delay={1000} size="sm" radius="none">
        <div>
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              aria-label="Open list actions"
            >
              <BsThreeDots />
            </Button>
          </DropdownTrigger>
        </div>
      </Tooltip>
      <DropdownMenu aria-label="List Actions" variant="flat">
        <DropdownSection
          title="List Actions"
          classNames={{
            heading: "flex justify-center",
          }}
          showDivider
        >
          <DropdownItem
            key="rename-column"
            startContent={<BiRename />}
            onClick={() => setTextArea(true)}
          >
            Rename
          </DropdownItem>
        </DropdownSection>
        <DropdownItem
          key="delete-column"
          color="danger"
          className="text-danger"
          startContent={<FaTrashAlt />}
          onClick={deleteColumn}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
