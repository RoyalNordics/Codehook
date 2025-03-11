import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    const response = await fetch("https://codehook.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      onLogin(data);
    } else {
      setError(data.detail || "Login failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-gray-300 px-10 py-3">
          <div className="flex items-center gap-4 text-black">
            <h2 className="text-lg font-bold">CodeHook</h2>
          </div>
          <button className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-bold">
            Sign up
          </button>
        </header>
        <div className="flex flex-1 justify-center py-5 px-40">
          <div className="w-full max-w-md p-6">
            <h1 className="text-lg font-bold">Log in to CodeHook</h1>
            <p className="text-gray-600 text-sm">
              A platform that connects AI chat with a development environment.
            </p>

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Your username"
                className="w-full border rounded-xl p-3 mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Your password"
                className="w-full border rounded-xl p-3 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
