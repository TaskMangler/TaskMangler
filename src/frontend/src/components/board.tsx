import { createSignal, For, Show } from "solid-js";

export type Task = {
  id: number;
  title: string;
  done: boolean;
  deferred: boolean;
  dependencies: number[];
  indirectDependency?: boolean;
};

export const Board = (props: { id: string }) => {
  const [tasks, setTasks] = createSignal([]);

  setTasks([
    { id: 1, title: "Task 1", done: false, deferred: false, dependencies: [] },
    { id: 2, title: "Task 2", done: true, deferred: false, dependencies: [] },
    { id: 3, title: "Task 3", done: true, deferred: false, dependencies: [] },
    { id: 4, title: "Task 4", done: false, deferred: false, dependencies: [2, 3] },
    { id: 5, title: "Task 5", done: false, deferred: false, dependencies: [2, 4] },
    { id: 6, title: "Task 6", done: false, deferred: false, dependencies: [5] },
    { id: 7, title: "Task 7", done: false, deferred: false, dependencies: [1, 2, 3, 4, 5, 6] },
  ]);

  const getDeps = (task: Task): Task[] => {
    let ts = tasks().filter((t) => task.dependencies.includes(t.id));

    let hasSubDeps = false;
    for (const t of ts) {
      if (t.dependencies.length > 0) {
        hasSubDeps = true;
        break;
      }
    }

    if (hasSubDeps) {
      let allDeps: Task[] = [];
      for (const t of ts) {
        allDeps.push(...getDeps(t));
      }
      ts.push(...allDeps);
    }

    // Remove duplicates
    const uniqueDeps = Array.from(new Set(ts.map((t) => t.id))).map((id) => {
      return ts.find((t) => t.id === id)!;
    });

    for (const dep of uniqueDeps) {
      if (dep.id !== task.id && !task.dependencies.includes(dep.id)) {
        dep.indirectDependency = true;
      }
    }

    return uniqueDeps;
  }

  return (
    <div class="grid grid-cols-5 w-full gap-4">
      <For each={tasks()}>
        {(task) => (
          <div class="bg-zinc-800 p-2 rounded-lg">
            <h2>{task.title}</h2>
            <Show when={task.dependencies.length > 0}>
              <p class="text-sm text-zinc-400">Depends on:</p>
              <For each={getDeps(task)}>
                {(dep) => (
                  <div class="bg-zinc-700 p-2 rounded mt-2 flex justify-between items-center">
                    <span class={dep.done ? 'bg-green-500' : 'bg-red-500'}>{dep.title}{dep.indirectDependency ? " (indirect)" : ""}</span>
                  </div>
                )}
              </For>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};
