import React from "react";
import Timer from "../Timer";

export default function Body() {
  return (
    <section className="flex-1">
      <div className="flex justify-center">
        <Timer />
      </div>
    </section>
  );
}
