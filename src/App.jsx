import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginAndSignup/Login";
import Signup from "./components/LoginAndSignup/Signup";
import Navbar from "./components/Navbar";
import { ModeToggle } from "./components/mode-toggle";
import HomePage from "./components/LoginAndSignup/HomePage";

function App() {
  return (
    <Router>
      <div className="absolute  bottom-5 right-5">
        {" "}
        <ModeToggle />
      </div>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
