import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskPage from "./components/TaskPage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token]);

  return (
    <div className="App">
      <Navbar setToken={setToken} setLoggedIn={setLoggedIn} />

      {!loggedIn ? (
        <Login setToken={setToken} setLoggedIn={setLoggedIn} />
      ) : (
        <TaskPage token={token} />
      )}
    </div>
  );
}

export default App;
