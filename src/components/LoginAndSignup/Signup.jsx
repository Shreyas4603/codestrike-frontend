import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const username = formData.get("username");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post("https://your-api-url.com/signup", {
        username,
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
    <div className="bg-background h-screen flex items-center justify-center p-4">
      <div className="w-full lg:w-1/4 mx-auto ">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <p>Username</p>
                <Input
                  placeholder="Your Username"
                  id="username"
                  name="username"
                />
              </div>
              <div className="space-y-1">
                <p>Email</p>
                <Input
                  placeholder="youremail@example.com"
                  id="email"
                  name="email"
                />
              </div>
              <div className="space-y-1">
                <p>Password</p>
                <Input
                  placeholder="*********"
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1">
                <p>Confirm Password</p>
                <Input
                  placeholder="*********"
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                />
              </div>
              <Button type="submit" className="w-full rounded-3xl">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <div className="flex items-center justify-center pb-8">
            <p className="mr-2">Already having an account?</p>
            <button
              className="text-white-500 font-bold hover:underline"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
