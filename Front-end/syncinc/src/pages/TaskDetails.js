import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Chip, Paper, Stack, Typography, Box, Button } from "@mui/material";

const TaskDetails = () => {
    const taskId = useParams().id;
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const [task, setTask] = useState({});
    const [role , setRole] = useState('');

    const fetchTaskDetails = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}get_user_task/${taskId}/`, config);

            console.log(response.data.data);
            setTask(response.data.data);
            setRole(response.data.data.role);
        } catch {
            notifyWithToast('error', 'Failed to fetch task details');
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchTaskDetails();
    }, []);

    return (
        <Paper 
            sx={{
                borderRadius: '0.5rem',
                p: 2,
            }}

            elevation={0}
        >
            <Box 
                display= 'flex'
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Stack direction='column'>
                    <Typography
                        variant='h5'
                        fontWeight="bold"
                    >
                        {task.name}
                    </Typography>
                    <Typography
                        variant='h6'
                        color="text.secondary"
                    >
                        {task.project_name} | {task.organization_name}
                    </Typography>
                </Stack>

                <Stack direction='column' spacing={1}>
                    <Chip size="small" label={task.status} 
                        color={
                            task.status === 'Overdue' || task.status === 'Rejected' 
                            ? "error"
                            : task.status === 'Completed'
                            ? "success"
                            : "warning"
                        }
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            borderRadius: '0.5rem',
                        }}
                        onClick={() => navigate(`/submit-task/${taskId}`)}
                    >
                        Submit
                    </Button>
                </Stack>

            </Box>
        </Paper>
    )
}

export default TaskDetails;