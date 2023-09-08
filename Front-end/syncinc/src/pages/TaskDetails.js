import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Grid, Paper, Stack, Typography, Box, Button, Chip, Rating, Card, Divider } from "@mui/material";
import { InfoSectionStyle } from "../styles/styles";
import { useTheme } from "@mui/material/styles";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import StackField from "../components/StackField";
import dayjs from "dayjs";
import ListChips from "../components/ListChips";
import UserInfo from "../components/UserInfo";
import TitleBar from "../components/TitleBar";
import AssignmentReturnedRoundedIcon from '@mui/icons-material/AssignmentReturnedRounded';
import { AddTaskModal, AssignTaskModal, ConfirmAcceptTaskModal, ConfirmRejectTaskModal, EditTaskModal, RateTaskModal, TerminateTaskModal } from "../components/Modals";
import StatusChip from "../components/StatusChip";
import InfoSection from "../components/InfoSection";
import SubmitTask from "../components/SubmitTask";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const TaskDetails = () => {
    const taskId = useParams().id;
    const { setLoading } = useLoading();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [task, setTask] = useState({});
    const [roles , setRoles] = useState([]);
    
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [isTerminateTaskModalOpen, setIsTerminateTaskModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isAcceptTaskModalOpen, setIsAcceptTaskModalOpen] = useState(false);
    const [isRejectTaskModalOpen, setIsRejectTaskModalOpen] = useState(false);
    const [isRateTaskModalOpen, setIsRateTaskModalOpen] = useState(false);
    const [isCreateNewVersionModalOpen, setIsCreateNewVersionModalOpen] = useState(false);
    
    const [viewersReview, setViewersReview] = useState({});
    const [canEdit, setCanEdit] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [canSeeSubmission, setCanSeeSubmission] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [canTerminate, setCanTerminate] = useState(false);
    const [canCreateNewVersion, setCanCreateNewVersion] = useState(false);

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

            // console.log(response.data?.data);
            setTask(response.data?.data);
            setRoles(response.data?.data?.roles);
        } catch (error) {
            if (error.response.status === 401) {
                navigate(-1);
                notifyWithToast('error', 'You are not authorized to view this page');
            } else
                notifyWithToast('error', 'Failed to fetch task details');
        }

        setLoading(false);
    }

    const handleDownloadClick = () => {
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = task?.submission?.file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAssignTaskModalClose = (updatedTask) => {
        setIsAssignTaskModalOpen(false);
        if (updatedTask) {
            setTask(updatedTask);
            setRoles(prevRoles => ([
                ...prevRoles,
                ...updatedTask?.roles]
            ));
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
            setTask(prevTask => ({
                ...prevTask,
                ...updatedTask
            }));
        }
    }

    const handleCreateNewVersionModalClose = (updatedTask) => {
        setIsCreateNewVersionModalOpen(false);
        if (updatedTask) {
            navigate("/task/" + updatedTask?.id);
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

    const handleTerminateTaskModalClose = (updatedTask) => {
        setIsTerminateTaskModalOpen(false);
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

    useEffect(() => {
        if (task?.user_task_reviews?.length > 0) {
            const viewersReview = task?.user_task_reviews?.find((review) => review.reviewer.id === user.user_id);
            setViewersReview(viewersReview);
        }
    }, [task?.user_task_reviews]);


    useEffect(() => {
        if (roles?.includes("Project Leader") && 
            task?.status !== "Completed" &&
            task?.status !== "Rejected" &&
            task?.status !== "Submitted" &&
            task.status !== "Terminated") 
            setCanEdit(true);
        else 
            setCanEdit(false);
        

        if (task?.status !== "Completed"
            && task?.status !== "Rejected"
            && task?.status !== "Submitted"
            && task?.status !== "Terminated"
            && task?.roles?.includes("Assignee"))
            setCanSubmit(true);
        else
            setCanSubmit(false);

        if (task?.status === "Submitted" ||
            task?.status === "Rejected" ||
            task?.status === "Completed")
            setCanSeeSubmission(true);
        else
            setCanSeeSubmission(false);

        if (roles?.includes("Project Leader") || roles?.includes("Admin"))
            setCanReview(true);
        else
            setCanReview(false);

        if (task?.roles?.includes("Project Leader") && (task?.status === "In Progress" ||
                task?.status === "Overdue"))
            setCanTerminate(true);
        else
            setCanTerminate(false);

        if (task?.roles?.includes("Project Leader") && ((task?.status === "Rejected" ||
                task?.status === "Terminated")) && !task?.updated_task)
            setCanCreateNewVersion(true);
        else
            setCanCreateNewVersion(false);
        
    }, [task?.status, roles]);

    return (
        <>
        <TitleBar
            title={task?.name}
            subtitle={task?.project?.name + " | " + task?.organization?.name}
            subtitleElement={
                <>
                    
                    <Typography 
                        variant="h7"
                        fontWeight="bold"
                        color="text.secondary"
                        onClick={() => navigate("/project/" + task?.project?.id)}
                        sx={{ cursor: "pointer" }}
                    >{task?.project?.name}</Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography 
                        variant="h7"
                        fontWeight="bold"
                        color="text.secondary"
                        onClick={() => navigate("/organization/" + task?.organization?.id + "/projects/")}
                        sx={{ cursor: "pointer" }}
                    > {task?.organization?.name}</Typography>
                </>
            }   
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
                            startIcon={<AssignmentReturnedRoundedIcon size="small"/>}
                        >
                            Assign
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

                    {canEdit &&
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
                    {
                        task?.previous_task?.id &&
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Previous Task"
                                value={
                                    <Typography
                                        onClick={() => {
                                            navigate("/task/" + task?.previous_task?.id)
                                            navigate(0);
                                        }}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        {task?.previous_task?.name}
                                    </Typography>
                                }
                            />
                        </Grid>
                    }
                    {
                        task?.updated_task?.id &&
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Updated Task"
                                value={
                                    <Typography
                                        onClick={() => {
                                            navigate("/task/" + task?.updated_task?.id);
                                            navigate(0);
                                        }}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        {task?.updated_task?.name}
                                    </Typography>
                                }
                            />
                        </Grid>
                    }
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
                            task?.status === "Rejected") ||
                            task?.status === "Terminated" ?
                            <StackField
                                title="End Date"
                                value={dayjs(task?.end_time).format("DD MMM, YYYY")}
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
                canSubmit &&
                <InfoSection title="Submit Task">
                    <SubmitTask task={task} 
                        onSubmitSuccess={handleSubmitSuccess}
                    />
                </InfoSection>
            }
            {
                canSeeSubmission &&
                <InfoSection title="Submission">
                    <Grid 
                        container
                        rowSpacing={2}
                    >
                    <Grid item xs={12} md={6}>
                    <StackField
                        title="Comment"
                        value={task?.submission?.details ? task.submission.details : "-"}
                    />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <StackField
                        title="Submitted on"
                        value={dayjs(task?.submission?.submission_time).format("DD MMM, YYYY")}
                    />
                    </Grid>
                    <Box 
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        rowGap={1}
                        columnGap={1}
                        mt={1}
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
                    </Grid>
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
                            Reviews
                        </Typography>
                        
                        {
                            canReview &&
                            <>
                            <Button 
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => setIsRateTaskModalOpen(true)}
                                startIcon={<GradeRoundedIcon />}
                            >Review</Button>  
                            <RateTaskModal
                                isOpen={isRateTaskModalOpen}
                                onClose={handleRateTaskModalClose}
                                taskId={task?.id}
                                review={viewersReview}
                                taskType={"User"}
                            />
                            </>
                        }
                    </Box>
                    {task?.user_task_reviews?.length > 0 ?
                    <Box 
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        flexWrap="wrap"
                        rowGap={1}
                        columnGap={1}
                    >
                        {
                            task?.user_task_reviews?.map((review) => (
                                <Card key={review.id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: '0.5rem',
                                        p: 1,
                                        width: '25rem',
                                    }}
                                >
                                    <Stack 
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            <UserInfo userInfo={review.reviewer} />
                                            <Stack 
                                                direction="column"
                                                justifyContent="center"
                                            >
                                                <Typography variant="subtitle2">
                                                    {review.reviewer.name}
                                                </Typography>
                                                <Rating name="simple-controlled"
                                                    size="small"
                                                    value={review.rating}
                                                    readOnly
                                                />
                                            </Stack>
                                        </Stack>
                                        <Typography variant="subtitle2">
                                            {dayjs(review.review_time).format("DD MMM, YYYY")}
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Typography variant="subtitle2" mt={1}
                                        textOverflow={"auto"}
                                    >
                                        {review.comment}
                                    </Typography>

                                </Card>
                            ))
                        }
                    </Box>
                    :
                    <Typography variant="subtitle2">
                        No review yet
                    </Typography>
                    }
                </Box>  
            }          
            <Box
                display='flex'
                justifyContent='flex-end'
            >
            {
                canTerminate &&
                <>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CloseRoundedIcon />}
                        onClick={() => setIsTerminateTaskModalOpen(true)}
                    >
                        Terminate
                    </Button>
                    <TerminateTaskModal
                        isOpen={isTerminateTaskModalOpen}
                        onClose={handleTerminateTaskModalClose}
                        task={task}
                        taskType={"User"}
                    />
                </>
            }
            {
                canCreateNewVersion &&
                <>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => setIsCreateNewVersionModalOpen(true)}
                        startIcon={<AutorenewIcon />}
                    >
                        Create New Version
                    </Button>
                    <AddTaskModal
                        isOpen={isCreateNewVersionModalOpen}
                        onClose={handleCreateNewVersionModalClose}
                        task={task}
                        taskType={"User"}
                        projectId={task?.project?.id}
                    />
                </>
            }                  
            </Box>
        </Stack>
        </>
    )
}

export default TaskDetails;