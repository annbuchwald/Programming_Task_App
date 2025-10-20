import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { useToast } from '../../../context/ToastContext';
import './TaskListPage.css';
import {jwtDecode} from "jwt-decode";

const TaskListPage = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 10;
    const { showToast } = useToast();
    const [completedMap, setCompletedMap] = useState({});
    const [hoveredTask, setHoveredTask] = useState(null);

    const checkIfCompleted = async (title) => {
        if (completedMap[title] !== undefined) return;

        try {
            const res = await fetch(`http://localhost:8080/task/is-completed?title=${encodeURIComponent(title)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Błąd odpowiedzi z serwera');
            const text = await res.text();
            const isCompleted = text.trim() === 'true';
            setCompletedMap(prev => ({ ...prev, [title]: isCompleted }));
        } catch (error) {
            console.error(`Błąd sprawdzania ukończenia zadania "${title}":`, error);
        }
    };

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await taskService.getTasks();
            setAllTasks(response.tasks);
            setFilteredTasks(response.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showToast('Błąd podczas ładowania zadań', 'error');
            setAllTasks([]);
            setFilteredTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const token = localStorage.getItem('token');
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded.sub === "admin";
        } catch (err) {
            console.error('Błąd dekodowania żetonu:', err);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        if (query === '') {
            setFilteredTasks(allTasks);
        } else {
            const filtered = allTasks.filter(task =>
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query)
            );
            setFilteredTasks(filtered);
        }
        setCurrentPage(0);
    }, [searchQuery, allTasks]);

    const getCurrentPageTasks = () => {
        const startIndex = currentPage * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
        return filteredTasks.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

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

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h1>Lista zadań</h1>
                {isAdmin && (
                    <Link to="/users" className="admin-users-button">
                        Lista użytkowników
                    </Link>
                )}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Wyszukaj zadanie"
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
                    <p>Ładowanie zadań...</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="no-results">
                    {searchQuery ? (
                        <p>Nie znaleziono zadań pasujących do "{searchQuery}"</p>
                    ) : (
                        <p>Brak dostępnych zadań</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="task-list">
                        {getCurrentPageTasks().map((task, index) => (
                            <Link
                                to={`/task/${encodeURIComponent(task.title)}`}
                                key={index}
                                className={`task-list-item ${
                                    hoveredTask === task.title && completedMap[task.title] ? 'completed-task-hover' : ''
                                }`}
                                onMouseEnter={() => {
                                    setHoveredTask(task.title);
                                    checkIfCompleted(task.title);
                                }}
                                onMouseLeave={() => setHoveredTask(null)}
                            >
    <span className="task-number">
        {currentPage * tasksPerPage + index + 1}.
    </span>
                                <span className="task-title">{task.title}</span>
                                <span className="task-arrow">→</span>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
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
                    )}
                </>
            )}
        </div>
    );
};

export default TaskListPage;
