import {  useEffect, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Collapse, Divider, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Box, Chip, TableContainer } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AssignTaskModal } from './Modals';
import ListChips from './ListChips';
import dayjs from 'dayjs';
import UserInfo from './UserInfo';
import { AddTaskModal } from './Modals';
import { useNavigate } from 'react-router-dom';
import StatusChip from './StatusChip';

const CollapsibleTaskTable = ({title, initialTasks, roles, organization_id, canAddTask}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [assignTaskModalData, setAssignTaskModalData] = useState({});
    const [tasks, setTasks] = useState([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const handleAssignTask = (task) => {
        setAssignTaskModalData(task);
        setIsAssignTaskModalOpen(true);
    }

    const handleModalClose = (updatedTask) => {
        setAssignTaskModalData({});
        setIsAssignTaskModalOpen(false);

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

    const handleAddTaskModalClose = (newTask) => {
        setIsAddTaskModalOpen(false);
        if (newTask) {
            newTask["tags"] = newTask.tags_details;
            setTasks(prevState => ([
                ...prevState,
                newTask
            ]));
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
            <Box
                display='flex'
                justifyContent='space-between'
                flexDirection='row'
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
                {
                    canAddTask && roles?.includes("Project Leader") &&
                    <Box 
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                    >
                        <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => setIsAddTaskModalOpen(true)}
                            sx={{
                                height: '2rem',
                                marginRight: '1rem',
                            }}
                            startIcon={<AddRoundedIcon fontSize='small'/>}
                        >
                            Task
                        </Button>

                        <AddTaskModal 
                            isOpen={isAddTaskModalOpen}
                            onClose={handleAddTaskModalClose}
                            taskType={"User"}
                        />
                    </Box>
                }
            </Box>
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                > 
                    <Divider />
                    { tasks.length > 0 ?
                    <TableContainer
                        component={Box}
                    >
                    <Table 
                        sx={{ 
                            minWidth: 650,
                        }} aria-label="a dense table"
                        size="small"
                    >
                    <TableHead>
                        <TableRow>
                            <TableCell  >Task Name</TableCell>
                            <TableCell  >Tags</TableCell>
                            <TableCell  >Assignee</TableCell>
                            <TableCell  >Deadline</TableCell>
                            {
                                roles?.includes("project leader") && 
                                <TableCell>Actions</TableCell>
                            }
                            <TableCell >status</TableCell>

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
                            <TableCell 
                                style={{cursor: 'pointer'}}
                                onClick={() => navigate(`/task/${task.id}`)}
                            >{task.name}</TableCell>
                            <TableCell  >
                                <ListChips chipData={task.tags?.map((value, _) => value.name)} />
                            </TableCell>
                            <TableCell >
                                {task.assignee ? 
                                    <UserInfo
                                        userInfo={task.assignee}
                                        sx={{
                                            width: '2rem',
                                            height: '2rem'
                                        }}
                                    />
                                    : roles?.includes("Project Leader") ? <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => handleAssignTask(task)}
                                    >
                                        Assign
                                    </Button> 
                                    : "Unassigned"
                                }
                            </TableCell>
                            <TableCell  >{task.deadline? 
                                dayjs(task.deadline).format('DD MMM, YYYY') : "No Deadline"}
                            </TableCell>
                            {roles?.includes("project leader") && 
                                <TableCell
                                    width='auto'
                                >
                                    <IconButton color='primary'><BorderColorRoundedIcon color='primary' fontSize="small"/></IconButton>
                                    <IconButton color='error'><DeleteRoundedIcon color='error' fontSize="small"/></IconButton>
                                </TableCell>
                            }
                            <TableCell  >
                                <StatusChip status={task?.status} />
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer> :
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='10rem'
                >
                    <Typography variant='h6' color='text.secondary'>
                        No Task Assigned
                    </Typography>
                </Box>
                }
                <AssignTaskModal
                    isOpen={isAssignTaskModalOpen}
                    task={assignTaskModalData}
                    organization_id={organization_id}
                    onClose={handleModalClose}
                />
                </Collapse>
            </Paper> 
    );
}

export default CollapsibleTaskTable;