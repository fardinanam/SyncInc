import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MainLayout from "../components/MainLayout";
const AddProject = () => {

    return(
        <MainLayout>
            <Typography variant="h4" align="center">
                    Add Project
            </Typography>
            <Box
                component="form"
                noValidate
                sx={{ 
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
                >
                <Grid container spacing={2}>
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
                </Grid>
            </Box>
        </MainLayout>
    )
}

export default AddProject;
