import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import { baseUrl } from "../utils/config";
import AuthContext from "../context/AuthContext";
import notifyWithToast from "../utils/toast";
import axios from "axios";
import { Box, Button, CssBaseline, Paper, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const ProjectDetails = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const [project, setProject] = useState({});

    const fetchProjectDetails = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authTokens?.access,
            },
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `${baseUrl}get_project/${id}`,
                config
            )

            setProject(response.data.data);
            console.log(project);
        } catch (error) {
            console.log(error.response.data.message);
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
                    boxShadow: 0,
                    borderRadius: "0.5rem"
                }}
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
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/project/${id}/add-task`)}
                    >
                        <AddRoundedIcon />
                        Add Task
                    </Button>
                </Box>
            </Paper>
        </>
    );
}

export default ProjectDetails