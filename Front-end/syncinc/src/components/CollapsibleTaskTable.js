import {  useEffect, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Collapse, Divider, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Avatar, Stack, Box } from '@mui/material';
import { AssignTaskModal } from './Modals';
import ListChips from './ListChips';
import dayjs from 'dayjs';
import { baseUrl } from '../utils/config';

const CollapsibleTaskTable = ({title, initialTasks, role, organization_id}) => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [tasks, setTasks] = useState([]);

    const handleAssignTask = (task) => {
        setModalData(task);
        setModalOpen(true);
    }

    const handleModalClose = (updatedTask) => {
        setModalData({});
        setModalOpen(false);

        if (updatedTask) {
            const taskIdx = tasks.findIndex(task => task.id === updatedTask.id);

            if (taskIdx !== -1) {
                const updatedTasks = [...tasks];
                updatedTasks[taskIdx] = updatedTask;
                setTasks(updatedTasks);
            } else {
                setTasks(prevState => ([
                    ...prevState,
                    updatedTask
                ]));
            }
        }
    }

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

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
                            <TableCell  >Task Name</TableCell>
                            <TableCell  >Tags</TableCell>
                            <TableCell  >Assignee</TableCell>
                            <TableCell  >Deadline</TableCell>
                            {
                                String(role).toLowerCase() === "project leader" && 
                                <TableCell>Actions</TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks?.sort((taskA, taskB) => {
                            return dayjs(taskA.deadline).isBefore(dayjs(taskB.deadline))? -1 : 1
                        }).map((task) => (
                        <TableRow
                            key={`task-${task.id}`}
                            sx={{alignItems:"flex-start"}}
                        >   
                            <TableCell  >{task.name}</TableCell>
                            <TableCell  >
                                <ListChips chipData={task.tags?.map((value, _) => value.name)} />
                            </TableCell>
                            <TableCell >
                                {task.assignee? 
                                    <Stack 
                                        direction="row"
                                    >
                                        <Avatar 
                                            sx={{
                                                width: '2rem',
                                                height: '2rem'
                                            }}
                                            alt={task.assignee.name}
                                            src={task.assignee.profile_picture && baseUrl.concat(String(task.assignee.profile_picture).substring(1))}
                                        />
                                        <Box 
                                            display='flex'
                                            flexDirection='column'
                                            justifyContent='center'
                                        >
                                            <Typography variant="subtitle2" 
                                                sx={{
                                                    fontWeight: 'bold',
                                                    textHeight: "100%",
                                                    ml: '0.5rem'
                                                }}
                                            >
                                            {task.assignee.name}
                                        </Typography></Box>
                                    </Stack>
                                    : <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => handleAssignTask(task)}
                                    >
                                        Assign
                                    </Button> 
                                }
                            </TableCell>
                            <TableCell  >{task.deadline? 
                                dayjs(task.deadline).format('DD/MM/YYYY') : "No Deadline"}
                            </TableCell>
                            {String(role).toLowerCase() === "project leader" && 
                                <TableCell
                                    width='auto'
                                >
                                    <IconButton color='primary'><BorderColorRoundedIcon color='primary' fontSize="small"/></IconButton>
                                    <IconButton color='error'><DeleteRoundedIcon color='error' fontSize="small"/></IconButton>
                                </TableCell>
                            }
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <AssignTaskModal
                    isOpen={modalOpen}
                    task={modalData}
                    organization_id={organization_id}
                    onClose={handleModalClose}
                />
                </Collapse>
            </Paper> 
    );
}

export default CollapsibleTaskTable;