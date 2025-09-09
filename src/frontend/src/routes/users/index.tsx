import { Component, createSignal, For } from "solid-js";
import { createUser, listUsers, User } from "../../api";

const UsersPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>();

  listUsers().then((usr) => {
    setUsers(usr);
  });

  async function submitUserForm() {
    const username: string = (document.getElementById("usernameInput") as HTMLInputElement).value;
    const password: string = (document.getElementById("passwordInput") as HTMLInputElement).value;
    await createUser(username, password);
  }

  return (
    <>
      <div class="flex justify-center">
        <form
          class="flex-col justify-center m-4"
          id="createUserForm"
          onsubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div class="w-full">
            <label for="username" class="w-[25%]">
              Username
            </label>
            <input id="usernameInput" name="username" type="text" class="border-solid border-2 m-1"></input>
          </div>
          <div class="w-full">
            <label for="password" class="w-[25%]">
              Password
            </label>
            <input id="passwordInput" name="password" type="password" class="border-solid border-2 m-1"></input>
          </div>
          <button class="bg-blue-600 w-full" onclick={() => submitUserForm()}>
            Create User
          </button>
        </form>
      </div>
      <div class="flex flex-col w-full items-center">
        <h2>Users:</h2>
        <For each={users()}>
          {(user) => (
            <div class="rounded bg-zinc-700 my-4 w-48 p-2">
              <h2>{user.username}</h2>
            </div>
          )}
        </For>
      </div>
    </>
  );
};

export default UsersPage;
