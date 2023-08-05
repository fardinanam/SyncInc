import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '1rem',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const CreateOrgModal = (props) => {
    const {user, authTokens} = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted");
        console.log(localStorage.getItem('authTokens').access);

        let response = await fetch(baseUrl + 'create_organization/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorizaton': 'Bearer ' + authTokens?.access
            },
            body: JSON.stringify({
                
                'username': user.username,
                'name': e.target.name.value
            })
        });
        console.log(response);
    }
    return (
        <>
            <Modal
                open={props.open}
                onClose={props.handleClose}
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

export default CreateOrgModal;