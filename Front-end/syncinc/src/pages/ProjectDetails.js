import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, Button, Chip, CssBaseline, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CollapsibleTaskTable from "../components/CollapsibleTaskTable";
import { AddMemberModal, AddTaskModal } from "../components/Modals";
import TitleBar from "../components/TitleBar";
import UserInfo from "../components/UserInfo";

const ProjectDetails = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [vendorTasks, setVendorTasks] = useState([]);
    const [roles, setRoles] = useState([]);
    const [openAssignProjectLeaderModal, setOpenAssignProjectLeaderModal] = useState(false);

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

            setVendorTasks(response.data.data);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }

        setLoading(false);
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

    useEffect(() => {
        fetchProjectDetails();
    }, []);

    return (
        <>
            <CssBaseline />
            <TitleBar 
                title={project?.name}
                subtitle={project?.organization?.name}
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
                                >
                                    <AddRoundedIcon />
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
            <CollapsibleTaskTable 
                title="User Tasks"
                initialTasks={userTasks}
                roles={roles}
                organization_id={project?.organization?.id}
                canAddTask={!project?.has_ended && roles?.includes("Project Leader") ? true : false}
            />
        </>
    );
}

export default ProjectDetails