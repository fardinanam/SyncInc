import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, Button, Chip, CssBaseline, Grid, SpeedDial, SpeedDialAction, Stack, Typography } from "@mui/material";
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
import { useTheme } from "@mui/material/styles";
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import { fabStyle } from "../styles/styles";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ConfirmDialog from "../components/Dialogs";

const ProjectDetails = () => {
    const theme = useTheme();
    const mainColor = theme.palette.main[theme.palette.mode];
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [status, setStatus] = useState();
    const [roles, setRoles] = useState([]);
    const [openAssignProjectLeaderModal, setOpenAssignProjectLeaderModal] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [canComplete, setCanComplete] = useState(false);
    const [canChangeProjectLeader, setCanChangeProjectLeader] = useState(false);
    const [isCompleteProjectModalOpen, setIsCompleteProjectModalOpen] = useState(false);
    const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);


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
            
            // console.log(response.data.data);
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
        // console.log(project_leader);
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
            } else {
                setRoles(prevState => (
                    prevState.filter(role => role !== "Project Leader")
                ));
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

    const handleAddTaskModalClose = (newTask) => {
        setIsAddTaskModalOpen(false);
        if (newTask) {
            newTask["tags"] = newTask.tags_details;

            setUserTasks(prevState => ([
                ...prevState,
                newTask
            ]));
        }
    }

    const handleDeleteProject = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authTokens?.access,
            },
        }

        try {
            let response = await axios.delete(
                `${baseUrl}delete_project/${id}`,
                config
            )

            if (response.status === 200) {
                notifyWithToast("success", "Project deleted successfully");
                navigate("/organization/" + project?.organization?.id + "/projects/");
            }
        } catch (error) {
            notifyWithToast("error", error.response.data.message);
        }
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
        if (roles.includes("Project Leader") && !project?.end_time) {
            if (userTasks.every(task => task.status === "Completed"
                || task.status === "Rejected" || task.status === "Terminated")) {
                setCanComplete(true);
            } else {
                setCanComplete(false);
            }
        }

        if (roles.includes("Admin")  && project?.project_leader && !project?.end_time) {
            setCanChangeProjectLeader(true);
        } else {
            setCanChangeProjectLeader(false);
        }
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
                    <Stack direction="row"
                        flexWrap="wrap"
                        rowGap={1}
                        columnGap={1}
                        justifyContent="flex-end"
                    >
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
            <Stack
                direction="column"
                justifyContent="flex-start"
                rowGap={1}
                columnGap={1}
            >
                <Box 
                    display="flex"
                    flexDirection="column"
                    rowGap={1}
                    columnGap={1}
                    sx={{
                        borderRadius: "0.5rem",
                        p: 2,
                        backgroundColor: mainColor,
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
                        {
                            status === "Completed" ?
                            <Grid item xs={12} md={6}>
                                <StackField
                                    title="Completed On"
                                    value={dayjs(project?.end_time).format("DD MMM, YYYY")}
                                />
                            </Grid>
                            :
                            <Grid item xs={12} md={6}>
                                <StackField
                                    title="Deadline"
                                    value={project?.deadline ? dayjs(project?.deadline).format("DD MMM, YYYY") : "Not Set"}
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
                                <Box display="flex"
                                    flexDirection="row"
                                    justifyContent="flex-start"
                                >
                                    <StatusChip status={status} />
                                </Box>
                            </Box>
                        </Grid>   
                        <Grid item xs={12}>
                            <StackField
                                title="Description"
                                value={project?.description}
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                <CollapsibleTaskTable 
                    title="User Tasks"
                    initialTasks={userTasks}
                    roles={roles}
                    organization_id={project?.organization?.id}
                />
            </Stack>
            { !(roles?.includes("Employee") && roles?.length === 1) &&
            <Box>
                <SpeedDial
                    ariaLabel="edit project"
                    sx={fabStyle}
                    icon={<EditRoundedIcon />}
                    onClose={() => setSpeedDialOpen(false)}
                    onOpen={() => setSpeedDialOpen(true)}
                    open={speedDialOpen}
                >
                    {
                        canChangeProjectLeader &&
                        <SpeedDialAction
                            key="Change Project Leader"
                            icon={<ManageAccountsRoundedIcon />}
                            tooltipTitle="Leader"
                            tooltipOpen
                            onClick={() => setOpenAssignProjectLeaderModal(true)}
                        />
                    }
                    {
                        canComplete &&
                        <SpeedDialAction
                            key="Mark As Completed"
                            icon={<CheckRoundedIcon />}
                            tooltipTitle="Mark"
                            tooltipOpen
                            onClick={() => setIsCompleteProjectModalOpen(true)}
                        />
                    }
                    {
                        roles.includes("Project Leader") && status !== "Completed" &&
                        <SpeedDialAction
                            key="Edit Project"
                            icon={<EditRoundedIcon />}
                            tooltipTitle="Edit"
                            tooltipOpen
                            onClick={() => setIsEditProjectModalOpen(true)}
                        />
                    }
                    {
                        !(project?.end_time && status === "Completed") && 
                        roles.includes("Project Leader") &&
                        <SpeedDialAction
                            key="Add Task"
                            icon={<AddRoundedIcon />}
                            tooltipTitle="Task"
                            tooltipOpen
                            onClick={() => setIsAddTaskModalOpen(true)}
                        />
                    }
                    {
                        roles.includes("Admin") &&
                        <SpeedDialAction
                            key="Delete Project"
                            icon={<DeleteRoundedIcon />}
                            tooltipTitle="Project"
                            tooltipOpen
                            onClick={() => setIsDeleteProjectDialogOpen(true)}
                        />

                    }
                </SpeedDial>
            </Box>
            }
            <EditProjectModal
                isOpen={isEditProjectModalOpen}
                onClose={handleEditProjectModalClose}
                project={project}
            />
            <ConfirmProjectCompleteModal
                isOpen={isCompleteProjectModalOpen}
                onClose={handleCompleteProjectModalClose}
                project={project}
            />
            <AddTaskModal 
                isOpen={isAddTaskModalOpen}
                onClose={handleAddTaskModalClose}
                taskType={"User"}
                projectId={id}
                projectDeadline={project?.deadline}
            />
            <AddMemberModal 
                id={id}
                memberType="project_leader"
                open={openAssignProjectLeaderModal}
                handleClose={handleProjectLeaderModalClose}
                title="Assign Project Leader"
            />
            <ConfirmDialog
                title="Delete Project"
                helpText="Are you sure you want to delete this project? This will delete all the tasks associated with this project and the action can't be undone."
                actionType="Delete"
                open={isDeleteProjectDialogOpen}
                handleClose={() => setIsDeleteProjectDialogOpen(false)}
                handleConfirm={handleDeleteProject}
                confirmIcon={<DeleteRoundedIcon />}
                confirmColor="error"
            />
        </>
    );
}

export default ProjectDetails