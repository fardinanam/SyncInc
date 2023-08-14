import { Box, Button, Grid } from "@mui/material";
import AddItemLayout from "../components/AddItemLayout";
import { useNavigate } from "react-router-dom";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const AddTask = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
    }

    return (
        <AddItemLayout
            title="Add Task"
            onSubmit={handleSubmit}
            onClose={() => navigate(-1)}
        >
            <Box 
                sx={{ 
                    display: "flex",
                    width: '100%',
                    justifyContent: 'center',
                }}>
                <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>
        </AddItemLayout>
    );
}

export default AddTask;