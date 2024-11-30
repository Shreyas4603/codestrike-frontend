import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
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
const Login = ({handleLogin}) => {
  const navigate = useNavigate();
  const jwt = Cookies.get('token')
  useEffect(() => {
		if (jwt) {
			navigate("/"); 
		}
  }, [jwt, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // Create FormData from the form element

    // Convert FormData to an object for axios
    const data = {
      email: formData.get("email"), // Replace 'email' with your input name attribute
      password: formData.get("password"), // Replace 'password' with your input name attribute
    };

    try {
      const response = await postData("/users/login", data);
      console.log(response.response.data);
      if (response.response.status === 200) {
			toast.success("Logged in successfully!");
      // Cookies.set("token", response.response.data.token);
      handleLogin(response.response.data.token);
			navigate("/");
		}
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
		<div className="bg-background h-screen flex items-center justify-center p-4 ">
			<div className="w-full lg:w-1/4 mx-auto">
				<Card className="rounded-3xl">
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Enter email and password</CardDescription>
					</CardHeader>
					<CardContent>
						<form action="" onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1">
								<p>Email</p>
								<Input
									placeholder="e.g:youremail@example.com"
									id="email"
									name="email"
								/>
							</div>
							<div className="space-y-1">
								<p>Password</p>
								<Input
									placeholder="e.g:#98fyi@20$4"
									type="password"
									id="password"
									name="password"
									autoComplete="new-password"
								/>
							</div>
							<Button type="submit" className="w-full rounded-3xl">
								Login
							</Button>
						</form>
					</CardContent>
					<div className="flex items-center justify-center pb-8">
            <CardFooter>
                <p className="mr-2">Create an account?</p>
                <button
                  className="text-white-600 font-bold hover:underline"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Signup
                </button>
            </CardFooter>
					</div>
				</Card>
			</div>
		</div>
  );
}

export default Login;
