import { Link } from "react-router-dom";

export default function DoroLogo() {
  return (
    <Link to="/" className="mx-auto" aria-label="link-dashboard">
      <h1 className="cursor-pointer justify-center text-4xl">
        Pomo<span className="text-primary">doro</span>
      </h1>
    </Link>
  );
}
