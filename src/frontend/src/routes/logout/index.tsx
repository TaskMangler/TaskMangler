import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

const LogoutPage: Component = () => {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");

  const nav = useNavigate();

  setTimeout(() => {
    nav("/login");
  }, 2000);

  return (
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="bg-zinc-700/90 p-6 sm:p-8 md:p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 class="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-white tracking-tight">
          Logging out...
        </h2>
      </div>
    </div>
  );
};

export default LogoutPage;
