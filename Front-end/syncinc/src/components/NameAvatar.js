import React from 'react';
import { Avatar } from '@mui/material';

const NameAvatar = ({ name }) => {
  // Extract the first two letters of the name
  const initials = name ? name.substring(0, 2).toUpperCase() : '';

  return (
    <Avatar sx={{ bgcolor: '#f50057' }}>
      {initials}
    </Avatar>
  );
};

export default NameAvatar;