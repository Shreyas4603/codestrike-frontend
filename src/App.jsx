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

function App() {
  return (
    <BrowserRouter>
      <div className="absolute top-5 left-5">
        <ModeToggle />
      </div>
      <Routes>

        <Route path="/" element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/home" element={<HomePage />} />
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
