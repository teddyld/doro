import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { setupRender } from "../../setupTests";

import { Toaster } from "sonner";
import TrelloTitleItem from "./TrelloTitleItem";

const mockBoard = {
  color: "Default",
  tasks: {},
  columns: {},
  columnOrder: [],
  taskCount: 0,
  columnCount: 0,
};
const mockBoardNames = ["New board 1"];

it("Deletes board when delete button is clicked", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={"New board 1"}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click delete item
  const deleteItem = screen.getByRole("menuitem", { name: /delete/i });
  await user.click(deleteItem);

  expect(deleteBoardFn).toHaveBeenCalledTimes(1);
});

it("Renames board when rename button is clicked and new title is given using blur", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={mockBoardNames[0]}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click rename item
  const renameItem = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameItem);

  // Textarea is displayed
  const titleTextarea = screen.getByRole("textbox", {
    name: /edit\-board\-title\-textarea/i,
  });

  expect(titleTextarea).toBeTruthy();

  // Type in textarea to change title on blur
  await user.type(titleTextarea, " - Example123");
  await waitFor(() => {
    expect(titleTextarea).toHaveValue(`${mockBoardNames[0]} - Example123`);
  });

  // Blur on textarea to evoke rename function
  await user.click(document.body);
  expect(renameBoardFn).toHaveBeenCalledTimes(1);
});

it("Renames board when rename button is clicked and new title is given using enter key", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={mockBoardNames[0]}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click rename item
  const renameItem = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameItem);

  // Textarea is displayed
  const titleTextarea = screen.getByRole("textbox", {
    name: /edit\-board\-title\-textarea/i,
  });

  expect(titleTextarea).toBeTruthy();

  // Type in textarea to change title on blur
  await user.type(titleTextarea, " - Example123");
  await waitFor(() => {
    expect(titleTextarea).toHaveValue(`${mockBoardNames[0]} - Example123`);
  });

  // Enter key on textarea to evoke rename function
  await user.type(titleTextarea, "{enter}");
  expect(renameBoardFn).toHaveBeenCalledTimes(1);
});

it("Does not rename title when new title is same as old title", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={mockBoardNames[0]}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click rename item
  const renameItem = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameItem);

  // Textarea is displayed
  const titleTextarea = screen.getByRole("textbox", {
    name: /edit\-board\-title\-textarea/i,
  });

  expect(titleTextarea).toBeTruthy();

  // Clear textarea
  await user.clear(titleTextarea);

  // Type in textarea to change new title to the same as old title
  await user.type(titleTextarea, mockBoardNames[0]);
  await waitFor(() => {
    expect(titleTextarea).toHaveValue(mockBoardNames[0]);
  });

  // Enter key on textarea to evoke rename function
  await user.type(titleTextarea, "{enter}");

  // Rename function does not get changed
  expect(renameBoardFn).toHaveBeenCalledTimes(0);
});

it("Evokes an error when title name is empty", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <>
      <TrelloTitleItem
        board={mockBoard}
        boardNames={mockBoardNames}
        boardName={mockBoardNames[0]}
        deleteBoard={deleteBoardFn}
        renameBoard={renameBoardFn}
        updateColor={updateColorFn}
      />
      <Toaster
        position="bottom-center"
        richColors={true}
        duration={5000}
        closeButton={true}
      />
    </>,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click rename item
  const renameItem = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameItem);

  // Textarea is displayed
  const titleTextarea = screen.getByRole("textbox", {
    name: /edit\-board\-title\-textarea/i,
  });

  expect(titleTextarea).toBeTruthy();

  // Clear textarea
  await user.clear(titleTextarea);

  await waitFor(() => {
    expect(titleTextarea).toHaveValue("");
  });

  // Enter key on textarea to evoke rename function
  await user.type(titleTextarea, "{enter}");

  // Toast error
  await waitFor(() => {
    expect(
      screen.getByText(/board title cannot be left blank\./i),
    ).toBeTruthy();
  });

  // Rename function does not get changed
  expect(renameBoardFn).toHaveBeenCalledTimes(0);
});

it("Evokes an error when title name already exists", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const mockBoardNamesDuplicates = ["New board 1", "Duplicate"];

  const { user } = setupRender(
    <>
      <TrelloTitleItem
        board={mockBoard}
        boardNames={mockBoardNamesDuplicates}
        boardName={mockBoardNamesDuplicates[0]}
        deleteBoard={deleteBoardFn}
        renameBoard={renameBoardFn}
        updateColor={updateColorFn}
      />
      <Toaster
        position="bottom-center"
        richColors={true}
        duration={5000}
        closeButton={true}
      />
    </>,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Click rename item
  const renameItem = screen.getByRole("menuitem", { name: /rename/i });
  await user.click(renameItem);

  // Textarea is displayed
  const titleTextarea = screen.getByRole("textbox", {
    name: /edit\-board\-title\-textarea/i,
  });

  expect(titleTextarea).toBeTruthy();

  // Clear textarea
  await user.clear(titleTextarea);

  await waitFor(() => {
    expect(titleTextarea).toHaveValue("");
  });

  // Enter duplicate board name
  await user.type(titleTextarea, mockBoardNamesDuplicates[1]);

  await waitFor(() => {
    expect(titleTextarea).toHaveValue(mockBoardNamesDuplicates[1]);
  });

  // Enter key on textarea to evoke rename function
  await user.type(titleTextarea, "{enter}");

  // Toast error
  await waitFor(() => {
    expect(
      screen.getByText(
        /there is already a board with that name\. please try again/i,
      ),
    ).toBeTruthy();
  });

  // Rename function does not get changed
  expect(renameBoardFn).toHaveBeenCalledTimes(0);
});

it("Updates board color when new color is selected", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={mockBoardNames[0]}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  // Open board color submenu
  const colorItem = screen.getByRole("button", { name: /change board color/i });
  await user.click(colorItem);

  // Expect board colors to exist
  const yellowBtn = screen.getByRole("button", { name: /yellow/i });

  expect(
    screen.getByRole("button", {
      name: /default/i,
    }),
  ).toBeTruthy();

  expect(yellowBtn).toBeTruthy();

  // Change color from Default to Yellow
  await user.click(yellowBtn);
  expect(updateColorFn).toHaveBeenCalledTimes(1);
});

it("Closes context menu on blur", async () => {
  const deleteBoardFn = jest.fn();
  const renameBoardFn = jest.fn();
  const updateColorFn = jest.fn();

  const { user } = setupRender(
    <TrelloTitleItem
      board={mockBoard}
      boardNames={mockBoardNames}
      boardName={mockBoardNames[0]}
      deleteBoard={deleteBoardFn}
      renameBoard={renameBoardFn}
      updateColor={updateColorFn}
    />,
  );

  // Open board title context menu
  const titleBtn = screen.getByRole("button", { name: /New board 1/i });
  fireEvent.contextMenu(titleBtn);

  expect(screen.queryByRole("menu")).toBeTruthy();

  // Close context menu on blur
  await user.click(document.body);

  // Wait for closing animation to terminate
  await act(async () => {
    await new Promise((r) => setTimeout(r, 2000));
  });

  expect(screen.queryByRole("menu")).not.toBeTruthy();
});
