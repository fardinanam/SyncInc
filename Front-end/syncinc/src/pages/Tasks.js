import { useLayoutEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stack } from "@mui/material"
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

const Tasks = () => {
    const { authTokens } = useContext(AuthContext);
    const { setLoading } = useLoading();
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

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

            setTasks(response.data.data);
        } catch {
            notifyWithToast('error', 'Failed to fetch tasks');
            navigate(-1);
        }
        setLoading(false);
    }

    useLayoutEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <Box 
                display= 'flex'                
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 'bold' }}
                    flexGrow={1}
                >
                    Your Tasks
                </Typography>
            </Box>
            <Stack
                display='flex'
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
                sx={{ marginTop: '1rem' }}
                flexWrap='wrap'
                spacing={2}
            >
                {
                    tasks.map((task) => {
                        let count = dayjs(task.deadline).diff(dayjs(), 'day');
                        let name = count === 1 ? "Day Left" : "Days Left";

                        // if day is 0 then convert to hour
                        if (count === 0) {
                            count = dayjs(task.deadline).diff(dayjs(), 'hour');
                            name = count === 1 ? "Hour Left" : "Hours";
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
                        return (<SummaryCard
                            title={task.name}
                            count={count}
                            name={name}
                            key={task.id}
                            onClick={() => navigate(`/task/${task.id}`)}
                        >
                            {
                                task.status === 'Overdue' || task.status === 'Rejected' 
                                ? <CancelIcon color="error" fontSize="large" /> 
                                : task.status === 'Completed'
                                ? <CheckCircleIcon color="success" fontSize="large" />
                                : <AdjustIcon color="success" fontSize="large" />
                            }
                        </SummaryCard>
                    )})
                }
            </Stack>
        </>
    )

}

export default Tasks;