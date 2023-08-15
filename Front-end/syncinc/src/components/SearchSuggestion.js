
import React from 'react';
import { Grid, Typography } from "@mui/material";
import NameAvatar from './NameAvatar';

const SearchSuggestion = ({ suggestion }) => {
    return (
        <>
            <Grid item md={2}>
                <NameAvatar name={suggestion.username} />
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