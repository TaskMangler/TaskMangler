import { createSignal, For, Show, type Component } from "solid-js";
import Navbar from "./components/nav";
import { Board } from "./components/board";

type APITask = {
  id: number;
  title: string;
};

const DependencySearch = (props: { tasks: APITask[]; addDependency: (task: APITask) => void }) => {
  const [filtered, setFiltered] = createSignal<APITask[]>(props.tasks);

  const filterTasks = (query: string) => {
    const lowerQuery = query.toLowerCase();
    setFiltered(props.tasks.filter((task) => task.title.toLowerCase().includes(lowerQuery)));
  };

  return (
    <div class="bg-zinc-700 p-2 rounded mt-2">
      <input
        type="text"
        class="bg-zinc-800 p-2 rounded w-full outline-none"
        placeholder="Search dependencies..."
        onkeyup={(e) => filterTasks((e.target as HTMLInputElement).value)}
      />
      <div class="max-h-40 overflow-y-auto mt-2">
        <For each={filtered()}>
          {(task) => (
            <div class="p-2 hover:bg-zinc-600 rounded cursor-pointer" onclick={() => props.addDependency(task)}>
              {task.title}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const Task = (props: { title: string; tasks: APITask[] }) => {
  const [menu, setMenu] = createSignal(false);
  const [dependencies, setDependencies] = createSignal<APITask[]>([]);

  return (
    <div class="bg-zinc-800 p-2 rounded-lg">
      <h2 onclick={() => setMenu(!menu())}>{props.title}</h2>
      <DependencySearch
        tasks={props.tasks}
        addDependency={(task) => {
          if (!dependencies().some((t) => t.id === task.id)) {
            setDependencies([...dependencies(), task]);
          }
        }}
      />
      <For each={dependencies()}>
        {(task) => (
          <div class="bg-zinc-700 p-2 rounded mt-2 flex justify-between items-center">
            <span>{task.title}</span>
            <button
              class="bg-red-400 hover:bg-red-500 text-white rounded p-1"
              onclick={() => setDependencies(dependencies().filter((t) => t.id !== task.id))}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <input
        type="text"
        class="bg-zinc-800 p-2 rounded w-full outline-none mt-2"
        placeholder="Add note..."
        onkeyup={(e) => {
          if (e.key === "Enter") {
            const input = e.target as HTMLInputElement;
            console.log("Note added:", input.value);
            input.value = "";
          }
        }}
      />
      <Show when={menu()}>
        <div class="flex flex-row gap-2 mt-2">
          <button class="bg-sky-600 hover:bg-sky-700 text-white rounded p-2">Done</button>
          <button class="bg-red-400 hover:bg-red-500 text-white rounded p-2">Defer</button>
        </div>
      </Show>
    </div>
  );
};

const App: Component = () => {
  const sampleTasks = [
    { id: 1, title: "Buy groceries" },
    { id: 2, title: "Clean the house" },
    { id: 3, title: "Finish project report" },
    { id: 4, title: "Call mom" },
    { id: 5, title: "Schedule dentist appointment" },
    { id: 6, title: "Plan weekend trip" },
    { id: 7, title: "Read new book" },
    { id: 8, title: "Exercise" },
    { id: 9, title: "Organize workspace" },
    { id: 10, title: "Pay bills" },
  ];

  return (
    <>
      <Navbar></Navbar>
      <div class="p-4 w-full">
        <Board id="board-1" />
      </div>
    </>
  );
};

export default App;
