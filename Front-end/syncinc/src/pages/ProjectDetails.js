import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Avatar, Box, Button, CssBaseline, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CollapsibleTaskTable from "../components/CollapsibleTaskTable";
import { AddTaskModal } from "../components/Modals";
import TitleBar from "../components/TitleBar";

const ProjectDetails = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [project, setProject] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [vendorTasks, setVendorTasks] = useState([]);
    const [role, setRole] = useState("");

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
            
            console.log(response.data.data.project);
            setProject(response.data.data.project);
            setRole(response.data.data.role);

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
                    { !project.has_ended && role === "Project Leader" ? 
                        <Tooltip title="Add Task">
                        <IconButton
                            color="success"
                            onClick={() => setIsAddTaskModalOpen(true)}
                        >
                            <AddRoundedIcon />
                        </IconButton>
                        </Tooltip>
                        :
                        project.project_leader &&
                        <Stack direction="row" spacing={1}>
                            <Box 
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                            <Avatar 
                                alt={project.project_leader.first_name + ' ' + project.project_leader.last_name} 
                                src={project.project_leader.profile_pic && baseUrl.concat(String(project.project_leader.profile_pic).substring(1))}     
                            />
                            </Box>
                            <Stack direction="column" spacing={0}>
                                <Typography fontWeight="light">
                                    Project Leader
                                </Typography>
                                <Typography variant="subtitle2">
                                    @{project.project_leader.username}
                                </Typography>
                            </Stack>
                        </Stack>
                    }
                    <AddTaskModal 
                        isOpen={isAddTaskModalOpen}
                        onClose={handleAddTaskModalClose}
                        taskType={"User"}
                    />
                </Box>
            </TitleBar>
            <CollapsibleTaskTable 
                title="User Tasks"
                tasks={userTasks}
                role={role}
                organization_id={project?.organization?.id}
            />
        </>
    );
}

export default ProjectDetails