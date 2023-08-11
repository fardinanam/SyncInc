import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Avatar, Input, TextField } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const yesterday = dayjs().subtract(10 * 365, 'day');

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
                    variant="outlined"
                    color="primary"
                    component="span"
                    fullWidth
                >
                    Choose Image
                </Button>
                </label>
                <Button 
                    type="submit" 
                    fullWidth 
                    variant="outlined" 
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

const EditPersonalInfoModal = (props) => {
    const {user, authTokens} = useContext(AuthContext);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    
    useEffect(() => {
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhone(props.phone);
        setBirthDate(props.birthDate);
    }, [user.firstName, user.lastName, props.phone, props.birthDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(birthDate, dayjs(birthDate).format('YYYY-MM-DD'));
        const body = JSON.stringify({
            'first_name': firstName,
            'last_name': lastName,
            'phone': phone,
            'birth_date': dayjs(birthDate).format('YYYY-MM-DD'),
        });

        const config = {
            headers:{
                'Authorization': 'Bearer ' + authTokens?.access,
                'content-type': 'application/json',
            }
        }

        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_personal_info/`,
                body,
                config
            )

            if (response.status === 200) {
                props.handleClose(response.data.data);
                alert("Personal information updated successfully!");
            }
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            alert(error.response.data.message);
        }


    }


    return (
        <>
            <Modal
                open={props.isOpen}
                onClose={() => props.handleClose()}
            >
                <Box sx={style}>
                    <Typography id="personal-info-modal-title" variant="h5" align="center">
                        Edit Personal Information
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            defaultValue={firstName}
                            margin="normal"
                            fullWidth
                            id="first_name"
                            label="First Name"
                            name="first_name"
                            autoFocus
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            defaultValue={lastName}
                            margin="normal"
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            value={phone}
                            margin="normal"
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer 
                                components={['DatePicker']}
                            >
                                <DatePicker label="Birth Date" 
                                    defaultValue={dayjs(birthDate)}
                                    fullWidth
                                    id="birth_date"
                                    name="birth_date"
                                    onChange={(date) => setBirthDate(date)}
                                    sx={{
                                        width: '100%',
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider> 
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            color="success"
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

const EditAddressModal = (props) => {
    const {authTokens} = useContext(AuthContext);
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState(null);
    const [street, setStreet] = useState(null);
    const [zipCode, setZipCode] = useState(null);

    useEffect(() => {
        setCountry(props.address?.country);
        setCity(props.address?.city);
        setStreet(props.address?.street);
        setZipCode(props.address?.zip_code);
    }, [props.address]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            'country': country,
            'city': city,
            'street': street,
            'zip_code': zipCode,
        });

        const config = {
            headers:{
                'Authorization': 'Bearer ' + authTokens?.access,
                'content-type': 'application/json',
            }
        }

        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_address/`,
                body,
                config
            );

            if (response.status === 200) {
                props.handleClose(response.data.data);
                alert("Address updated successfully!");
            }
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            alert(error.response.data.message);
        }
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={() => props.handleClose()}
        >
            <Box sx={style}>
                <Typography id="address-modal-title" variant="h5" align="center">
                    Edit Address
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        defaultValue={country}
                        margin="normal"
                        fullWidth
                        id="country"
                        label="Country"
                        name="country"
                        autoFocus
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    <TextField
                        defaultValue={city}
                        margin="normal"
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <TextField
                        defaultValue={street}
                        margin="normal"
                        fullWidth
                        id="street"
                        label="Street"
                        name="street"
                        onChange={(e) => setStreet(e.target.value)}
                    />
                    <TextField
                        defaultValue={zipCode}
                        margin="normal"
                        fullWidth
                        id="zip_code"
                        label="Zip Code"
                        name="zip_code"
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export {CreateOrgModal, EditProfilePicModal, EditPersonalInfoModal, EditAddressModal};