import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const RequireAuth = () => {
    let {user} = useContext(AuthContext);

    return (
        user 
        ? <Outlet />
        : <Navigate to='/login' /> 
    );
}

export default RequireAuth;