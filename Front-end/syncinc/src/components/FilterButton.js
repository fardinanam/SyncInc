import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { IconButton, Menu } from '@mui/material';
import { useState } from 'react';

const FilterButton = ({filterOn}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                color="disabled"
                aria-label="open drawer"
                edge="start"
                onClick={() => setOpen(!open)}
            >
                <FilterListRoundedIcon />
            </IconButton>
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={open}
                onClose={() => setOpen(false)}
            >
                
            </Menu>
        </>
    )
}

export default FilterButton;
