import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import { ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from './context/AuthContext';
import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import theme from "./context/ThemeContext";
import AddProject from "./pages/AddProject";

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
                    <Route path="/organizations" element={
                        <RequireAuth>
                            <Organizations />
                        </RequireAuth>
                    } exact />
                    <Route path="/projects" element={
                        <RequireAuth>
                            <Projects />
                        </RequireAuth>
                    } exact />
                    <Route path="/add_project" element={
                        <RequireAuth>
                            <AddProject />
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
