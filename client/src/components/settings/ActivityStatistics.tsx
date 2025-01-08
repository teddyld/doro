import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FaClock } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import { Card, CardHeader, CardBody, Skeleton } from "@nextui-org/react";

import { useAuthStore } from "../../store";

export default function ActivityStatistics() {
  const user = useAuthStore((state) => state.user);
  const token = user.token;

  const { isPending, data } = useQuery({
    queryKey: ["activity"],
    queryFn: () =>
      axios.get(`activity/doro-timer/${token}`).then((res) => res.data),
  });

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <h2>Activity</h2>
        <div className="flex-1 border-t-1" />
      </div>
      {isPending && user.token ? (
        <div className="flex flex-grow gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : (
        <div className="flex gap-4">
          <Card className="w-full bg-card" shadow="sm">
            <CardHeader className="pb-0 text-lg font-semibold">
              Pomodoros completed
            </CardHeader>
            <CardBody className="flex flex-row items-center gap-2">
              <GiTomato className="text-primary" />
              <p className="text-lg font-semibold">
                {data ? data.num_doros : 0}
              </p>
            </CardBody>
          </Card>
          <Card className="w-full bg-card" shadow="sm">
            <CardHeader className="pb-0 text-lg font-semibold">
              Hours focused
            </CardHeader>
            <CardBody className="flex flex-row items-center gap-2">
              <FaClock className="text-primary" />
              <p className="text-lg font-semibold">
                {data ? data.num_hours.toFixed(4) : 0}
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
