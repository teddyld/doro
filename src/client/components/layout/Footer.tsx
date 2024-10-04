import React from "react";
import { Button, Divider } from "@nextui-org/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <Divider />
      <footer className="relative z-50 flex h-16 items-center gap-8 bg-background/50 px-4">
        <Button
          isIconOnly
          variant="ghost"
          color="primary"
          as="a"
          aria-label="Github Link"
          onClick={() =>
            window.open("https://github.com/teddyld/leet-board", "_blank")
          }
        >
          <FaGithub />
        </Button>
      </footer>
    </>
  );
}
