import React from "react";
import clsx from "clsx";
import { toast } from "sonner";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  DropdownSection,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { IoMdClose, IoIosColorPalette } from "react-icons/io";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { BiRename } from "react-icons/bi";
import { FaCheck } from "react-icons/fa6";

import { BoardType, labelData, labelToColor } from "./boardData";
import { useBoardStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";

type TrelloTitleCardType = {
  board: BoardType;
  boardNames: string[];
  boardName: string;
  deleteBoard: (boardName: string) => void;
  renameBoard: (boardName: string, newBoardName: string) => void;
  updateColor: (
    boardName: string,
    board: BoardType,
    boardColor: string,
  ) => void;
};

export default function TrelloTitleItem({
  board,
  boardNames,
  boardName,
  deleteBoard,
  renameBoard,
  updateColor,
}: TrelloTitleCardType) {
  const [contextVisible, setContextVisible] = React.useState(false);
  const selectedBoard = useBoardStore((state) => state.selectedBoard);
  const setSelectedBoard = useBoardStore((state) => state.setSelectedBoard);

  const [title, setTitle] = React.useState(boardName);
  const [textArea, setTextArea] = React.useState(false);
  const [showColors, setShowColors] = React.useState(false);
  const { theme } = useTheme();

  const textAreaRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(textAreaRef, () => {
    changeTitle();
  });

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    closeDropdown();
  });

  // Open ContextMenu containing board title actions (i.e. delete and edit)
  const handleTitleActions = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setSelectedBoard(boardName, board);
    setContextVisible(true);
  };

  // Truncate title to only 32 characters
  const handleTitleChange = (value: string) => {
    if (value.length > 32) return;
    setTitle(value);
  };

  // Edit title on "Enter" key in textarea
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeTitle();
    }
  };

  const changeTitle = () => {
    closeDropdown();
    // Handle error states
    setTextArea(false);
    const newBoardName = title.trim();
    if (newBoardName === selectedBoard.name) {
      return;
    }

    if (newBoardName === "") {
      toast.error("Board title cannot be left blank.");
      setTitle(boardName);
      return;
    } else if (boardNames.includes(newBoardName)) {
      setTitle(boardName);
      toast.error(`There is already a board with that name. Please try again`);
      return;
    }

    renameBoard(boardName, newBoardName);
  };

  const closeDropdown = () => {
    setShowColors(false);
    setContextVisible(false);
  };

  return (
    <>
      {textArea ? (
        <div ref={textAreaRef}>
          <Textarea
            aria-label="edit-board-title-textarea"
            maxRows={1}
            className={`${board.color} min-w-36 rounded-t-medium`}
            classNames={{
              inputWrapper: `${board.color} rounded-t-medium rounded-b-none px-4 py-0 border-primary border-1`,
              input: "whitespace-nowrap",
            }}
            value={title}
            onValueChange={(value) => handleTitleChange(value)}
            onKeyDown={handleEnterKey}
          />
        </div>
      ) : (
        <div ref={dropdownRef}>
          <Dropdown
            isOpen={contextVisible}
            shouldCloseOnInteractOutside={() => true}
            className="rounded-none"
          >
            <DropdownTrigger>
              <Button
                className={clsx(
                  boardName === selectedBoard.name
                    ? "h-9 font-semibold"
                    : "h-8",
                  `${labelToColor(board.color, theme)} relative rounded-t-medium px-4 text-sm`,
                )}
                radius="none"
                size="sm"
                onClick={() => setSelectedBoard(boardName, board)}
                onContextMenu={handleTitleActions}
              >
                {boardName}
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat">
              <DropdownSection showDivider>
                <DropdownItem
                  key="rename-board"
                  startContent={<BiRename className="text-xl" />}
                  onClick={() => setTextArea(true)}
                >
                  Rename
                </DropdownItem>
                <DropdownItem
                  key="change-board-color"
                  closeOnSelect={false}
                  isReadOnly
                  textValue="Change board color"
                  className="p-0"
                >
                  <Popover className="w-full" placement="right-start">
                    <PopoverTrigger>
                      <Button
                        aria-label="Change board color"
                        className="flex w-full justify-between p-2"
                        variant="light"
                        onClick={() => setShowColors(!showColors)}
                      >
                        <div className="flex items-center gap-2">
                          <IoIosColorPalette className="text-xl" />
                          Board color
                        </div>
                        {showColors ? <FaChevronLeft /> : <FaChevronRight />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="rounded-none p-0">
                      <div className="w-32">
                        {labelData.map((label) => {
                          return (
                            <Button
                              fullWidth
                              radius="none"
                              variant="light"
                              key={`board-color-${label.name}`}
                              className={clsx(
                                board.color === label.name ? "bg-card" : "",
                                "flex items-center justify-start",
                              )}
                              onClick={() => {
                                closeDropdown();
                                updateColor(boardName, board, label.name);
                              }}
                            >
                              <div className={`h-4 w-4 ${label.color}`} />
                              {label.name}
                              {board.color === label.name ? (
                                <FaCheck className="ml-2" />
                              ) : (
                                <></>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </DropdownItem>
              </DropdownSection>
              <DropdownItem
                key="delete-board"
                startContent={<IoMdClose className="text-xl" />}
                onClick={() => {
                  closeDropdown();
                  deleteBoard(boardName);
                }}
                color="danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </>
  );
}
