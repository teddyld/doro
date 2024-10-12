import Header from "../components/layout/Header";
import Body from "../components/layout/Body";
import { Toaster } from "sonner";

export default function Dashboard() {
  return (
    <div className="mx-auto flex min-h-screen flex-col lg:w-2/3">
      <Header />
      <Body />
      <Toaster
        position="bottom-center"
        richColors={true}
        duration={5000}
        closeButton={true}
      />
    </div>
  );
}
