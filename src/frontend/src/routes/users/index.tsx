import { Component, createSignal, For } from "solid-js";
import { listUsers, User } from "../../api";

const UsersPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>();

  listUsers().then((usr) => {
    setUsers(usr);
  });
  return (
    <div class="flex justify-center ">
      <For each={users()}>
        {(user) => (
          <div class="rounded bg-zinc-700 my-4 w-48 p-2">
            <h2>{user.username}</h2>
          </div>
        )}
      </For>
    </div>
  );
};

export default UsersPage;
