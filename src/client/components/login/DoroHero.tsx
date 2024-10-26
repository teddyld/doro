import { useNavigate } from "react-router-dom";

export default function DoroHero() {
  const navigate = useNavigate();

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center text-4xl"
      onClick={() => navigate("/")}
    >
      <h1>
        Pomo<span className="text-primary">doro</span>
      </h1>
    </div>
  );
}
