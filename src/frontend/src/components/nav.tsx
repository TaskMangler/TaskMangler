import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { API } from "../api";

const Navbar: Component = () => {
  return (
    <nav class="bg-zinc-800 text-white min-w-screen h-10 flex items-center px-4 justify-between">
      <h2>TaskMangler</h2>
      <Show when={API.isAdmin()}>
        <A href="/admin" class="hover:underline text-sky-200">Admin</A>
      </Show>
    </nav>
  );
};

export default Navbar;
