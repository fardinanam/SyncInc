import { createContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { baseUrl } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import { refreshTokenDelay } from '../utils/config';
import notifyWithToast from '../utils/toast';
import { useLoading } from './LoadingContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => 
            localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null
        );
    let [user, setUser] = useState(() => 
            localStorage.getItem('authTokens') 
            ? jwt_decode(localStorage.getItem('authTokens')) 
            : null
        );
    
    const {setLoading} = useLoading();

    let navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        let response = await fetch(baseUrl + 'accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': e.target.email.value,
                'password': e.target.password.value
            })
        });
        
        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access)); // decode the JWT token
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/dashboard');
        } else {
            navigate('/login');
            notifyWithToast("error", data.message);
        }

        setLoading(false);
    }

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    }

    const updateToken = async () => {
        if (authTokens && authTokens.refresh) {
            // setLoading(true);   
            let response = await fetch(baseUrl + 'accounts/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'refresh': authTokens?.refresh})
            })

            let data = await response.json();

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }

            // setLoading(false);
        }
    }

    let contextData = {
        authTokens: authTokens,
        user: user,
        setUser: setUser,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {
        const interval = setInterval(updateToken, refreshTokenDelay);
        return () => clearInterval(interval);
    }, [authTokens]);

    useEffect(() => {
        setLoading(true);
        updateToken();
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider }