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
import OrganizationProjects from "./pages/OrganizationProjects";
import MainLayout from "./components/MainLayout";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={
                            <RequireAuth>
                                <MainLayout>
                                    <Routes>
                                        <Route path="/dashboard" element={<Home />} exact />
                                        <Route path="/organizations" element={<Organizations />} exact />
                                        <Route path="/projects" element={<Projects />} exact />
                                        <Route path="/add_project" element={<AddProject />} exact />
                                        <Route path="/organization/:id/projects" element={<OrganizationProjects />} exact />
                                    </Routes>
                                </MainLayout>
                            </RequireAuth>
                        } />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
