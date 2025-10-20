import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useOutlet, createRoutesFromChildren} from 'react-router-dom';
import { marked } from 'marked';
import Editor from '@monaco-editor/react';
import api from '../../../app/axios/setupAxios';
import { useToast } from '../../../context/ToastContext';
import './TaskDetailPage.css';
import { taskService } from '../services/taskService';
import {authService} from "../services/authService";

const TaskDetailPage = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [code, setCode] = useState(
        `
    #include <iostream>
    #include <vector>
    #include <fstream>
    #include <sstream>

    using namespace std;

    int main() {
        // nie zmieniaj tej linii
        std::ifstream file( "./input${authService.getUsername()}.txt" );
        string input;
        getline(file, input);

        std::stringstream ss(input);

        std::string arg;
        while (ss >> arg) {
            // miejsce na rozwiazanie
        }
    }
`
    );
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();
    const [submissionResult, setSubmissionResult] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await api.get(`/task/${encodeURIComponent(title)}`);
                setTask(response.data);
            } catch (error) {
                showToast('Błąd podczas ładowania zadania', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTask();
    }, [title, showToast]);

    const handleGoBack = () => {
        navigate('/tasks');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmissionResult([]);

        try {
            let results = await taskService.submitSolution(task.title, code);
            showToast('Wysłano rozwiązanie', 'success');
            results = results
                .trim()
                .match(/EvaluationResult\(isCorrect=(true|false), message=([\s\S]*?)(?=EvaluationResult|$)/gi)
                ?.map(block => {
                    const match = block.match(/EvaluationResult\(isCorrect=(true|false), message=([\s\S]*?)(?=EvaluationResult|$)/i);
                    return {
                        isCorrect: match[1] === 'true',
                        message: match[2].trim()
                    };
                }) || [];

            setSubmissionResult(results);
        } catch (error) {
            if (error.response?.data) {
                setSubmissionResult(error.response.data);
            } else {
                showToast('Błąd podczas wysyłania rozwiązania', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Ładowanie zadania...</p>
            </div>
        );
    }

    if (!task) {
        return <div className="error-message">Nie znaleziono zadania</div>;
    }

    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <div className="task-detail-container">
            <div className="task-description-panel">
                <div className="task-header">
                    <button className="back-button" onClick={handleGoBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="back-button-tooltip">Powrót do listy zadań</span>
                    </button>
                    <h1>{task.title}</h1>
                </div>
                <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: marked(task.description) }}
                />
                <div className="test-cases">
                    <h2>Przypadki testowe:</h2>
                    {task.testCases.map((testCase, index) => (
                        <div key={index} className="test-case">
                            <div className="test-input">
                                <strong>Wejście:</strong> {testCase.input}
                            </div>
                            <div className="test-output">
                                <strong>Spodziewane wyjście:</strong> {testCase.expectedOutput}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="submit-section">
                    <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Wysyłanie...' : 'Wyślij rozwiązanie'}
                    </button>
                    {submissionResult.length > 0 && (
                        <div className="submission-results">
                            <h3>Wynik:</h3>
                            <ul>
                                {submissionResult.map((result, index) => (
                                    <div key={index} className={`test-result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                        {result.message ? (
                                            <p>Wejście: {task.testCases[index].input}, Wyjście: {result.isCorrect ? task.testCases[index].expectedOutput : result.message}, Spodziewane: {task.testCases[index].expectedOutput}</p>
                                        ) : (
                                            <p>Brak wyjścia</p>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div className="editor-panel">
                <Editor
                    height="100%"
                    defaultLanguage="cpp"
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        renderLineHighlight: 'all',
                        matchBrackets: 'always',
                        autoClosingBrackets: 'always',
                        rulers: [80],
                        tabSize: 4,
                    }}
                />
            </div>
        </div>
    );
};

export default TaskDetailPage;
