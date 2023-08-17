import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isValidEmail, isValidNumber } from "../utils/validators";
import { baseUrl } from "../utils/config";
import AuthContext from '../context/AuthContext';
import axios from "axios";
import AddItemLayout from "../components/AddItemLayout";

const AddProject = () => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); 
    console.log(id);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Authorization': 'Bearer ' + authTokens?.access,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };

        const body = JSON.stringify({
            'name': e.target.project_name.value,
            'organization': id,
            'client': e.target.client_name.value,
            'description': e.target.description.value,
        })
        try {
            console.log(e.target.project_name.value);
            const response = await axios.post(
                `${baseUrl}create_project/${id}/`,
                body ,
                config
            )
            alert("Project created successfully");
            
        } catch (error) {
            alert(error.response.data.message);
        }

    };
    return(
        <AddItemLayout
            title="Add Project"
            onClose={() => navigate(`/organization/${id}`)}
        >
            <Grid container
                    spacing={2}
                    component="form"
                    onSubmit={handleSubmit}
            >
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="project_name"
                        label="Project Name"
                        required
                        fullWidth
                        id="project_name"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="client_name"
                        label="Client Name"
                        required
                        fullWidth
                        id="client_name"
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField
                        name="description"
                        label="Description"
                        required
                        fullWidth
                        multiline
                        rows={10}
                        id="description"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button variant="contained" color="success" type="submit">Save</Button>
                        {/* <Button variant="contained" color="secondary">Cancel</Button> */}
                    </Box>
                </Grid>
            </Grid>
        </AddItemLayout>
    )
}

export default AddProject;
