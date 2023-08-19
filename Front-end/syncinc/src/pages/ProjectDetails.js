import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, CssBaseline, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CollapsibleTaskTable from "../components/CollapsibleTaskTable";
import { AddTaskModal } from "../components/Modals";
import TitleBar from "../components/TitleBar";
import UserInfo from "../components/UserInfo";

const ProjectDetails = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [vendorTasks, setVendorTasks] = useState([]);
    const [role, setRole] = useState("");

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
            <TitleBar 
                title={project?.name}
                subtitle={project?.organization?.name}
            >
                <Box
                    display={"flex"}
                    alignItems={"center"}
                >
                    
                    <Stack direction="row" spacing={1}>
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
                                {project.project_leader? '@'+project.project_leader.name : "N/A"}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </TitleBar>
            <CollapsibleTaskTable 
                title="User Tasks"
                initialTasks={userTasks}
                role={role}
                organization_id={project?.organization?.id}
                canAddTask={!project.has_ended && role === "Project Leader" ? true : false}
            />
        </>
    );
}

export default ProjectDetails