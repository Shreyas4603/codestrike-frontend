import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import Cookies from "js-cookie";
import axios from "axios";
import styles from "@/components/Authentication/styles/Login.module.css";

const Login = () => {
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
				data
			);
			if (response.status === 200) {
				console.log(response);
				toast.success(response.data.data);
				Cookies.set("token", response.data.token);
				localStorage.setItem("username:", response.data.username);
				localStorage.setItem("_id:", response.data._id);
				navigate("/home");
			}
		} catch (error) {
			toast.error("Failed to log in. Please check your credentials.");
		}
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center p-4 ${styles.gradientBackground}`}
		>
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="w-full max-w-md z-10">
				<Card
					className={`rounded-3xl bg-black bg-opacity-70 backdrop-blur-lg ${styles.glowingCard} ${styles.floatingElement}`}
				>
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
							Player Login
						</CardTitle>
						<CardDescription className="text-gray-300">
							Enter your credentials to join the game
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label
									htmlFor="email"
									className="text-sm font-medium text-gray-300"
								>
									Email
								</label>
								<Input
									placeholder="e.g: youremail@example.com"
									id="email"
									name="email"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
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
									placeholder="*****************"
									type="password"
									id="password"
									name="password"
									autoComplete="new-password"
									required
									className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
								/>
							</div>
							<Button
								type="submit"
								className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
							>
								Login
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-gray-400 mr-2">New player?</p>
						<button
							className="text-purple-400 font-bold hover:text-purple-300 transition-colors duration-300"
							onClick={() => navigate("/signup")}
						>
							Create Account
						</button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Login;
