import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, Button, CssBaseline, Paper, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CollapsibleTaskTable from "../components/CollapsibleTaskTable";
import { AddTaskModal } from "../components/Modals";

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
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: "0.5rem"
                }}
                elevation={0}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'left',
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        {project?.name}
                    </Typography>
                    <Typography 
                        variant="h6"
                        color="primary"
                    >
                        {project?.organization?.name}
                    </Typography>
                </Box>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                >
                    { !project.has_ended && role === "Project Leader" && 
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsAddTaskModalOpen(true)}
                        >
                            <AddRoundedIcon />
                            Add Task
                        </Button>
                    }
                    <AddTaskModal 
                        isOpen={isAddTaskModalOpen}
                        onClose={handleAddTaskModalClose}
                        taskType={"User"}
                    />
                </Box>
            </Paper>
            <CollapsibleTaskTable 
                title="User Tasks"
                tasks={userTasks}
            />
        </>
    );
}

export default ProjectDetails