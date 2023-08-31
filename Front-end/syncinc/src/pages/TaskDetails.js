import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Grid, Paper, Stack, Typography, Box, Button, Chip } from "@mui/material";
import { InfoSectionStyle } from "../styles/styles";
import { useTheme } from "@mui/material/styles";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditButton from "../components/EditButton";
import StackField from "../components/StackField";
import dayjs from "dayjs";
import ListChips from "../components/ListChips";
import UserInfo from "../components/UserInfo";
import TitleBar from "../components/TitleBar";
import AssignmentReturnedRoundedIcon from '@mui/icons-material/AssignmentReturnedRounded';
import { AssignTaskModal, EditTaskModal } from "../components/Modals";
import StatusChip from "../components/StatusChip";
import InfoSection from "../components/InfoSection";

const TaskDetails = () => {
    const theme = useTheme();
    const taskId = useParams().id;
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);

    const [task, setTask] = useState({});
    const [roles , setRoles] = useState([]);

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

    const mainColor = theme.palette.main

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

            console.log(response.data?.data);
            setTask(response.data?.data);
            setRoles(response.data?.data?.roles);
        } catch {
            notifyWithToast('error', 'Failed to fetch task details');
        }

        setLoading(false);
    }

    const handleAssignTaskModalClose = (updatedTask) => {
        setIsAssignTaskModalOpen(false);
        if (updatedTask) {
            console.log("Updated task: ", updatedTask);
            setTask(updatedTask);
        }
    }

    const handleEditTaskModalClose = (updatedTask) => {
        setIsEditTaskModalOpen(false);
        if (updatedTask) {
            setTask(updatedTask);
        }
    }

    useEffect(() => {
        fetchTaskDetails();
    }, []);

    return (
        <>
        <TitleBar
            title={task?.name}
            subtitle={task?.project?.name + " | " + task?.organization?.name}
        >
            <Stack direction="row" spacing={1}>
                {task?.assignee ?
                <>
                    <Box 
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                    <UserInfo
                        sx={{
                            width: '3rem',
                            height: '3rem'
                        }}
                        userInfo={task?.assignee}
                    />
                    </Box>
                    <Stack 
                        direction="column"
                        justifyContent="center"
                    >
                        <Typography fontWeight="light">
                            Assigned to
                        </Typography>
                        <Typography variant="subtitle2">
                            @{task?.assignee?.username}
                        </Typography>
                    </Stack>
                </> :
                <>
                    {
                        roles.includes("Project Leader") ?
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                        >
                        <Button 
                            size="small" 
                            variant="contained"
                            onClick={() => setIsAssignTaskModalOpen(true)}
                        >
                            <AssignmentReturnedRoundedIcon size="small"/> Assign
                        </Button> 
                        <AssignTaskModal 
                            isOpen={isAssignTaskModalOpen}
                            task={task}
                            organization_id={task?.organization?.id}
                            onClose={handleAssignTaskModalClose}
                        />
                        </Box>
                        :
                        <Stack 
                        direction="column"
                        justifyContent="center"
                        >
                            <Typography variant="subtitle2">
                                <Chip label="Not Assigned" color="error" />
                            </Typography>
                        </Stack>
                    }
                </>
            }
            </Stack> 
        </TitleBar>
        <Stack spacing={2}>
            <Box
                display='flex'
                flexDirection='column'
                sx={InfoSectionStyle}
            >
                <Box
                    display={"flex"}
                    
                >
                    <Typography
                        fontWeight={"bold"}
                        flexGrow={1}
                        mb={1}
                    >
                        Task Details
                    </Typography>

                    {roles?.includes("Project Leader") && 
                        task?.status !== "Completed" &&
                        <>
                            <EditButton 
                                variant="outlined" 
                                size="small"
                                onClick={() => setIsEditTaskModalOpen(true)}
                            >Edit <EditRoundedIcon fontSize="small" /> </EditButton>
                            <EditTaskModal
                                task={task}
                                isOpen={isEditTaskModalOpen}
                                onClose={handleEditTaskModalClose}
                                taskType="User"
                            />
                        </>
                    }
                </Box>

                <Grid 
                    container
                    rowSpacing={2}
                >
                    <Grid item xs={12} md={6}>
                        <StackField
                            title="Task Name"
                            value={task?.name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <Typography fontSize="small" fontWeight="light">
                                Status
                            </Typography>
                            { task?.status &&
                            <Box display="flex"
                                flexDirection="row"
                                justifyContent="flex-start"
                            >
                                <StatusChip status={task?.status} />
                            </Box>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StackField
                            title="Deadline"
                            value={dayjs(task?.deadline).format("DD MMM YYYY")}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                            <StackField
                                title="Tags"
                                value={task?.tags?.length > 0 ?
                                <ListChips 
                                    chipData={task?.tags?.map((task) => task.name)} 
                                    sx={{ mt: 1 }}
                                />
                                : "No tag"
                                }
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <StackField
                            title="Description"
                            value={task?.description}
                        />
                    </Grid>  
                </Grid>
            </Box>
            {
                (task?.status !== "Completed" 
                    || task?.status !== "Accepted"
                    || task?.status !== "Rejected") &&
                <InfoSection title="Submit Task">
                    
                </InfoSection>                  
                
            }
        </Stack>
        </>
    )
}

export default TaskDetails;