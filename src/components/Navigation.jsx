import React, { useState, useEffect } from 'react';
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import HomePage from "./pages/HomePage";
import { Navigate, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Cookies from 'js-cookie';

const Navigation = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	const handleLogin = (token) => {
		Cookies.set("token", token);
		setIsLoggedIn(true);
	};
	const nav = [
		{
			path: "/",
			name: "Home",
			element: <PrivateRoute isLoggedIn={isLoggedIn}><HomePage /></PrivateRoute>,
			isMenu: true,
			isPrivate: true,
		},
		{
			path: "/login",
			name: "Login",
			element: <Login />,
			isMenu: false,
			isPrivate: false,
		},
		{
			path: "/signup",
			name: "Register",
			element: <Signup />,
			isMenu: false,
			isPrivate: false,
		},
		// Uncomment and add more routes as needed
		// {
		// 	path: "/profile",
		// 	name: "Profile",
		// 	element: <Profile />,
		// 	isMenu: true,
		// 	isPrivate: true,
		// },
	];

	return (
		// Render your routes here using a router
		// Example:
		<Routes>
			{nav.map((route, index) => (
				<Route key={index} path={route.path} element={route.path === "/login" ? <Login handleLogin={handleLogin} /> : route.element} />
			))}
		</Routes>
	);
};


export default Navigation;
