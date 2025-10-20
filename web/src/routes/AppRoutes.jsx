import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/components/LoginPage';
import RegisterPage from '../features/auth/components/RegisterPage';
import Layout from '../features/auth/components/Layout';
import { authService } from '../features/auth/services/authService';
import ConfirmEmailPage from "../features/auth/components/ConfirmEmailPage";
import TaskListPage from "../features/auth/components/TaskListPage";
import TaskDetailPage from "../features/auth/components/TaskDetailPage";
import UserListPage from "../features/auth/components/UserListPage";

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <LoginPage />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicOnlyRoute>
                            <RegisterPage />
                        </PublicOnlyRoute>
                    }
                />

                <Route path="/confirm-email" element={
                    <PublicOnlyRoute>
                        <ConfirmEmailPage />
                    </PublicOnlyRoute>
                } />


                <Route path="/tasks" element={
                    <TaskListPage />
                } />

                <Route path="/users" element={
                    <UserListPage />
                } />

                <Route path="/task/:title" element={
                    <TaskDetailPage />
                } />


                <Route
                    path="/"
                    element={
                        <Navigate to="/login" replace />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </Layout>
    );
};

const PublicOnlyRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
        return <Navigate to="/tasks" replace />;
    }

    return children;
};

export default AppRoutes;
