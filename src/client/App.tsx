import React from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Body from "./components/layout/Body";

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
