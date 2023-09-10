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
                        <TableCell>Name</TableCell>
                        <TableCell>Expertise</TableCell>
                        <TableCell>Completed Tasks</TableCell>
                        <TableCell>Average Rating</TableCell>
                        <TableCell>Average Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members?.map((member) => {
                        let averageTime = member.avg_time;
                        let timeUnit = '';

                        if (averageTime !== 'N/A') {
                            // convert to hours
                            averageTime = averageTime / 3600;
                            timeUnit = 'hours';

                            if (averageTime > 24) {
                                // convert to days
                                averageTime = averageTime / 24;
                                timeUnit = 'days';
                            }

                            // convert to integer
                            averageTime = Math.round(averageTime);
                        }

                        if (averageTime < 0) {
                            averageTime = 0;
                        }
                        
                        return (
                            <TableRow
                                key={member.id}
                                sx={{alignItems:"flex-start"}}
                            >   
                                <TableCell>{member.username}</TableCell>
                                <TableCell>
                                    <ListChips chipData={member.expertise} />
                                </TableCell>
                                <TableCell>{member.completed_tasks}</TableCell>
                                <TableCell>
                                    <Rating name="average_rating" value={member.avg_rating} precision={0.25} readOnly/>
                                </TableCell>
                                <TableCell>{averageTime} {timeUnit}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>  
    );
}

export default MemberTable;