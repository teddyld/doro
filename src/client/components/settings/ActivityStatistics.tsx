import { FaClock } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import { useActivityStore } from "../../store";

import { Card, CardHeader, CardBody } from "@nextui-org/react";

export default function ActivityStatistics() {
  const hours = useActivityStore((state) => state.hours);
  const pomodoros = useActivityStore((state) => state.doros);

  return (
    <>
      <div className="flex items-center gap-2 text-xl">
        <h2>Activity</h2>
        <div className="flex-1 border-t-1" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Card>
          <CardHeader className="pb-0 text-lg font-semibold">
            Pomodoros completed
          </CardHeader>
          <CardBody className="flex flex-row items-center gap-2">
            <GiTomato className="text-primary" />
            <p className="text-lg font-semibold">{pomodoros}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-0 text-lg font-semibold">
            Hours focussed
          </CardHeader>
          <CardBody className="flex flex-row items-center gap-2">
            <FaClock className="text-primary" />
            <p className="text-lg font-semibold">{hours}</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
