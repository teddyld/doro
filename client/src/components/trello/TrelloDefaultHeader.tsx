import { Divider, Button, Tooltip } from "@nextui-org/react";
import { FaInfoCircle } from "react-icons/fa";

export default function TrelloDefaultHeader() {
  return (
    <>
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">Your board</h3>
        <Tooltip
          content="Create an account or login to create and save your boards"
          delay={0}
          radius="none"
        >
          <Button
            isIconOnly
            aria-label="Information about user boards"
            size="sm"
            variant="ghost"
          >
            <FaInfoCircle className="text-lg" />
          </Button>
        </Tooltip>
      </div>
      <Divider className="mb-4 h-1" />
    </>
  );
}
