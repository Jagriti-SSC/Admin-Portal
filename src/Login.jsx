/** @format */

import React, { useState } from "react";

const Login = ({ setLogged }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const backendhost = "http://localhost:8000";
    try {
      const response = await fetch(`${backendhost}/auth/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.status === "ok") {
        setLogged(true);
        sessionStorage.setItem("jagritisession76", email);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center">Admin-Login</h2>
            <div className="form-group mt-4">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-4">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mt-4">
              Login
            </button>
          </form>
          <p className="text-danger mt-4 text-center">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
