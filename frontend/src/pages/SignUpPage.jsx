import React, { useState } from "react";
import { useAuthStore } from "../utils/useAuthStore";
import { Navigate, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate()
  const { signup, isSigningUp } = useAuthStore();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSwitch =(e)=>{
    e.preventDefault();
    navigate("/login");
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.fullName || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError(""); // clear error if valid
    try {
      await signup(form); // sending { fullName, email, password } to API
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Create Account
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

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
            disabled={isSigningUp}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
            <p onClick={handleSwitch} className="text-center hover:underline cursor-pointer">
            Already have an account? Login
          </p>
        </form>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center">
        <img
          src="https://source.unsplash.com/600x800/?technology,abstract"
          alt="signup"
          className="object-cover w-full h-full rounded-l-2xl"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
