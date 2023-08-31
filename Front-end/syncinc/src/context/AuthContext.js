import { createContext, useEffect, useState, useLayoutEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { baseUrl } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import { refreshTokenDelay } from '../utils/config';
import notifyWithToast from '../utils/toast';
import { useLoading } from './LoadingContext';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    let [isStarting, setIsStarting] = useState(true); // to call updateToken() on start
    let [authTokens, setAuthTokens] = useState(() => 
            localStorage.getItem('authTokens') 
            ? JSON.parse(localStorage.getItem('authTokens')) 
            : null
        );
    let [user, setUser] = useState(
        () => authTokens ? jwt_decode(authTokens.access) : null
    );
    
    const {setLoading} = useLoading();

    let navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({
            'email': e.target.email.value,
            'password': e.target.password.value
        });

        try {
            let response = await axios.post(baseUrl + 'accounts/login/', 
                body, config
            );

            let data = response.data;

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data?.access)); // decode the JWT token
                localStorage.setItem('authTokens', JSON.stringify(data));
                navigate('/dashboard');
            }
        } catch (error) {
            navigate('/login');
            notifyWithToast("error", error.response?.data?.message);
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
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const body = JSON.stringify({'refresh': authTokens?.refresh});

            try {
                let response = await axios.post(baseUrl + 'accounts/token/refresh/', 
                    body,
                    config 
                )

                let data = await response.data;

                if (response.status === 200) {
                    setAuthTokens(data);
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    setUser(jwt_decode(data.access));
                } 
            } catch (error) {
                console.log("Error refreshing token");
                logoutUser();
            }
        }
    }

    let contextData = {
        authTokens: authTokens,
        user: user,
        setUser: setUser,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useLayoutEffect(() => {
        if (isStarting) {
            setLoading(true);
            updateToken();
            setLoading(false);
            setIsStarting(false);
        }}
        , [isStarting])

    useEffect(() => {
        const interval = setInterval(updateToken, refreshTokenDelay);
        return () => clearInterval(interval);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {!isStarting && children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider }