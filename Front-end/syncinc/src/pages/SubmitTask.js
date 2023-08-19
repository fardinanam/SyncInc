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
        'image/png': []
        }
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
            {errors.map(e => (
            <li key={e.code}>{e.message}</li>
            ))}
        </ul>
        </li>
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
            onClose={() => navigate(`/organization/${id}/projects/${id}/tasks`)}
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
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    <aside>
                        <h4>Accepted files</h4>
                        <ul>{acceptedFileItems}</ul>
                        <h4>Rejected files</h4>
                        <ul>{fileRejectionItems}</ul>
                    </aside>
                    </section>
                </Grid>
            </Grid>
        </AddItemLayout>
    )
}

export default SubmitTask;