import { useState } from "react";
import { useContext } from "react";
import { useLoading } from "../context/LoadingContext";
import AuthContext from '../context/AuthContext';
import notifyWithToast from "../utils/toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import {useDropzone} from 'react-dropzone';
import DragAndDropIcon from "../assets/drag-and-drop-icon-17.jpg";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import axios from "axios";
import { baseUrl } from "../utils/config";

const SubmitTask = ({task, onSubmitSuccess}) => {
    const { authTokens } = useContext(AuthContext);
    const { setLoading } = useLoading();

    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [fileRejections, setFileRejections] = useState([]);

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        accept: {
        'image/jpeg': [],
        'image/png': [],
        'application/pdf': [],
        'video/mp4': [],
        'audio/mpeg': [],
        'application/zip': [],
        },
        onDrop: (acceptedFiles, fileRejections) => {
            // Update the state with the accepted and rejected files
            setAcceptedFiles(acceptedFiles.slice(0, 1));
            setFileRejections(fileRejections);
        },
        maxFiles: 1,
    });

    fileRejections.map(({ file, errors }) => {
        if(errors[0].code === "file-invalid-type") {
            notifyWithToast("error", "Invalid file type");
        } else if(errors[0].code === "too-many-files") {
            notifyWithToast("error", "Too many files");
        }
        setFileRejections([]);
    });

    const handleCancel = () => {
        // Clear the selected and rejected files when cancel is clicked
        setAcceptedFiles([]);
        setFileRejections([]);
    };

    const acceptedFileItems = acceptedFiles.map(file => {
        let fileSize = file.size.toFixed(2);
        let sizeUnit = "Bytes";

        if (fileSize > 1024) {
            fileSize = (fileSize / 1024).toFixed(2);
            sizeUnit = "KB";
        }

        if (fileSize > 1024) {
            fileSize = (fileSize / 1024).toFixed(2);
            sizeUnit = "MB";
        }
        return (
        <Chip
            label={file.name + " - " + fileSize + ' ' +  sizeUnit}
            key={file.path}
        >
        </Chip>
    )});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = new FormData();
        body.append('file', acceptedFiles[0]);

        const config = {
            headers: {
                'Authorization': 'Bearer ' + authTokens?.access,
                'Content-Disposition': 'attachment; filename=' + acceptedFiles[0].name,
            }
        };

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}submit_user_task/${task?.id}/`, 
                body, 
                config
            );

            onSubmitSuccess(response.data?.data);
            notifyWithToast('success', 'Task submitted successfully');
        } catch (error) {
            notifyWithToast('error', error.response?.data?.message);
        }
        setLoading(false);
    };

    return(
        <Box 
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-center"
            rowGap={1}
            component="form"
            onSubmit={handleSubmit}
        >
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <Box
                    sx={{
                        border: '1px dashed grey',
                        borderRadius: '0.5rem',
                        p: '1rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        rowGap: 1,
                        columnGap: 1,
                        height: '10rem',
                        // hover pointer
                        '&:hover': {
                            cursor: 'pointer',
                            backgroundColor: 'grey.100',
                        }
                    }}
                >
                    {acceptedFileItems?.length > 0 ?
                        <ul>{acceptedFileItems}</ul> 
                    :
                    <>
                    <Box 
                            component="img"
                            src={DragAndDropIcon}
                            sx={{
                                height: '3rem',
                                width: '3rem',
                            }}
                        />
                    <Typography>
                        Drag and drop a file here, or click to select a file
                    </Typography>
                    </>
                    }
                </Box>
            </div>
            <Box 
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                alignItems="center"
                columnGap={1}
            >
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                    startIcon={<PublishRoundedIcon />}
                    disabled={acceptedFileItems?.length > 0 ? false : true}
                >
                    Submit
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={acceptedFileItems?.length > 0 ? false : true}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}

export default SubmitTask;