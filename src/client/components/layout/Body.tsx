import Timer from "../Timer";
import Trello from "../trello/Trello";

export default function Body() {
  return (
    <section className="flex-1">
      <div className="flex flex-col justify-center">
        <Timer />
        <Trello />
      </div>
    </section>
  );
}
