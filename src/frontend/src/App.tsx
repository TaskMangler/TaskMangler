import type { Component } from "solid-js";
import Navbar from "./components/nav";

const App: Component = () => {
  return (
    <>
      <Navbar></Navbar>
      <div class="p-4">
        <h1 class="text-4xl">Welcome to TaskMangler</h1>
      </div>
    </>
  );
};

export default App;
