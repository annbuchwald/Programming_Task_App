import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Link } from 'react-router-dom';
import './UserListPage.css';

const UserListPage = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 10;
    const { showToast } = useToast();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/user/all');
            const data = await response.json();
            setAllUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('Błąd podczas ładowania użytkowników', 'error');
            setAllUsers([]);
            setFilteredUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        if (query === '') {
            setFilteredUsers(allUsers);
        } else {
            const filtered = allUsers.filter(user =>
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
        setCurrentPage(0);
    }, [searchQuery, allUsers]);

    const getCurrentPageUsers = () => {
        const startIndex = currentPage * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const renderPagination = () => (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                ←
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                    onClick={() => handlePageChange(index)}
                >
                    {index + 1}
                </button>
            ))}
            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                →
            </button>
        </div>
    );

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <Link to="/tasks" className="back-arrow" title="Powrót do zadań">←</Link>
                <h1>Lista użytkowników</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Wyszukaj użytkownika"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            className="clear-search"
                            onClick={clearSearch}
                            aria-label="Wyczyść wyszukiwanie"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Ładowanie użytkowników...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="no-results">
                    {searchQuery ? (
                        <p>Nie znaleziono użytkowników pasujących do "{searchQuery}"</p>
                    ) : (
                        <p>Brak dostępnych użytkowników</p>
                    )}
                </div>
            ) : (
                <>
                    {totalPages > 1 && renderPagination()}

                    <div className="user-list">
                        {getCurrentPageUsers().map((user, index) => (
                            <div key={index} className="user-list-item">
                                <span className="user-number">
                                    {currentPage * usersPerPage + index + 1}.
                                </span>
                                <div className="user-info">
                                    <div><strong>Nazwa:</strong> {user.username}</div>
                                    <div><strong>Email:</strong> {user.email}</div>
                                    <div><strong>Rola:</strong> {user.roles}</div>
                                    <div><strong>Email potwierdzony:</strong> {user.emailConfirmed ? '✅' : '❌'}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && renderPagination()}
                </>
            )}
        </div>
    );
};

export default UserListPage;
