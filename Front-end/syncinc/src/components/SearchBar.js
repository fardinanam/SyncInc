import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search'; 

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid',
    borderColor: theme.palette.main[theme.palette.mode],
    backgroundColor: theme.palette.background[theme.palette.mode],
    '&:hover': {
        backgroundColor: theme.palette.background[theme.palette.mode],
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
    borderRadius: '2rem'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
            width: '28ch',
        },
        },
    },
}));

const SearchBar = ({onChange, placeholder}) => {
    return (
        <Search color='background'>
            <SearchIconWrapper>
                <SearchIcon size="small"/>
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={placeholder ? placeholder : "Search…"}
                size='small'
                inputProps={{ 'aria-label': 'search' }}
                onChange={onChange}
            />
        </Search>
    )
}

export default SearchBar;