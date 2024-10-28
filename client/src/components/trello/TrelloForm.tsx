import React from "react";
import { Button, Textarea } from "@nextui-org/react";
import { IoIosClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function TrelloForm({
  onSubmit,
  item,
}: {
  onSubmit: (value: string) => void;
  item: string;
}) {
  const [value, setValue] = React.useState("");
  const [textArea, setTextArea] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);
  useClickOutside(formRef, () => {
    cancelSubmit();
  });

  // Cancel form action
  const cancelSubmit = () => {
    setValue("");
    setTextArea(false);
  };

  // Wrapper around form action
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    cancelSubmit();
    onSubmit(value);
  };

  // Create task on "Enter" key in textarea
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      cancelSubmit();
      onSubmit(value);
    }
  };

  return (
    <>
      {textArea ? (
        <form
          className="flex h-min min-w-60 flex-col gap-2 rounded-md bg-card p-2"
          onSubmit={onFormSubmit}
          ref={formRef}
        >
          <Textarea
            placeholder={`Enter a ${item} name`}
            aria-label={`New ${item}`}
            value={value}
            onValueChange={setValue}
            minRows={2}
            classNames={{
              inputWrapper: "bg-background",
            }}
            type="submit"
            onKeyDown={handleEnterKey}
          />
          <div className="flex gap-2">
            <Button color="primary" variant="solid" radius="sm" type="submit">
              Add {item}
            </Button>
            <Button
              isIconOnly
              variant="light"
              className="text-2xl hover:bg-background"
              onClick={cancelSubmit}
            >
              <IoIosClose />
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="light"
          className="min-w-60 justify-start bg-card/50"
          onClick={() => setTextArea(true)}
        >
          <FaPlus />
          Add a {item}
        </Button>
      )}
    </>
  );
}
