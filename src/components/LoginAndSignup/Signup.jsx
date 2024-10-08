import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Import } from "lucide-react";
import { postData } from "../utils/fetch-api-data";

function Signup() {
  const navigate = useNavigate();

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
    <div className="bg-background h-screen flex items-center justify-center p-4 ">
      <div className="w-full lg:w-1/4 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login In</CardTitle>
            <CardDescription>Enter email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="" onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
