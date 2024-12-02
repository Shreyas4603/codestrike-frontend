import React, { useEffect } from "react";
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
import Cookies from "js-cookie";

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
        navigate("/");
      }
    } catch (error) {
	console.log(error)
      toast.error("Failed to sign up. Please try again.");
    }
  };

  return (
		<div className="bg-background h-screen flex items-center justify-center p-4">
			<div className="w-full lg:w-1/4 mx-auto ">
				<Card className="rounded-3xl">
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>Enter your details to create an account</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
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
									autoComplete="new-password"
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
							<Button type="submit" className="w-full rounded-3xl">
								Sign Up
							</Button>
						</form>
					</CardContent>
					<div className="flex items-center justify-center pb-8">
						<CardFooter>
							<p className="mr-2">Already having an account?</p>
							<button
								className="text-white-500 font-bold hover:underline"
								onClick={() => {
									navigate("/");
								}}
							>
								Login
							</button>
						</CardFooter>
					</div>
				</Card>
			</div>
		</div>
  );
}

export default Signup;
