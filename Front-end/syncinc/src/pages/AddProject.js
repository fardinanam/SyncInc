import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MainLayout from "../components/MainLayout";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from "react-router-dom";

const AddProject = () => {
    const navigate = useNavigate();

    return(
        <MainLayout>
            <Box
                component="form"
                noValidate
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
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
                                    <Button variant="contained" color="success">Save</Button>
                                    {/* <Button variant="contained" color="secondary">Cancel</Button> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={0} sm={3} />
                </Grid>
            </Box>
        </MainLayout>
    )
}

export default AddProject;
