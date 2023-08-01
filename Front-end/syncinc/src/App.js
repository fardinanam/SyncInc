import React, {createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { Home } from "./containers/Home";
import { Login } from "./containers/Login";
import { Register } from "./containers/Register";

export const LoginContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </LoginContext.Provider>
    
  );
}
export default App;
