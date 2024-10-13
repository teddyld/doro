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

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
