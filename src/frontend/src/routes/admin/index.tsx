import { Component, createSignal, For, Show } from "solid-js";
import { API, User } from "../../api";

const AdminPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>();

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  API.listUsers().then((users) => {
    setUsers(users);
  });

  async function createUser() {
    await API.createUser(username(), password());

    setUsers(await API.listUsers());
  }

  async function deleteUser(username: string) {
    await API.deleteUser(username);

    setUsers(await API.listUsers());
  }

  return (
    <div class="items-center flex w-full flex-col">
      <h1 class="text-4xl mt-4">Admin</h1>

      <div class="grid">
        <form
          class="flex flex-col gap-4 mt-8 bg-zinc-800 p-2 rounded-md md:flex-row"
          onSubmit={async (e) => {
            e.preventDefault();
            await createUser();
          }}
        >
          <input
            id="usernameInput"
            type="text"
            placeholder="Username..."
            class="bg-zinc-700 p-2 rounded-sm outline-hidden"
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <input
            id="passwordInput"
            type="password"
            placeholder="Password..."
            class="bg-zinc-700 p-2 rounded-sm outline-hidden"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="bg-blue-500 p-2 rounded-sm w-full md:w-30 cursor-pointer hover:bg-blue-400 active:bg-blue-600"
          >
            Create
          </button>
        </form>

        <div class="flex flex-col gap-4 mt-8 bg-zinc-800 p-2 rounded-md">
          <For each={users()}>
            {(user) => (
              <div class="bg-zinc-700 p-2 rounded-sm flex flex-row justify-between items-center">
                <h2>{user.username}</h2>
                <button
                  class="bg-red-400 p-2 rounded-sm cursor-pointer hover:bg-red-300 active:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-500 disabled:text-zinc-200"
                  onclick={() => deleteUser(user.username)}
                  disabled={user.username === API.getActiveUser()}
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
