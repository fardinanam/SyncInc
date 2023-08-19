import * as React from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import AuthContext from '../context/AuthContext';
import notifyWithToast from "../utils/toast";
import AddItemLayout from "../components/AddItemLayout";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Task } from "@mui/icons-material";

const SubmitTask = () => {
    const { authTokens } = useContext(AuthContext);
    const { id } = useParams();
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Authorization': 'Bearer ' + authTokens?.access,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        // const body =
        setLoading(true);
        // try {
        // } catch (error) {
            // notifyWithToast("error", error.response.data.message)
        // }
        setLoading(false);
    };

    return(
        <AddItemLayout
            title="Submit Task"
            onClose={() => navigate(`/organization/${id}/projects/${id}/tasks`)} //!
        >
            <Grid container
                    spacing={2}
                    component="form"
                    onSubmit={handleSubmit}
            >
                <Grid item xs={6} sm={3}>
                    <TextField
                        name="task_title"
                        label="Title"
                        required
                        fullWidth
                        multiline
                        rows={2}
                        id="task_title"
                    />
                </Grid>
                <Grid item xs={18} sm={9}>
                    <TextField
                        name="description"
                        label="Description"
                        required
                        fullWidth
                        multiline
                        rows={2}
                        id="description"
                    />
                </Grid>
                <Grid item sm={12}>
                    Upload File
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        {/* <Button variant="contained" color="success" type="submit">Save</Button> */}
                        {/* <Button variant="contained" color="secondary">Cancel</Button> */}
                    </Box>
                </Grid>
            </Grid>
        </AddItemLayout>
    )
}

export default SubmitTask;