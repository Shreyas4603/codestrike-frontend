import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { postData } from "../utils/fetch-api-data";
import styles from "../Authentication/styles/Signup.module.css";

function Signup() {
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const email = formData.get("email");
		const username = formData.get("username");
		const password = formData.get("password");
		const confirmPassword = formData.get("confirmPassword");

		if (password !== confirmPassword) {
			toast.error("Passwords do not match. Please try again.");
			return;
		}

		const data = {
			email,
			username,
			password,
		};

		try {
			const response = await postData("/users/register", data);
			if (response.response.status === 201) {
				toast.success("Signed up successfully!");
				navigate("/");
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to sign up. Please try again.");
		}
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center p-4 ${styles.cyberpunkBackground}`}
		>
			<div className="absolute inset-0 bg-black opacity-30"></div>
			<div className="w-full max-w-md z-10">
				<Card
					className={`rounded-3xl bg-black bg-opacity-70 backdrop-blur-lg ${styles.neonCard}`}
				>
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600">
							Create Your Account
						</CardTitle>
						<CardDescription className="text-gray-300">
							Join the cyberpunk world
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label
									htmlFor="email"
									className="text-sm font-medium text-gray-300"
								>
									Email
								</label>
								<Input
									placeholder="youremail@example.com"
									id="email"
									name="email"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="username"
									className="text-sm font-medium text-gray-300"
								>
									Username
								</label>
								<Input
									placeholder="Choose a unique username"
									id="username"
									name="username"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="password"
									className="text-sm font-medium text-gray-300"
								>
									Password
								</label>
								<Input
									placeholder="Enter your password"
									type="password"
									id="password"
									name="password"
									autoComplete="new-password"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
								/>
							</div>
							<div className="space-y-2">
								<label
									htmlFor="confirmPassword"
									className="text-sm font-medium text-gray-300"
								>
									Confirm Password
								</label>
								<Input
									placeholder="Confirm your password"
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
								/>
							</div>
							<Button
								type="submit"
								className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
							>
								Create Account
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-gray-400 mr-2">Already have an account?</p>
						<button
							className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors duration-300"
							onClick={() => navigate("/")}
						>
							Login
						</button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export default Signup;
