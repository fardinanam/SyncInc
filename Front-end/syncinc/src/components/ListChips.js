import React from 'react';
import Chip from '@mui/material/Chip';
import { Stack } from '@mui/material';

const ListChips = ({ chipData }) => {
  return (
    <Stack
      spacing={1}  
      direction="row"
    >
      {chipData?.map((chip, index) => (
        <Chip
          key={index}
          label={chip}
          color='success'
          variant='outlined'
          fontSize='small'
        />
      ))}
    </Stack>
  );
};

export default ListChips;





