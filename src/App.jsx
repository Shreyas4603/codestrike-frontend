import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/LoginAndSignup/Login";
import Signup from "./Components/LoginAndSignup/Signup";
import Navbar from "./Components/Navbar";
import { ModeToggle } from "./components/mode-toggle";
import HomePage from "./components/LoginAndSignup/HomePage";

function App() {
  return (
    <Router>
     <div className="absolute  bottom-5 right-5"> <ModeToggle/></div>
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
