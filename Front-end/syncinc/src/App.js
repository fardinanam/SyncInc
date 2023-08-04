import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import { ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from './context/AuthContext';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import theme from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={
                        <RequireAuth>
                            <Home />
                        </RequireAuth>
                    } exact />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
