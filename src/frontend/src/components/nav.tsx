import { A, useNavigate } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { API } from "../api";

const Navbar: Component = () => {
  const navigate = useNavigate();

  return (
    <nav class="bg-zinc-800 text-white min-w-screen h-10 flex items-center px-4 justify-between">
      <A href="/" class="hover:underline text-sky-200">TaskMangler</A>
      <div class="flex gap-4 items-center">
        <Show when={API.isAdmin()}>
          <A href="/admin" class="hover:underline text-sky-200">
            Admin
          </A>
        </Show>
        <button class="hover:underline hover:cursor-pointer text-sky-200" onclick={() => {
          API.logout();
          navigate("/login");
        }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
