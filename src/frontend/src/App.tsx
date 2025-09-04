import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";

const App: Component = () => {
  console.log("App loaded");
  if (!localStorage.getItem("refreshToken")) {
    const nav = useNavigate();
    nav("/login");
  }

  /**
   * 
   * tok := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sid": session.Id,
		"usr": session.Username,
		"adm": session.Admin,
		"typ": "refresh",
	})
   */

  const token = localStorage.getItem("refreshToken");
  const tokenData = token ? JSON.parse(atob(token.split(".")[1])) : null;
  console.log("Token data:", tokenData);

  return (
    <>
      <h1>Hi, {tokenData.username}</h1>
      <div class="text-4xl text-blue-300 text-center py-20">
        <h1>Hello, {tokenData.usr}</h1>
        <h2>Session: <code>{tokenData.sid}</code></h2>
      </div>
    </>
  );
};

export default App;
