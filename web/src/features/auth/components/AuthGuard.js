import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthGuard = ({ children }) => {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthGuard;
