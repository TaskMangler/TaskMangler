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

function AuthGuard(props: ParentProps & { admin?: boolean }): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function performAuthCheck() {
    if (API.isLoggedIn() && (!props.admin || API.isAdmin())) {
      setIsAuthenticated(true);
      console.log(`Authenticated: ${new Date()}`);
    } else {
      if (API.isLoggedIn()) {
        navigate("/");
        return
      }

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
      <div class="bg-zinc-900 text-white min-h-screen">
        <Router>
          <Route
            path="/"
            component={() => (
              <AuthGuard>
                <App />
              </AuthGuard>
            )}
          />
          <Route path="/login" component={LoginPage} />
          <Route
            path="/admin"
            component={() => (
              <AuthGuard admin={true}>
                <AdminPage />
              </AuthGuard>
            )}
          />
        </Router>
      </div>
    </>
  ),
  root!,
);
