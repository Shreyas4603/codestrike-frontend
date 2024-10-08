import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import {toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { postData } from "../utils/fetch-api-data";

function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    // Prepare data for backend, excluding confirmPassword
    const data = {
      email,
      username,
      password,
    };

    try {
      const response = await postData("/users/register", data);
      console.log(response.response);
      if (response.response.status === 201) {
        toast.success("Signed up successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="bg-background h-screen flex items-center justify-center p-4 ">
      <div className="w-full lg:w-1/4 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
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
                <p>Username</p>
                <Input
                  placeholder="give a unique username"
                  id="username"
                  name="username"
                />
              </div>
              <div className="space-y-1">
                <p>Password</p>
                <Input
                  placeholder="Enter your password here ..."
                  type="password"
                  id="password"
                  name="password"
                />
              </div>
              <div className="space-y-1">
                <p>Confirm Password</p>
                <Input
                  placeholder="Confirm your password here ..."
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Already have an account?</p>
            <Button variant="link" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardFooter> 
        </Card>
      </div>
    </div>
  );
}

export default Signup;
