import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { heIL } from '@mui/x-date-pickers';

const Load = () => {
    return (
        <Box 
            sx={{
                zIndex: 1000,
                backgroundColor: 'black',
                opacity: "0.3",
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}
        >
            <LinearProgress color='primary'/>
        </Box>
    );
}

export default Load;