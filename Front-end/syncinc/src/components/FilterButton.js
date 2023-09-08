import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { Checkbox, IconButton, Menu, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';

const FilterButton = ({onFilterSelect, options}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleOpenFilterMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseFilterMenu = () => {
        setAnchorEl(null);
    };

    const toggleSelections = (filterOption) => {
        if (selectedFilters.includes(filterOption)) {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== filterOption));
        } else {
            setSelectedFilters([...selectedFilters, filterOption]);
        }
    }

    useEffect(() => {
        onFilterSelect(selectedFilters);
    }, [selectedFilters]);

    return (
        <>
            <Tooltip title="Filter">
                <IconButton
                    color="disabled"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleOpenFilterMenu}
                >
                    <FilterListRoundedIcon />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ 
                    mt: 5,
                    mr: 1,
                    p: '0 !important',
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseFilterMenu}
                anchorEl={anchorEl}
            >
                {
                    options.map((filter) => (
                        <MenuItem 
                            sx={{
                                p: '0rem !important',
                                pr: '1rem !important',
                            }}
                            key={filter} 
                            onClick={() => toggleSelections(filter)}
                        >
                            <Checkbox
                                checked={selectedFilters.includes(filter)}
                                disabled
                            />
                            <Typography
                                variant='body1'
                                sx={{
                                    color: 'text.primary',
                                }}
                            > 
                            {filter}
                            </Typography>
                        </MenuItem>

                    ))

                }
            </Menu>
        </>
    )
}

export default FilterButton;
