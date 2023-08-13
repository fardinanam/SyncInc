import React from 'react';
import Chip from '@mui/material/Chip';

const ListChips = ({ chipData }) => {
  return (
    <>
      {chipData.map((chip, index) => (
        <Chip
          key={index}
          label={chip}
          color='primary'
        />
      ))}
    </>
  );
};

export default ListChips;





