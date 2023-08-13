import * as React from 'react';
import { useLoading } from '../context/LoadingContext';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';

const Load = () => {
    const {loading} = useLoading();
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
            open={loading}
            >
            <CircularProgress color='inherit'/>
        </Backdrop>
    );
}

export default Load;