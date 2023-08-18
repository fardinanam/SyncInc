import {  useEffect, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Collapse, Divider, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Box, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AssignTaskModal } from './Modals';
import ListChips from './ListChips';
import dayjs from 'dayjs';
import { baseUrl } from '../utils/config';
import UserInfo from './UserInfo';
import { AddTaskModal } from './Modals';

const CollapsibleTaskTable = ({title, initialTasks, role, organization_id, canAddTask}) => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [tasks, setTasks] = useState([]);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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
                    canAddTask && String(role).toLowerCase() === "project leader" &&
                    <>
                        <Tooltip title="Add Task">
                            <IconButton
                                color="success"
                                onClick={() => setIsAddTaskModalOpen(true)}
                            >
                                <AddRoundedIcon />
                            </IconButton>
                        </Tooltip>

                        <AddTaskModal 
                            isOpen={isAddTaskModalOpen}
                            onClose={handleAddTaskModalClose}
                            taskType={"User"}
                        />
                    </>
                }
            </Box>
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
                                {task.assignee ? 
                                    <UserInfo
                                        userInfo={task.assignee}
                                        sx={{
                                            width: '2rem',
                                            height: '2rem'
                                        }}
                                    />
                                    : role === "Project Leader" ? <Button 
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