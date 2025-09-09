/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import { Navigate, Route, Router, useLocation, useNavigate } from "@solidjs/router";
import App from "./App";
import LoginPage from "./routes/login";
import AdminPage from "./routes/admin";
import { API } from "./api";
import { createRenderEffect, createSignal, JSX, on, ParentProps, Show } from "solid-js";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

function AuthGuard(props: ParentProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function performAuthCheck() {
    if (API.isLoggedIn()) {
      setIsAuthenticated(true);
      console.log(`Authenticated: ${new Date()}`);
    } else {
      navigate("/login");
    }
  }

  createRenderEffect(on(() => location.pathname, performAuthCheck));

  return (
    <>
      <Show when={isAuthenticated()} fallback={<div>FALLLBACK</div>}>
        {props.children}
      </Show>
    </>
  );
}

render(
  () => (
    <>
      <nav class="bg-zinc-800 text-white min-w-screen h-10 flex items-center px-4">
        <h2>TaskMangler</h2>
      </nav>
      <div class="bg-zinc-900 text-white min-h-screen p-4">
        <Router>
          <Route path="/" component={AuthGuard}>
            <App />
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AuthGuard}>
            <AdminPage />
          </Route>
        </Router>
      </div>
    </>
  ),
  root!,
);
