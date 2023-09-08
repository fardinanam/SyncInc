import { useLayoutEffect, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack, Tooltip } from "@mui/material"
import SummaryCard from "../components/SummaryCard";
import AuthContext from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { baseUrl } from "../utils/config";
import dayjs from "dayjs";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdjustIcon from '@mui/icons-material/Adjust';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";

const Tasks = () => {
    const { authTokens } = useContext(AuthContext);
    const { setLoading } = useLoading();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const navigate = useNavigate();

    const filterOptions = [
        'Completed', 'In Progress', 'Overdue', 'Terminated', 'Rejected'
    ];

    const fetchTasks = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}get_all_tasks_of_user/`, config);
            setTasks(response.data?.data);
        } catch {
            notifyWithToast('error', 'Failed to fetch tasks');
            navigate(-1);
        }
        setLoading(false);
    }

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = tasks.filter((task) => task.name.toLowerCase().includes(value));
        setFilteredTasks(filtered);
    }

    const handleFilterSelect = (filters) => {
        if (filters.length === 0) {
            setFilteredTasks(tasks);
        } else {
            const filtered = tasks.filter((task) => filters.includes(task.status));
            setFilteredTasks(filtered);
        }
    }

    useLayoutEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        setFilteredTasks(tasks);
    }, [tasks]);

    return (
        <>
            <Box 
                display= 'flex'                
                alignItems='center'
                justifyContent='space-between'
            >
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}
                    flexGrow={1}
                >
                    My Tasks
                </Typography>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='flex-end'
                    columnGap={1}
                    rowGap={1}
                >
                    <SearchBar 
                        placeholder='Search Tasks...'
                        onChange={handleSearchChange}
                    />
                    <FilterButton 
                        options={filterOptions}
                        onFilterSelect={handleFilterSelect}
                    />
                </Box>

            </Box>
            <Stack
                display='flex'
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
                sx={{ marginTop: '1rem' }}
                flexWrap='wrap'
                rowGap={2}
                columnGap={2}
            >
                {
                    filteredTasks.map((task) => {
                        let count;
                        let name;
                        
                        if (task.status === 'Completed' || task.status === 'Rejected' 
                            || task.status === 'Terminated') {
                            count = dayjs().diff(task.end_time, 'day');
                            name = count === 1 ? "Day Ago" : "Days Ago";

                            if (count === 0) {
                                count = dayjs().diff(task.end_time, 'hour');
                                name = count === 1 ? "Hour Ago" : "Hours Ago";
                            }

                            if (count === 0) {
                                count = dayjs().diff(task.end_time, 'minute');
                                name = count === 1 ? "Minute Ago" : "Minutes Ago";
                            }

                        } else {
                            count = dayjs(task.deadline).diff(dayjs(), 'day');
                            name = count === 1 ? "Day Left" : "Days Left";
                            if (count === 0) {
                                count = dayjs(task.deadline).diff(dayjs(), 'hour');
                                name = count === 1 ? "Hour Left" : "Hours Left";
                            }
                            
                            // if hour is 0 then convert to minute
                            if (count === 0) {
                                count = dayjs(task.deadline).diff(dayjs(), 'minute');
                                name = count === 1 ? "Minute Left" : "Minutes Left";
                            }

                            // if value is negative then show overdue
                            if (count < 0) {
                                count = dayjs().diff(task.deadline, 'day');
                                name = count === 1 ? "Day Overdued" : "Days Overdued";
                            }
                        }

                        return (<SummaryCard
                            title={task.name}
                            count={count}
                            name={name}
                            key={task.id}
                            onClick={() => navigate(`/task/${task.id}`)}
                        >
                            {
                                task.status === 'Overdue' || task.status === 'Rejected' 
                                ? <Tooltip title="Overdued or Rejected" >
                                    <CancelIcon color="error" fontSize="large" /> 
                                    </Tooltip>
                                : task.status === 'Completed'
                                ? <Tooltip title="Completed" >
                                    <CheckCircleIcon color="success" fontSize="large" />
                                </Tooltip> 
                                : task.status === 'Terminated' 
                                ? <Tooltip title="Terminated" >
                                    <IndeterminateCheckBoxRoundedIcon color="error" fontSize="large" />
                                </Tooltip> 
                                : <Tooltip title="In Progress" >
                                    <AdjustIcon color="success" fontSize="large" />
                                </Tooltip>
                            }
                        </SummaryCard>
                    )})
                }
            </Stack>
        </>
    )

}

export default Tasks;