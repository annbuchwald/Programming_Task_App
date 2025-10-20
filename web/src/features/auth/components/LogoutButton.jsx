import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './LogoutButton.css';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { updateAuthStatus } = useAuth();
    const { showToast } = useToast();

    const handleLogout = () => {
        authService.logout();
        updateAuthStatus(false);
        showToast('Zostałeś pomyślnie wylogowany', 'success');
        navigate('/login', { replace: true });
    };

    return (
        <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Wyloguj"
        >
            Wyloguj
        </button>
    );
};

export default LogoutButton;
