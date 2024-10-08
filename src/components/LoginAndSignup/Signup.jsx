import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import axios from "axios";
import { Toaster, toast } from "sonner";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Username state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post("https://your-api-url.com/signup", {
        username, // Include username in the request
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="relative bg-black border border-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-96 z-10 rounded-e-3xl rounded-s-3xl">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="YourUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-white rounded-md w-full py-3 px-4 text-white leading-tight bg-transparent focus:outline-none focus:ring focus:ring-white focus:border-white transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-white rounded-md w-full py-3 px-4 text-white leading-tight bg-transparent focus:outline-none focus:ring focus:ring-white focus:border-white transition duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-white rounded-md w-full py-3 px-4 text-white leading-tight bg-transparent focus:outline-none focus:ring focus:ring-white focus:border-white transition duration-200"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-white rounded-md w-full py-3 px-4 text-white leading-tight bg-transparent focus:outline-none focus:ring focus:ring-white focus:border-white transition duration-200"
              autoComplete="new-password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Sign Up
          </Button>
        </form>
        <div className="text-center mt-4">
          <span className="text-white">Already have an account? </span>
          <button
            className="text-white hover:underline font-extrabold"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
