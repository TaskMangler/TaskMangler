import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const App: Component = () => {
  console.log("App loaded");

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    const nav = useNavigate();
    nav("/login", {
      replace: true,
    });
  }

  const token = refreshToken;
  const tokenData = token ? JSON.parse(atob(token.split(".")[1])) : {};
  console.log("Token data:", tokenData);

  return (
    <>
      <h1>Hi, {tokenData.username}</h1>
      <div class="text-4xl text-blue-300 text-center py-20">
        <h1>Hello, {tokenData.usr}</h1>
        <h2>
          Session: <code>{tokenData.sid}</code>
        </h2>
      </div>
    </>
  );
};

export default App;
