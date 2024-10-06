import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/LoginAndSignup/Login";
import Signup from "./Components/LoginAndSignup/Signup";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
