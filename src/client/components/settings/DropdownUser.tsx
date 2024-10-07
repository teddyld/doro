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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store";

export default function DropdownUser() {
  const user = useAuthStore((state) => state.user);
  const loggedIn = useAuthStore((state) => state.loggedIn);
  const checkLoginState = useAuthStore((state) => state.checkLoginState);

  const navigate = useNavigate();

  React.useEffect(() => {}, [loggedIn, user]);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      toast.success("Successfully logged out!");
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
          Signed in as {user.name}
        </DropdownItem>
        <DropdownItem
          key="login"
          onClick={() => navigate("/login")}
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
