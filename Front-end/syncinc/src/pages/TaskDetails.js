import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Grid, Paper, Stack, Typography, Box, Button, Chip, Rating } from "@mui/material";
import { InfoSectionStyle } from "../styles/styles";
import { useTheme } from "@mui/material/styles";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import StackField from "../components/StackField";
import dayjs from "dayjs";
import ListChips from "../components/ListChips";
import UserInfo from "../components/UserInfo";
import TitleBar from "../components/TitleBar";
import AssignmentReturnedRoundedIcon from '@mui/icons-material/AssignmentReturnedRounded';
import { AssignTaskModal, ConfirmAcceptTaskModal, ConfirmRejectTaskModal, EditTaskModal, RateTaskModal } from "../components/Modals";
import StatusChip from "../components/StatusChip";
import InfoSection from "../components/InfoSection";
import SubmitTask from "../components/SubmitTask";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';

const TaskDetails = () => {
    const taskId = useParams().id;
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);

    const [task, setTask] = useState({});
    const [roles , setRoles] = useState([]);

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isAcceptTaskModalOpen, setIsAcceptTaskModalOpen] = useState(false);
    const [isRejectTaskModalOpen, setIsRejectTaskModalOpen] = useState(false);
    const [isRateTaskModalOpen, setIsRateTaskModalOpen] = useState(false);

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

            setTask(response.data?.data);
            setRoles(response.data?.data?.roles);
        } catch {
            notifyWithToast('error', 'Failed to fetch task details');
        }

        setLoading(false);
    }

    const handleDownloadClick = () => {
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = task?.file;
        link.download = 'your_file_name.extension'; // Set the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAssignTaskModalClose = (updatedTask) => {
        setIsAssignTaskModalOpen(false);
        if (updatedTask) {
            setTask(updatedTask);
        }
    }

    const handleRateTaskModalClose = (updatedTask) => {
        setIsRateTaskModalOpen(false);
        if (updatedTask) {
            setTask(prevTask => ({
                ...prevTask,
                ...updatedTask
            }));
        }
    }

    const handleSubmitSuccess = (updatedTask) => {
        setTask(prevTask => ({
            ...prevTask,
            ...updatedTask
        }));
    }

    const handleEditTaskModalClose = (updatedTask) => {
        setIsEditTaskModalOpen(false);
        if (updatedTask) {
            setTask(updatedTask);
        }
    }

    const handleTaskAcceptRejectModalClose = (updatedTask) => {
        setIsAcceptTaskModalOpen(false);
        setIsRejectTaskModalOpen(false);
        if (updatedTask) {
            setTask(prevTask => ({
                ...prevTask,
                ...updatedTask
            }));
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
                        task?.status !== "Accepted" &&
                        task?.status !== "Rejected" &&
                        task?.status !== "Submitted" &&
                        <>
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => setIsEditTaskModalOpen(true)}
                                endIcon={<EditRoundedIcon fontSize="small" />}
                            >Edit </Button>
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
                        {
                            (task?.status === "Completed" ||
                            task?.status === "Accepted" ||
                            task?.status === "Rejected") ?
                            <StackField
                                title="End Date"
                                value={dayjs(task?.end_date).format("DD MMM YYYY")}
                            />
                            :
                            <StackField
                                title="Deadline"
                                value={dayjs(task?.deadline).format("DD MMM YYYY")}
                            />
                        }
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
                    && task?.status !== "Accepted"
                    && task?.status !== "Rejected"
                    && task?.status !== "Submitted"
                    && task?.roles?.includes("Assignee")
                ) ?
                <InfoSection title="Submit Task">
                    <SubmitTask task={task} 
                        onSubmitSuccess={handleSubmitSuccess}
                    />
                </InfoSection>                  
                : null
            }
            {
                (task?.status === "Submitted" ||
                task?.status === "Accepted" ||
                task?.status === "Rejected" ||
                task?.status === "Completed") &&
                <InfoSection title="Submission">
                    <Box 
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        rowGap={1}
                        columnGap={1}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            href={task?.submission?.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<DownloadRoundedIcon />}
                            onClick={handleDownloadClick}
                        >Download File </Button>
                        {
                            task?.roles?.includes("Project Leader") 
                            && task?.status === "Submitted" &&
                            <>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    onClick={() => setIsAcceptTaskModalOpen(true)}
                                    startIcon={<CheckRoundedIcon />}
                                >Mark as Accepted</Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<CloseRoundedIcon />}
                                    onClick={() => setIsRejectTaskModalOpen(true)}
                                >Mark as Rejected</Button>
                                
                                <ConfirmAcceptTaskModal
                                    isOpen={isAcceptTaskModalOpen}
                                    onClose={handleTaskAcceptRejectModalClose}
                                    task={task}
                                    taskType={"User"}
                                />
                                <ConfirmRejectTaskModal
                                    isOpen={isRejectTaskModalOpen}
                                    onClose={handleTaskAcceptRejectModalClose}
                                    task={task}
                                    taskType={"User"}
                                />

                            </>
                        }
                        
                    </Box>
                </InfoSection>
            }
            { (task?.status === "Completed" ||
            task?.status === "Rejected") &&
                <Box
                    display='flex'
                    flexDirection='column'
                    sx={InfoSectionStyle}
                >
                    <Box 
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                            mb={1}
                        >
                            Rating
                        </Typography>
                        
                        {
                            task?.roles?.includes("Project Leader") &&
                            (task?.status === "Completed" ||
                            task?.status === "Rejected" ) &&
                            <>
                            <Button 
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => setIsRateTaskModalOpen(true)}
                                startIcon={<GradeRoundedIcon />}
                            >Rate</Button>  
                            <RateTaskModal
                                isOpen={isRateTaskModalOpen}
                                onClose={handleRateTaskModalClose}
                                task={task}
                                taskType={"User"}
                            />
                            </>
                        }
                    </Box>
                    <Rating name="simple-controlled" 
                        value={task?.rating} 
                        readOnly
                    />  
                </Box>  
            }                                  
        </Stack>
        </>
    )
}

export default TaskDetails;