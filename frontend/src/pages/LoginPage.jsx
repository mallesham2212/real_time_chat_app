import React, { useState } from "react";
import { useAuthStore } from "../utils/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore(); // Make sure you have a login action in your store
  const [form, setForm] = useState({
    email: "bindu@gmail.com",
    password: "123456",
  });
  const [error, setError] = useState("");

  const handleSwitch = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Both fields are required");
      return;
    }
    setError("");
    try {
      await login(form); 
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          <p
            onClick={handleSwitch}
            className="text-center hover:underline cursor-pointer"
          >
            Don't have an account? Sign Up
          </p>
        </form>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center">
        <img
          src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fchat-app-logo-design-template-can-be-used-icon-chat-application-logo_36949664.htm&psig=AOvVaw02nsnnjTjKmdTOSAFlSFJJ&ust=1761195528605000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLiZ4eGCt5ADFQAAAAAdAAAAABAF"
          alt="login"
          className="object-cover w-full h-full rounded-l-2xl"
        />
      </div>
    </div>
  );
};

export default LoginPage;
