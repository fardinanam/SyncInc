import { createContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { baseUrl } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import { refreshTokenDelay } from '../utils/config';
import Load from '../components/Load';

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
    
    let [loading, setLoading] = useState(false);

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
        console.log('data:', data);
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access)); // decode the JWT token
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/dashboard');
        } else {
            window.location = '/login';
            alert(data.message);
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
        if (authTokens?.refresh) {
            setLoading(true);   
            console.log('Update Token Called with authTokens:', authTokens?.refresh);
            let response = await fetch(baseUrl + 'accounts/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'refresh': authTokens?.refresh})
            })

            let data = await response.json();
            // console.log('updateToken data:', data);

            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }

            setLoading(false);
        }
    }

    let contextData = {
        authTokens: authTokens,
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        const interval = setInterval(updateToken, refreshTokenDelay);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <Load /> : children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export { AuthProvider }