import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginPage.css';
import '../../../styles/common.css';
import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const registrationState = location.state?.registration;
    const { updateAuthStatus } = useAuth();

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState('');

    useEffect(() => {
        if (location.state?.from === '/register' && registrationState?.success) {
            setRegistrationSuccess('Rejestracja udana. Możesz się zalogować po potwierdzeniu adresu email.');

            window.history.replaceState({}, document.title);

            const timer = setTimeout(() => {
                setRegistrationSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [location.state, registrationState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await authService.login(credentials.username, credentials.password);
            if (success) {
                updateAuthStatus(true);
                navigate(from, { replace: true });
            } else {
                setError('Nieprawidłowa nazwa użytkownika lub hasło');
            }
        } catch (err) {
            setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Logowanie</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {registrationSuccess && (
                        <div className="success-message">{registrationSuccess}</div>
                    )}
                    <div className="form-group">
                        <label htmlFor="username">Nazwa użytkownika</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                    <div className="register-link">
                        Nie masz konta? <Link to="/register">Zarejestruj się teraz</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
