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
import Chip from "@mui/material/Chip";
import { Task } from "@mui/icons-material";
import {useDropzone} from 'react-dropzone';

const SubmitTask = () => {
    const { authTokens } = useContext(AuthContext);
    const { id } = useParams();
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: {
        'image/jpeg': [],
        'image/png': [],
        'application/pdf': [],
        'video/mp4': [],
        'audio/mpeg': [],
        }
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <Chip
            label={file.name + " - " + file.size + " bytes"}
            key={file.path}
        >
        </Chip>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        notifyWithToast("error", file.name + " could not be uploaded, file type error, try again")
    ));
    
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
            onClose={() => navigate(`/task/${id}/`)}
        >
            <Grid container
                    spacing={2}
                    component="form"
                    onSubmit={handleSubmit}
            >
                <Grid item xs={12}>
                    <TextField
                        name="task_title"
                        label="Title"
                        required
                        fullWidth
                        rows={2}
                        id="task_title"
                        disabled
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="description"
                        label="Description"
                        required
                        fullWidth
                        multiline
                        rows={2}
                        id="description"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <section className="container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        {/* make a box for the drag and drop */}
                        <Box
                            sx={{
                                border: '1px dashed grey',
                                borderRadius: '0.5rem',
                                p: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography
                                variant='body1'
                            >
                                Drag and drop your files here
                            </Typography>
                        </Box>
                    </div>
                    {/* if the files are accepted, show them as small chips, if rejected, show as toast */}
                    <aside>
                        {/* <h4>Uploaded files:</h4> */}
                        <ul>{acceptedFileItems}</ul> 
                        {/* <h4>Unsupported files:</h4> */}
                        <ul>{fileRejectionItems}</ul>
                    </aside>
                    </section>
                </Grid>
            </Grid>
        </AddItemLayout>
    )
}

export default SubmitTask;