import React from "react";

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
    };
  });
};
