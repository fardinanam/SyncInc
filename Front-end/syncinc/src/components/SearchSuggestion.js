
import React from 'react';
import { Grid, Typography } from "@mui/material";
import NameAvatar from './NameAvatar';
import { Avatar } from '@mui/material';
import { baseUrl } from '../utils/config';
import ListChips from './ListChips';

const SearchSuggestion = ({ suggestion, selected }) => {
    return (
        <>
            <Grid item md={2}>
                {/* {
                    suggestion.profile_picture
                    ? <Avatar 
                        alt={suggestion.username} 
                        src={suggestion.profile_picture && suggestion.profile_picture}
                    />
                    : <NameAvatar name={suggestion.username} />
                } */}
                <Avatar alt={suggestion.username} src={suggestion.profile_picture && suggestion.profile_picture} />
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
            {!selected && suggestion.filtered_expertise && suggestion.filtered_expertise.length > 0 &&
            <Grid item md={12} mt={1}>
                <ListChips chipData={suggestion.filtered_expertise} />
            </Grid>
            }
            
        </>
    );
};
export default SearchSuggestion;