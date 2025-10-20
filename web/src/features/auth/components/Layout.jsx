import React from 'react';
import LogoutButton from './LogoutButton';
import { useAuth } from '../../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="layout">
            <header className="header">
                {isAuthenticated && <LogoutButton />}
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
