import {  useEffect, useMemo, useState } from 'react';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Collapse, Divider, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Box, Stack, TableContainer, TableSortLabel } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AssignTaskModal } from './Modals';
import ListChips from './ListChips';
import dayjs from 'dayjs';
import UserInfo from './UserInfo';
import { AddTaskModal } from './Modals';
import { useNavigate } from 'react-router-dom';
import StatusChip from './StatusChip';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import { EnhancedTableHead } from './EnhancedTable';
import { getComparator, stableSort } from '../utils/comparator';
import SearchBar from './SearchBar';

const CollapsibleTaskTable = ({title, initialTasks, roles, organization_id, canAddTask}) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('deadline');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [assignTaskModalData, setAssignTaskModalData] = useState({});
    const [tasks, setTasks] = useState([]);
    const [searchedTasks, setSearchedTasks] = useState([]);
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

    const handleSearch = (event) => {
        const searchedValue = event.target.value.toLowerCase();
        const searchedTasks = tasks?.filter((task) => {
            return task.name.toLowerCase().includes(searchedValue) 
                || task.status.toLowerCase().includes(searchedValue) ;
        });
        setSearchedTasks(searchedTasks);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        setTasks(initialTasks);
        setSearchedTasks(initialTasks);
    }, [initialTasks]);

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Task Name', sortable: true },
        { id: 'tags', numeric: false, disablePadding: false, label: 'Tags', sortable: false },
        { id: 'assignee', numeric: false, disablePadding: false, label: 'Assignee', sortable: false },
        { id: 'deadline', numeric: false, disablePadding: false, label: 'Deadline', sortable: true },
        { id: 'status', numeric: false, disablePadding: false, label: 'Status', sortable: true },
    ];

    const visibleRows = useMemo(() => 
        stableSort(searchedTasks, getComparator(order, orderBy)
    ), [order, orderBy, searchedTasks]);

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
                <Stack 
                    direction='row'
                    alignItems='center'
                    spacing={1}
                    mr={1}
                >
                    {
                        open && <SearchBar 
                        onChange={handleSearch}
                        placeholder="Search by name or status..."
                    />
                    }
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
                </Stack>
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
                    <EnhancedTableHead
                        headCells={headCells}
                        rowCount={tasks?.length}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {visibleRows?.map((task) => {
                            let canSeeDetails = false;
                            if (task?.assignee?.id === user?.user_id || 
                                roles?.includes("project leader") ||
                                roles?.includes("admin"))
                                canSeeDetails = true;

                        return (
                        <TableRow
                            key={`task-${task.id}`}
                            sx={{alignItems:"flex-start"}}
                        >   
                            <TableCell 
                                style={canSeeDetails ? {cursor: 'pointer'} : null}
                                onClick={() => {canSeeDetails && navigate(`/task/${task.id}`)}
                                }
                            >{task.name}</TableCell>
                            <TableCell  >
                                <ListChips chipData={task.tags?.map((value, _) => value.name)} />
                            </TableCell>
                            <TableCell >
                                {task.assignee ? 
                                    <Stack 
                                        flexDirection="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <UserInfo
                                            userInfo={task.assignee}
                                            sx={{
                                                width: '2rem',
                                                height: '2rem'
                                            }}
                                        />
                                        <Box 
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                        <Typography 
                                            sx={{
                                                fontSize: '0.8rem',
                                            }}    
                                        >
                                            {task.assignee?.name}
                                        </Typography>
                                        </Box>
                                    </Stack>
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
                        )})}
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