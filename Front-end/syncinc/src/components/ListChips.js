import React from 'react';
import Chip from '@mui/material/Chip';
import { Stack } from '@mui/material';

const ListChips = ({ chipData, justifyContent, sx }) => {
  return (
    <Stack
      columnGap={0.5}
      rowGap={0.5} 
      direction="row"
      flexWrap={'wrap'}
      justifyContent={justifyContent ? justifyContent : 'flex-start'}
      sx={sx}
    >
      {chipData?.map((chip, index) => (
        <Chip
          key={index}
          label={chip}
          color='success'
          variant='outlined'
          fontSize='small'
          size='small'
        />
      ))}
    </Stack>
  );
};

export default ListChips;





