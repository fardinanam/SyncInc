
import React from 'react';
import { Grid, Typography } from "@mui/material";
import NameAvatar from './NameAvatar';
import { Avatar } from '@mui/material';
import { baseUrl } from '../utils/config';

const SearchSuggestion = ({ suggestion }) => {
    return (
        <>
            <Grid item md={2}>
                {
                    suggestion.profile_picture
                    ? <Avatar 
                        alt={suggestion.username} 
                        src={suggestion.profile_picture && baseUrl.concat(String(suggestion.profile_picture).substring(1))}
                    />
                    : <NameAvatar name={suggestion.username} />
                }
            </Grid>
            <Grid item md={9}>
                <Grid item md={12}>
                    <Typography variant='body4' fontWeight='bold'>
                        {suggestion.username}
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    <Typography variant='body5'>
                        {suggestion.email}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};
export default SearchSuggestion;