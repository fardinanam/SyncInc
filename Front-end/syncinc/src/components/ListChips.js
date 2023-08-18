import React from 'react';
import Chip from '@mui/material/Chip';
import { Stack } from '@mui/material';

const ListChips = ({ chipData, justifyContent }) => {
  return (
    <Stack
      columnGap={1}
      rowGap={1} 
      direction="row"
      flexWrap={'wrap'}
      justifyContent={justifyContent ? justifyContent : 'flex-start'}
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





