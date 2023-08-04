import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const RequireAuth = ({children}) => {
    let {user} = useContext(AuthContext);

    return (
        // if user is logged in, render the Outlet (child) component
        // else redirect to login page
        user 
        ? children
        : <Navigate to='/login' /> 
    );
}

export default RequireAuth;