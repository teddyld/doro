import React from "react";
import axios from "axios";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Button,
  User,
} from "@nextui-org/react";
import { FaUser } from "react-icons/fa";
import { CiLogout, CiLogin } from "react-icons/ci";

import { toast } from "sonner";
import { useAuthStore } from "../../store";

export default function DropdownUser() {
  const user = useAuthStore((state) => state.user);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const checkLoginState = useAuthStore((state) => state.checkLoginState);

  React.useEffect(() => {}, [loggedIn]);

  const handleLogin = async () => {
    try {
      // Gets authentication url from backend server
      const {
        data: { url },
      } = await axios.get("/auth/url");
      // Navigate to consent screen
      window.location.assign(url);
    } catch (err) {
      toast.error(err as string);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      checkLoginState();
    } catch (err) {
      toast.error(err as string);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly disableRipple variant="ghost">
          <FaUser />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        aria-label="Profile Actions"
        disabledKeys={["profile"]}
      >
        <DropdownItem
          key="profile"
          textValue="profile"
          className={clsx(loggedIn ? "" : "hidden", "opacity-100")}
          isReadOnly
        >
          <User
            name={user.name}
            avatarProps={{
              src: user.picture,
            }}
          />
        </DropdownItem>
        <DropdownItem
          key="login"
          onClick={handleLogin}
          startContent={<CiLogin className="text-xl" />}
          className={loggedIn ? "hidden" : ""}
        >
          Log in
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className={loggedIn ? "" : "hidden"}
          onClick={handleLogout}
          startContent={<CiLogout className="text-xl" />}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
