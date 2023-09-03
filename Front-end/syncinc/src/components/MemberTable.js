import {  useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, TableContainer, Autocomplete } from '@mui/material';
import ListChips from './ListChips';
import Rating from '@mui/material/Rating';

const MemberTable = ({pageName, members}) => {
    const [open, setOpen] = useState(true);
    
    return (
        <TableContainer component={Box}>
            <Table
                sx={{ 
                    minWidth: 650,
                }} aria-label="a dense table"
                size="small"
            >
                <TableHead>
                    <TableRow>
                        <TableCell width="25%">Name</TableCell>
                        <TableCell width="25%">Expertise</TableCell>
                        <TableCell width="20%">Completed Tasks</TableCell>
                        <TableCell width="15%">Average Rating</TableCell>
                        <TableCell width="15%">Average Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members?.map((member) => (
                    <TableRow
                        key={member.id}
                        sx={{alignItems:"flex-start"}}
                    >   
                        <TableCell width="25%">{member.username}</TableCell>
                        <TableCell width="25%">
                            <ListChips chipData={member.expertise} />
                        </TableCell>
                        <TableCell width="20%">{member.completed_tasks}</TableCell>
                        <TableCell width="15%">
                            <Rating name="average_rating" value={member.avg_rating} precision={0.25} readOnly/>
                        </TableCell>
                        <TableCell width="15%">{member.avg_time}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>  
    );
}

export default MemberTable;