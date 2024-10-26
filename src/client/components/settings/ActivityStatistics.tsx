import { FaClock } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useAuthStore } from "../../store";
import axios from "axios";
import React from "react";
import { toast } from "sonner";

export default function ActivityStatistics() {
  const [doros, setDoros] = React.useState(0);
  const [hours, setHours] = React.useState(0);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  React.useEffect(() => {
    const token = user.token;
    if (!user.token) {
      return;
    }

    const fetchActivity = async () => {
      return await axios
        .get(`activity/doro-timer/${token}`)
        .then((res) => res.data);
    };

    fetchActivity()
      .then((data) => {
        setDoros(data.num_doros);
        setHours(data.num_hours);
      })
      .catch((err) => {
        toast.error(err as string);
        setUser({
          name: "",
          token: "",
        });
        setLoggedIn(false);
      });
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <h2>Activity</h2>
        <div className="flex-1 border-t-1" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Card className="bg-card" shadow="sm">
          <CardHeader className="pb-0 text-lg font-semibold">
            Pomodoros completed
          </CardHeader>
          <CardBody className="flex flex-row items-center gap-2">
            <GiTomato className="text-primary" />
            <p className="text-lg font-semibold">{doros}</p>
          </CardBody>
        </Card>
        <Card className="bg-card" shadow="sm">
          <CardHeader className="pb-0 text-lg font-semibold">
            Hours focused
          </CardHeader>
          <CardBody className="flex flex-row items-center gap-2">
            <FaClock className="text-primary" />
            <p className="text-lg font-semibold">{hours.toFixed(4)}</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
