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

const AddProject = () => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); 
    console.log(id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.contact_email.value);
        if(isValidEmail(e.target.contact_email.value) === false) {
            alert("Please enter a valid email address.");
            return;
        }

        if(isValidNumber(e.target.contact_number.value) === false) {
            alert("Please enter a valid contact no.");
            return;
        }

        try {
            console.log(e.target.project_name.value);
            const response = await axios.post(
                `${baseUrl}create_project/${id}/`,
                {
                    body: {
                        'project_name': e.target.project_name.value,
                        'client_name': e.target.client_name.value,
                        'client_email': e.target.contact_email.value,
                        'client_contact_number': e.target.contact_number.value,
                        'project_description': e.target.description.value,

                    }
                } ,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }

            )
            alert("Project created successfully");
            
        } catch (error) {
            alert(error.response.data.message);
        }

    };
    return(
        <>
            <Box
                component="form"
                noValidate
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                onSubmit={handleSubmit}
                >
                <Grid container mt={10}>
                    <Grid item xs={0} sm={3} />
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                            <Grid container>
                                <Grid item xs={1} sm={2} />
                                <Grid item xs={10} sm={8} >
                                    <Typography 
                                        sx = {{
                                            fontWeight: 'bold'
                                        }} 
                                        align="center"
                                        variant="h5" 
                                    >
                                    Add a New Project
                                    </Typography>
                                </Grid>
                                <Grid item xs={1} sm={2}>
                                    <Box 
                                        sx={{
                                            textAlign: 'right',
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        <Button color="error" onClick={() => navigate('/projects')}>
                                            <CloseRoundedIcon />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            </Grid>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="contact_number"
                                    label="Contact Number"
                                    required
                                    fullWidth
                                    id="contact_number"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="contact_email"
                                    label="Contact Email"
                                    required
                                    fullWidth
                                    id="contact_email"
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
                    </Grid>
                    <Grid item xs={0} sm={3} />
                </Grid>
            </Box>
        </>
    )
}

export default AddProject;
