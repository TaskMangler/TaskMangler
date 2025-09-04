import { Component } from "solid-js";
import { getRefreshToken } from "../../api";

async function handleLogin(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  console.log("Logging in with", { username, password });

  await getRefreshToken(username, password);
  window.location.href = "/";
}

const LoginPage: Component = () => {
  return (
    <>
      <div class="min-h-screen flex items-center justify-center px-4">
        <div class="bg-zinc-700/90 p-6 sm:p-8 md:p-10 rounded-xl shadow-md w-full max-w-md">
          <h2 class="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-white tracking-tight">
            Login to Your Account
          </h2>
          <form class="space-y-5 sm:space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div>
              <label for="username" class="block text-sm font-medium text-zinc-200 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                autocomplete="username"
                class="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-2 bg-zinc-800 border border-zinc-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-zinc-200 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autocomplete="current-password"
                class="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-2 bg-zinc-800 border border-zinc-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
              />
            </div>
            <div>
              <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
