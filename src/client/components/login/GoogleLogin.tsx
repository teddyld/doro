import axios from "axios";
import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
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
  return (
    <Button onClick={handleGoogleLogin}>
      <FaGoogle />
      Continue with Google
    </Button>
  );
}
