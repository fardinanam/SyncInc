import React from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';

import { AuthProvider } from './context/AuthContext';
import Profile from "./pages/Profile";
import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import theme from "./context/ThemeContext";
import AddProject from "./pages/AddProject";
import OrganizationDetails from "./pages/OrganizationDetails";
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
                                        <Route path="/profile" element={<Profile />} exact />
                                        <Route path="/dashboard" element={<Home />} exact />
                                        <Route path="/projects" element={<Projects />} exact />
                                        <Route path="/organizations" element={<Organizations />} exact />
                                    
                                        <Route path="/organization/:id" element={<OrganizationDetails />} exact />
                                        
                                        <Route path="/organization/:id/add-project" element={<AddProject />} exact />
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
