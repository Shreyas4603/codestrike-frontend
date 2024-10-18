import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { ModeToggle } from "./components/mode-toggle";
import Navigation from "./components/Navigation";


function App() {
  

  return (
    <Router>
      <div className="absolute bottom-5 right-5">
        <ModeToggle />
      </div>
      <Navigation />
    </Router>
  );
}

export default App;
