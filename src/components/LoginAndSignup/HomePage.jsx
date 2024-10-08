import React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  

  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token", { path: "/" }); // Specify the path to ensure removal
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const token = Cookies.get("token");

  return (
    <div>
      HomePage
      {token && (
        <button onClick={handleLogout} className="text-white-600 font-bold hover:underline">
          Logout
        </button>
      )}
    </div>
  );
};

export default HomePage;
