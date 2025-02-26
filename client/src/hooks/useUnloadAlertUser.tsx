import React from "react";

export const useUnloadAlertUser = (loggedIn: boolean) => {
  const alertUser = (e: BeforeUnloadEvent) => {
    if (!loggedIn) {
      e.preventDefault();
      e.returnValue = true;
    }
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", alertUser);

    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
};
