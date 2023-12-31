import React from "react";
import './App.css';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";

import { AuthProvider } from './context/AuthContext';
import Profile from "./pages/Profile";
import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProject from "./pages/AddProject";
import MainLayout from "./components/MainLayout";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import ToggleColorMode from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";
import ResetPassword from "./pages/ResetPassword";
import Tasks from "./pages/Tasks";
import ProjectDetails from "./pages/ProjectDetails";
import OrganizationProjects from "./pages/OrganizationProjects";
import OrganizationEmployees from "./pages/OrganizationEmployees";
import OrganizationVendors from "./pages/OrganizationVendors";
import TaskDetails from "./pages/TaskDetails";
import Invites from "./pages/Invites";
import { SocketProvider } from "./context/SocketContext";
import OrganizationDetails from "./pages/OrganizationDetails";
import EmailConfirmation from "./pages/EmailConfirmation";

function App() {

    return (
        <ToggleColorMode>
        <LoadingProvider>
            <BrowserRouter>
                <AuthProvider>
                    <SocketProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:username/:token" element={<ResetPassword />} />
                            <Route path="/accounts/verify-email/:token" element={<EmailConfirmation />} />
                            <Route path="*" element={
                                <RequireAuth>
                                    <MainLayout>
                                        <Routes>
                                            <Route path="/" element={<Navigate to="/dashboard" />} />
                                            <Route path="*" element={<ErrorPage />} />
                                            <Route path="/profile" element={<Profile />} exact />
                                            <Route path="/invites" element={<Invites />} exact />
                                            <Route path="/dashboard" element={<Home />} exact />
                                            <Route path="/projects" element={<Projects />} exact />
                                            <Route path="/organizations" element={<Organizations />} exact />
                                            <Route path="/organization/:id" element={<OrganizationDetails />} exact />                                          
                                            
                                            <Route path="/organization/:id/add-project" element={<AddProject />} exact />
                                            <Route path="/project/:id" element={<ProjectDetails />} exact />
                                            <Route path="/tasks" element={<Tasks />} exact />
                                            <Route path="/task/:id" element={<TaskDetails />} exact />
                                        </Routes>
                                    </MainLayout>
                                </RequireAuth>
                            } />
                        </Routes>
                    </SocketProvider>
                </AuthProvider>
            </BrowserRouter>
            <Toaster />
        </LoadingProvider>
        </ToggleColorMode>
    );
}

export default App;
