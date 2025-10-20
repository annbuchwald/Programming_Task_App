import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import './ConfirmEmailPage.css';

const ConfirmEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const hasConfirmed = useRef(false);

    useEffect(() => {
        const confirmEmail = async () => {
            const code = searchParams.get('code');
            const username = searchParams.get('username');

            if (!code || !username) {
                showToast('Brak wymaganych parametrów potwierdzenia.', 'error');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/user/confirm-email?code=${encodeURIComponent(code)}&username=${encodeURIComponent(username)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    showToast('Email został pomyślnie potwierdzony! Możesz się teraz zalogować.', 'success');
                } else {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Wystąpił błąd podczas potwierdzania adresu email.');
                }
            } catch (error) {
                showToast(error.message, 'error');
            } finally {
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        };

        if (!hasConfirmed.current) {
            hasConfirmed.current = true;
            confirmEmail();
        }
    }, [searchParams, navigate, showToast]);

    return (
        <div className="confirm-email-container">
            <div className="confirm-email-box">
                <h2>Potwierdzono adres email</h2>
                {isLoading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Trwa potwierdzanie adresu email...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmEmailPage;
