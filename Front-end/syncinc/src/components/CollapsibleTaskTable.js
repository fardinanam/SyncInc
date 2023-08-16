import {  useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Collapse, Divider, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button } from '@mui/material';
import ListChips from './ListChips';
import dayjs from 'dayjs';

const CollapsibleTaskTable = ({title, tasks}) => {
    const [open, setOpen] = useState(true);

    return (
        <Paper 
            sx={{
                marginTop: '1.5rem',
                borderRadius: '0.5rem'
            }} 
            elevation={0}
        >
            <Typography variant='h6' sx={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    { open 
                        ? <KeyboardArrowDownRoundedIcon /> 
                        : <KeyboardArrowRightRoundedIcon />
                    }
                </IconButton>
                    {title}
            </Typography>
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                > 
                    <Divider />
                    <Table sx={{ minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">Task Name</TableCell>
                            <TableCell width="25%">Tags</TableCell>
                            <TableCell width="20%">Assignee</TableCell>
                            <TableCell width="15%">Deadline</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks?.map((task) => (
                        <TableRow
                            key={`task-${task.id}`}
                            sx={{alignItems:"flex-start"}}
                        >   
                            <TableCell width="25%">{task.name}</TableCell>
                            <TableCell width="25%">
                                <ListChips chipData={task.tags?.map((value, _) => value.name)} />
                            </TableCell>
                            <TableCell width="20%">
                                {task.assignee? task.assignee.first_name + " " + task.assignee.last_name 
                                    : <Button variant="outlined" size="small">Assign</Button> 
                                }
                            </TableCell>
                            <TableCell width="15%">{task.deadline? 
                                dayjs(task.deadline).format('DD/MM/YYYY') : "No Deadline"}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                </Collapse>
            </Paper> 
    );
}

export default CollapsibleTaskTable;