import { useState, createContext, useContext } from 'react';
import Load from '../components/Load';

const LoadingContext = createContext(null);

const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {children}
            {loading && <Load />}
        </LoadingContext.Provider>
    )
}

const useLoading = () => {
    const {loading, setLoading} = useContext(LoadingContext);
    
    return {
        loading, 
        setLoading
    };
}

export { LoadingProvider, useLoading };