import { Link } from "react-router-dom";

export default function DoroHero() {
  return (
    <Link to="/" className="mx-auto">
      <h1
        aria-label="link-dashboard"
        className="cursor-pointer justify-center text-4xl"
      >
        Pomo<span className="text-primary">doro</span>
      </h1>
    </Link>
  );
}
