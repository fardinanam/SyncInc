import { useEffect, useState } from 'react';
import { baseUrl } from '../utils/config';
import { Avatar, IconButton, Menu, Box, Stack, Tooltip, Typography, Divider } from '@mui/material';
import ListChips from './ListChips';

const UserInfo = ({sx, userInfo}) => {
    const [profilePicUrl, setProfilePicUrl] = useState();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [name, setName] = useState('');

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    useEffect(() => {
        if (userInfo) {
            if (userInfo?.profile_picture) {
                setProfilePicUrl(userInfo?.profile_picture);
            }

            if (userInfo?.name)
                setName(userInfo?.name);
            else if (userInfo?.first_name && userInfo?.last_name)
                setName(userInfo?.first_name + ' ' + userInfo.last_name);
            else 
                setName(userInfo?.username);
        }
    }, [userInfo]);

    return (
        <>
            <Tooltip 
                title={name}
            >
            <IconButton
                onClick={handleOpenUserMenu}
            >
                <Avatar 
                    sx={sx}
                    alt={name && name}
                    src={profilePicUrl && profilePicUrl}
                />
            </IconButton>
            </Tooltip>
            <Menu
                sx={{ 
                    mt: '4rem',
                    borderRadius: '1rem !important',
                    maxWidth: '40rem'
                }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <Stack
                    direction="column"
                    spacing={1}
                    p={2}
                >
                    <Box 
                        display="flex"
                        flexDirection="row"
                        alignItems="center"

                    >
                        <Avatar
                            sx={{
                                width: '4rem',
                                height: '4rem'
                            }}
                            alt={name}
                            src={profilePicUrl && profilePicUrl}
                        />
                        <Stack
                            direction="column"
                            ml={1}
                        >
                            <Typography
                                fontWeight="bold"
                            >
                                {name}
                            </Typography>
                            {userInfo?.email &&
                                <Typography>
                                    {userInfo?.email}
                                </Typography>
                            }
                            {userInfo?.username &&
                                <Typography>
                                    @{userInfo?.username}
                                </Typography>
                            }
                    </Stack>
                    
                    </Box>
                    {   
                        userInfo?.expertise 
                        &&
                        <>
                            <Divider variant='middle' />
                            <ListChips
                                chipData={userInfo?.expertise}    
                            />
                        </>
                    }
                </Stack>
            </Menu>
        </>
    )
};

export default UserInfo;