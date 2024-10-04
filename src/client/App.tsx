import React from "react";
import Header from "./components/layout/Header";
import Body from "./components/layout/Body";

function App() {
  return (
    <div className="mx-auto flex min-h-screen flex-col lg:w-1/2">
      <Header />
      <Body />
    </div>
  );
}

export default App;
