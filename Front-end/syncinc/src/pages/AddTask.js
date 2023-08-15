import { useState, useContext } from "react";
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import AddItemLayout from "../components/AddItemLayout";
import { useNavigate, useParams } from "react-router-dom";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { baseUrl } from "../utils/config";
import authContext from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import axios from "axios";
import notifyWithToast from "../utils/toast";

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const AddTask = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {authTokens} = useContext(authContext);
    const {setLoading} = useLoading();
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            name: e.target.name.value,
            description: e.target.description.value,
            deadline: deadline,
        });

        setLoading(true);

        try {
            const response = await axios.post(
                `${baseUrl}create_task/${id}/`, 
                body, 
                config
            );

            if (response.status === 201) {
                notifyWithToast('success', 'Task created successfully');
                navigate(-1);
            }
        } catch (error) {
            notifyWithToast('error', error.response.data.message);
        }

        setLoading(false);
    }

    const handleDeadlineChange = (date) => {
        setDeadline(date);
    }
    return (
        <AddItemLayout
            title="Add Task"
            onClose={() => navigate(-1)}
        >
            <Box 
                component="form"
                onSubmit={handleSubmit}
                sx={{ 
                    display: "flex",
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                {/* <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper> */}
            
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <TextField
                        fullWidth
                        label="Task Name"
                        name="name"
                        required
                        variant="outlined"
                        inputProps={{ 
                            maxLength: 50,
                        }}
                    />

                </Grid>
                <Grid item xs={12} lg={6}>
                <FormControl fullWidth required name="deadline">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>    
                        <DatePicker 
                            label="Deadline" 
                            minDate={dayjs().add(1, 'day')}
                            id="deadline"
                            name="deadline"
                            onChange={handleDeadlineChange}
                            sx={{
                                width: '100%',
                            }}
                            required
                        />
                    </LocalizationProvider>
                    </FormControl> 
                </Grid>
                <Grid item xs={12}>
                
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        required
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{
                            maxLength: 150,
                        }}

                    />
                </Grid>

                <Grid item xs={12}>
                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                        }}
                    >
                        <Button variant="contained" color="success" type="submit">Save</Button>
                    </Box>
                </Grid>
            </Grid>
            </Box>
        </AddItemLayout>
    );
}

export default AddTask;