import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Avatar, Input, TextField } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import axios from "axios";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '1rem',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const CreateOrgModal = (props) => {
    const {authTokens} = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            'name': e.target.name.value 
        });

        const config = {
            headers:{
            'Authorization': 'Bearer ' + authTokens?.access,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            }
        };
        
        try {
            const response = await axios.post(
                `${baseUrl}create_organization/`,
                body,
                config
            )

            props.handleClose(response.data.data);
            alert("Organization created successfully!");
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            alert(error.response.data.message)
        }
    }
    return (
        <>
            <Modal
                open={props.open}
                onClose={() => props.handleClose()}
            >
            <Box 
                sx={{ 
                    ...style,
                    width: 400 
                }}
                
            >
                <Typography id="parent-modal-title" variant="h5" align="center">
                    Create Organization
                </Typography>
                <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="organization_name"
                    label="Organization Name"
                    name="name"
                    autoFocus
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Create
                </Button>
                </Box>
            </Box>
            </Modal>
        </>
    )
}

const  EditProfilePicModal = (props) => {
    const {user, authTokens} = useContext(AuthContext);
    const username = user?.username;
    const [selectedFile, setSelectedFile] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = new FormData()
        body.append('profile_picture', selectedFile);

        console.log(body);

        const config = {
            headers:{
            'Authorization': 'Bearer ' + authTokens?.access,
            'Content-Disposition': 'attachment',
            'filename': username.concat('.jpg'),
            }
        };

        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_profile_pic/`,
                body,
                config
            );
            
            props.handleClose(response.data.data);
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            alert(error.response.data.message);
        }
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    
    return (
        <>
            <Modal
                open={props.isOpen}
                onClose={() => props.handleClose()}
                
            >
            <Box
                component="form"
                sx={style}
                onSubmit={handleSubmit}
            >
                <Typography id="parent-modal-title" variant="h5" align="center">
                    Change Profile Picture
                </Typography>
                <Avatar
                    alt="Profile Picture"
                    src={selectedFile ? URL.createObjectURL(selectedFile) : baseUrl.concat(String(props.profile_picture))}
                    sx={{
                        width: 200,
                        height: 200,
                        mx: 'auto',
                        my: 2
                    }}
                />
                <label htmlFor="upload-button">
                <input
                    style={{ display: 'none' }}
                    type="file"
                    id="upload-button"
                    name="profile_picture"
                    onChange={handleFileChange}
                    variant="outlined"
                    color="primary"
                />
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    fullWidth
                >
                    Upload Image
                </Button>
                </label>
                <Button 
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    color="success"
                    sx={{ mt: 1 }}
                >
                    Save
                </Button>
            </Box>
            </Modal>
        </>
    );
}

export {CreateOrgModal, EditProfilePicModal};