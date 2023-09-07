import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, Button, Chip, CssBaseline, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CollapsibleTaskTable from "../components/CollapsibleTaskTable";
import { AddMemberModal, AddTaskModal, ConfirmProjectCompleteModal, EditProjectModal } from "../components/Modals";
import TitleBar from "../components/TitleBar";
import UserInfo from "../components/UserInfo";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import StackField from "../components/StackField";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import StatusChip from "../components/StatusChip";
import dayjs from "dayjs";

const ProjectDetails = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [status, setStatus] = useState();
    const [roles, setRoles] = useState([]);
    const [openAssignProjectLeaderModal, setOpenAssignProjectLeaderModal] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [canComplete, setCanComplete] = useState(false);
    const [isCompleteProjectModalOpen, setIsCompleteProjectModalOpen] = useState(false);


    const fetchProjectDetails = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authTokens?.access,
            },
        }

        setLoading(true);

        try {
            let response = await axios.get(
                `${baseUrl}get_project/${id}`,
                config
            )

            setProject(response.data.data);
            setRoles(response.data.data.roles);
            response = await axios.get(
                `${baseUrl}user_tasks/${id}`,
                config,
            )
            
            setUserTasks(response.data.data);
            response = await axios.get(
                `${baseUrl}vendor_tasks/${id}`,
                config,
            )

            // setVendorTasks(response.data.data);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }

        setLoading(false);
    }

    const handleEditProjectModalClose = (project) => {
        if (project) {
            setProject(prevProject => ({
                ...prevProject,
                ...project
            }));
        }
        setIsEditProjectModalOpen(false);
    }

    const handleProjectLeaderModalClose = (project_leader) => {
        console.log(project_leader);
        if (project_leader) {
            setProject(prevState => ({
                ...prevState,
                project_leader: project_leader,
            }));
            
            if(project_leader.username === user.username) {
                setRoles(prevState => ([
                    ...prevState,
                    "Project Leader"
                ]));
            }
        }
        setOpenAssignProjectLeaderModal(false);
    }

    const handleCompleteProjectModalClose = (project) => {
        if (project) {
            // console.log(project);
            setProject(prevProject => ({
                ...prevProject,
                ...project
            }));
        }
        setIsCompleteProjectModalOpen(false);
    }

    useEffect(() => {
        fetchProjectDetails();
    }, []);

    useEffect(() => {
        if (project?.end_time) {
            setStatus("Completed");
        } else if (project?.task_count > 0) {
            setStatus("In Progress");
        } else {
            setStatus("New");
        }
    }, [project]);

    useEffect(() => {
        if (roles.includes("Project Leader") && !project?.has_ended) {
            if (userTasks.every(task => task.status === "Completed"
                || task.status === "Rejected" || task.status === "Terminated")) {
                setCanComplete(true);
                return;
            }
        }

        setCanComplete(false);
    }, [userTasks, roles, project]);

    return (
        <>
            <CssBaseline />
            <TitleBar 
                title={project?.name}
                subtitleElement={
                    <Typography variant="h7"
                        fontWeight="bold"
                        color="text.secondary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/organization/" + project?.organization?.id + "/projects/")}
                    >
                        {project?.organization?.name}
                    </Typography>
                }
            >
                <Box
                    display={"flex"}
                    alignItems={"center"}
                >
                    <Stack direction="row" spacing={1}>
                    {project?.project_leader ?
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
                                userInfo={project.project_leader}
                            />
                            </Box>
                            <Stack 
                                direction="column"
                                justifyContent="center"
                            >
                                <Typography fontWeight="light">
                                    Project Leader
                                </Typography>
                                <Typography variant="subtitle2">
                                    @{project.project_leader?.username}
                                </Typography>
                            </Stack>
                        </> :
                        <>
                            {
                                roles.includes("Admin") ?
                                <>
                                <Button 
                                    size="small" 
                                    variant="contained"
                                    onClick={() => setOpenAssignProjectLeaderModal(true)}
                                    startIcon={<AddRoundedIcon fontSize="small"/>}
                                >
                                    Project Leader
                                </Button> 
                                <AddMemberModal 
                                    id={id}
                                    memberType="project_leader"
                                    open={openAssignProjectLeaderModal}
                                    handleClose={handleProjectLeaderModalClose}
                                    title="Assign Project Leader"
                                />
                                </>
                                :
                                <Stack 
                                direction="column"
                                justifyContent="center"
                                >
                                    <Typography fontWeight="light">
                                        Project Leader
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        <Chip label="Not Assigned" color="error" />
                                    </Typography>
                                </Stack>
                            }
                        </>
                    }
                    </Stack> 

                </Box>
            </TitleBar>
            <Box 
                display="flex"
                flexDirection="column"
                sx={{
                    borderRadius: "0.5rem",
                    p: 2,
                    backgroundColor: "main.main",
                }}
            >
                <Box
                    display={"flex"}
                    
                >
                    <Typography
                        fontWeight={"bold"}
                        flexGrow={1}
                        mb={1}
                    >
                        Project Details
                    </Typography>
                    {roles.includes("Project Leader") && status !== "Completed" &&
                    <>
                        <Button 
                            size="small"
                            variant="outlined"
                            endIcon={<EditRoundedIcon fontSize="small"/>}
                            onClick={() => setIsEditProjectModalOpen(true)}
                        >
                            Edit
                        </Button>
                        <EditProjectModal
                            isOpen={isEditProjectModalOpen}
                            onClose={handleEditProjectModalClose}
                            project={project}
                        />
                        {canComplete &&
                            <>
                                <Button 
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    sx={{ ml: 1 }}
                                    startIcon={<CheckRoundedIcon fontSize="small"/>}
                                    onClick={() => setIsCompleteProjectModalOpen(true)}
                                >
                                    Mark As Completed
                                </Button>
                                <ConfirmProjectCompleteModal
                                    isOpen={isCompleteProjectModalOpen}
                                    onClose={handleCompleteProjectModalClose}
                                    project={project}
                                />
                            </>
                        }
                    </>
                    }
                </Box>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid item xs={12} md={6}>
                        <StackField
                            title="Project Name"
                            value={project?.name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StackField
                            title="Client Name"
                            value={project?.client?.name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StackField
                            title="Description"
                            value={project?.description}
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
                            <Box display="flex"
                                flexDirection="row"
                                justifyContent="flex-start"
                            >
                                <StatusChip status={status} />
                            </Box>
                        </Box>
                    </Grid>    
                </Grid>
            </Box>
            
            <CollapsibleTaskTable 
                title="User Tasks"
                initialTasks={userTasks}
                roles={roles}
                organization_id={project?.organization?.id}
                canAddTask={!(project?.end_time && status === "Completed") && roles?.includes("Project Leader") ? true : false}
            />
        </>
    );
}

export default ProjectDetails