import "@testing-library/jest-dom";
import { ReactElement } from "react";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function setupRender(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
