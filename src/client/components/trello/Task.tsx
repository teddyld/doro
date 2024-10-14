import React from "react";
import { TaskType, labelToColor } from "./boardData";
import { Draggable } from "@hello-pangea/dnd";
import { Chip, Textarea } from "@nextui-org/react";
import clsx from "clsx";
import TaskActions from "./TaskActions";
import { useBoardStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function Task({
  task,
  index,
}: {
  task: TaskType;
  index: number;
}) {
  const board = useBoardStore((state) => state.board);
  const setBoard = useBoardStore((state) => state.setBoard);

  const [showAction, setShowAction] = React.useState(false);
  const [content, setContent] = React.useState(task.content);
  const [textArea, setTextArea] = React.useState(false);

  const taskRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(taskRef, () => {
    updateTaskContent();
  });

  // Update task content on "Enter" key in textarea
  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateTaskContent();
    }
  };

  // Update content of current task
  const updateTaskContent = () => {
    setTextArea(false);

    if (content === "" || content === task.content) {
      setContent(task.content);
      return;
    }

    const newTask = {
      ...task,
      content: content,
    };

    const newBoard = {
      ...board,
      tasks: {
        ...board.tasks,
        [task.id]: newTask,
      },
    };

    setBoard(newBoard);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(
            snapshot.isDragging ? "bg-primary/50" : "bg-background",
            textArea ? "p-0" : "p-2",
            "border-content relative mb-2 break-words rounded-md border-2 border-transparent shadow-sm hover:border-primary focus:border-primary focus:outline-none",
          )}
          onMouseEnter={() => setShowAction(true)}
          onMouseLeave={() => setShowAction(false)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div ref={taskRef}>
            {textArea ? (
              <Textarea
                aria-label="Set task content"
                minRows={1}
                size="sm"
                color="danger"
                value={content}
                onValueChange={setContent}
                onKeyDown={handleEnterKey}
                classNames={{
                  inputWrapper: "p-2",
                  input: "text-md",
                }}
              />
            ) : (
              <div>
                {task.labels.length !== 0 ? (
                  <div className="flex gap-1">
                    {task.labels.map((label) => {
                      return (
                        <Chip
                          className={`${labelToColor(label)} h-2`}
                          classNames={{
                            content: "w-6",
                          }}
                          key={label}
                          radius="sm"
                        />
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
                {content}
              </div>
            )}
          </div>
          <TaskActions
            task={task}
            showAction={showAction}
            setTextArea={setTextArea}
          />
        </div>
      )}
    </Draggable>
  );
}
