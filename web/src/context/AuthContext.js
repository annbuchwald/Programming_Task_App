import React, { createContext, useContext, useState } from 'react';
import { authService } from '../features/auth/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    const updateAuthStatus = (status) => {
        setIsAuthenticated(status);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, updateAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
