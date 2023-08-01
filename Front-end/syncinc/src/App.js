import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import { Home } from "./containers/Home";
import { Login } from "./containers/Login";
import { Register } from "./containers/Register";

function App() {


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
