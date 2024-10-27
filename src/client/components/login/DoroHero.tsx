import { Link } from "react-router-dom";

export default function DoroHero() {
  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center text-4xl"
      aria-label="Link to dashboard"
    >
      <h1>
        <Link to="/">Pomodoro</Link>
      </h1>
    </div>
  );
}
