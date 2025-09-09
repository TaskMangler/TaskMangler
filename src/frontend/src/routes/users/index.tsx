import { Component, createSignal, For } from "solid-js";
import { API, User } from "../../api";

const UsersPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>();

  API.listUsers().then((users) => {
    setUsers(users);
  });

  async function createUser() {
    const username: string = (document.getElementById("usernameInput") as HTMLInputElement).value;
    const password: string = (document.getElementById("passwordInput") as HTMLInputElement).value;
    await API.createUser(username, password);

    setUsers(await API.listUsers());
  }

  return (
    <div class="items-center flex w-full flex-col">
      <h1 class="text-4xl mt-4">Users</h1>

      <div class="grid">
        <div class="flex flex-col gap-4 mt-8 bg-zinc-800 p-2 rounded-md md:flex-row">
          <input id="usernameInput" type="text" placeholder="Username..." class="bg-zinc-700 p-2 rounded-sm outline-hidden" />
          <input id="passwordInput" type="password" placeholder="Password..." class="bg-zinc-700 p-2 rounded-sm outline-hidden" />
          <button class="bg-blue-500 p-2 rounded-sm w-full md:w-30 cursor-pointer" onclick={createUser}>Create</button>
        </div>

        <div class="flex flex-col gap-4 mt-8 bg-zinc-800 p-2 rounded-md">
          <For each={users()}>
            {(user) => (
              <div class="bg-zinc-700 p-2 rounded-sm flex flex-row justify-between items-center">
                <h2>{user.username}</h2>
                <button class="bg-zinc-600 text-zinc-400 p-2 rounded-sm cursor-not-allowed">Delete</button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
