import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Cookies from "js-cookie";
import { ModeToggle } from "./components/mode-toggle";

import Login from "./components/Authentication/Login";
import { PrivateRoutes } from "./components/utils/PrivateRoutes";
import { PublicRoutes } from "./components/utils/PublicRoutes";
import HomePage from "./components/pages/HomePage";
import Signup from "./components/Authentication/Signup";
import NotFound from "./components/pages/NotFound";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="absolute bottom-5 right-5 z-10">
        <ModeToggle />
      </div>
      <Routes>

        <Route path="/" element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
{
  /* 
{/* <Navigation /> */
}

// </Router> */} */}
