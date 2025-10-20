import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import '../../../styles/common.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setError('Wprowadź poprawny adres email');
            return false;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('Hasło musi zawierać minimum 8 znaków, jedną wielką literę, cyfrę i znak specjalny');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (response.ok) {
                setSuccessMessage('Rejestracja udana! Za chwilę zostaniesz przekierowany do strony logowania.');
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            from: '/register',
                            registration: {
                                success: true,
                                timestamp: new Date().getTime()
                            }
                        },
                        replace: true
                    });
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
            }
        } catch (err) {
            setError('Błąd połączenia z serwerem. Spróbuj ponownie później.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Rejestracja</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    <div className="form-group">
                        <label htmlFor="username">Nazwa użytkownika</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            minLength={3}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <small className="password-hint">
                            Hasło musi zawierać minimum 8 znaków, jedną wielką literę, cyfrę i znak specjalny
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Potwierdź hasło</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="register-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
                    </button>
                    <div className="login-link">
                        Masz już konto? <Link to="/login">Zaloguj się</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
