import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Avatar, Chip, Autocomplete, TextField } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import notifyWithToast from "../utils/toast";
import { useLoading } from "../context/LoadingContext";

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

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Lemon', 'Mango', 'Orange'];

const AddMemberModal = (props) => {
    const [id, setId] = useState()
    useEffect(() => {
        setId(props.id)
    }, [props.id])
    const {authTokens} = useContext(AuthContext);
    useEffect(() => {
        fetchAllAccounts();
    }, []);

    const [filteredOptions, setFilteredOptions] = useState(options);
    
  const handleSearchChange = (event, newValue) => {
    setFilteredOptions(
      options.filter(option => option.toLowerCase().includes(newValue.toLowerCase()))
    );
  };
    
    const fetchAllAccounts = async () => {
        // try {
        //     const response = await axios.get(
        //         `${baseUrl}get_all_accounts/`,  
        //         {
        //             headers: {
        //                 'Authorization': 'Bearer ' + authTokens?.access,
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json',
        //             }
        //         }  

        //     )
        //     console.log(response);
        // } catch (error) {
        //     console.log(error.response.data.message);
        //     // window.location.href = '/organizations';
        // }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        props.handleClose();
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
                        Add Member
                    </Typography>
                    <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    {/* <SearchBar /> */}
                    <Autocomplete
                        options={filteredOptions}
                        freeSolo
                        renderInput={params => <TextField {...params} label="Search" variant="outlined" />}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Invite
                    </Button>
                    </Box>
                </Box>
                </Modal>
            </>
        )
    };

const CreateOrgModal = (props) => {
    const { authTokens } = useContext(AuthContext);
    const { setLoading } = useLoading();

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
        
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}create_organization/`,
                body,
                config
            )

            props.handleClose("success", response.data.data);
        } catch (error) {
            props.handleClose("error", error.response.data);
        }
        setLoading(false);
    }
    return (
        <>
            <Modal
                open={props.open}
                onClose={() => props.handleClose("close")}
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
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { setLoading } = useLoading();

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

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_profile_pic/`,
                body,
                config
            );
            
            props.handleClose(response.data.data);
            notifyWithToast("success", "Profile picture updated successfully");
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);

        setIsSubmitDisabled(true);
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setIsSubmitDisabled(false);
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
                    disabled={isSubmitDisabled}
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
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { setLoading } = useLoading();

    useEffect(() => {
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setPhone(props.phone);
        setBirthDate(props.birthDate);
    }, [user.firstName, user.lastName, props.phone, props.birthDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_personal_info/`,
                body,
                config
            )

            if (response.status === 200) {
                props.handleClose(response.data.data);
                notifyWithToast("success", "Personal information updated successfully!");
            }
        } catch (error) {
            console.log(error.response.data.message);
            props.handleClose();
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);

    }

    const handleFirstNameChange = (e) => {
        if (e.target.value !== user.first_name) {
            setFirstName(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleLastNameChange = (e) => {
        if (e.target.value !== user.last_name) {
            setLastName(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handlePhoneChange = (e) => {
        if (e.target.value !== props.phone) {
            setPhone(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleBirthDateChange = (date) => {
        if (date !== props.birthDate) {
            setBirthDate(date);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
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
                            onChange={handleFirstNameChange}
                        />
                        <TextField
                            defaultValue={lastName}
                            margin="normal"
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            onChange={handleLastNameChange}
                        />
                        <TextField
                            value={phone}
                            margin="normal"
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            onChange={handlePhoneChange}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer 
                                components={['DatePicker']}
                            >
                                <DatePicker label="Birth Date" 
                                    defaultValue={dayjs(birthDate)}
                                    maxDate={dayjs().subtract(10, 'year')}
                                    fullWidth
                                    id="birth_date"
                                    name="birth_date"
                                    onChange={handleBirthDateChange}
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
                            disabled={isSubmitDisabled}
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
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { setLoading } = useLoading();

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

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_address/`,
                body,
                config
            );

            if (response.status === 200) {
                props.handleClose(response.data.data);
                notifyWithToast("success", "Address updated successfully!");
            }
        } catch (error) {
            props.handleClose(error.response.data.message);
        }
        setLoading(false);
    }

    const handleCountryChange = (e) => {
        if (!props.address?.country || e.target.value !== props.address?.country) {
            setCountry(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleCityChange = (e) => {
        if (!props.address?.city || e.target.value !== props.address.city) {
            setCity(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleStreetChange = (e) => {
        if (!props.address?.street || e.target.value !== props.address.street) {
            setStreet(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleZipCodeChange = (e) => {
        if (!props.address?.zip_code || e.target.value !== props.address.zip_code) {
            setZipCode(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
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
                        onChange={handleCountryChange}
                    />
                    <TextField
                        defaultValue={city}
                        margin="normal"
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        onChange={handleCityChange}
                    />
                    <TextField
                        defaultValue={street}
                        margin="normal"
                        fullWidth
                        id="street"
                        label="Street"
                        name="street"
                        onChange={handleStreetChange}
                    />
                    <TextField
                        defaultValue={zipCode}
                        margin="normal"
                        fullWidth
                        id="zip_code"
                        label="Zip Code"
                        name="zip_code"
                        onChange={handleZipCodeChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={isSubmitDisabled}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const ChangePasswordModal = (props) => {
    const {authTokens} = useContext(AuthContext);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const { setLoading } = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            'old_password': oldPassword,
            'new_password': newPassword
        });

        const config = {
            headers:{
                'Authorization': 'Bearer ' + authTokens?.access,
                'content-type': 'application/json',
            }
        };

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}accounts/profile_info/update_password/`,
                body,
                config
            );

            if (response.status === 200) {
                // props.handleClose();
                notifyWithToast("success", "Password changed successfully!");
            }
        } catch (error) {
            notifyWithToast("error", error.response.data.message);
        }
        props.handleClose();
        setLoading(false);
    }

    const handleChange = (e) => {
        if (!oldPassword || !newPassword || !confirmNewPassword 
            || newPassword !== confirmNewPassword) {
            setIsSubmitDisabled(true);
        } else {
            setIsSubmitDisabled(false);
        }
    }

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    }

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        
    }

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    }

    useEffect(() => {
        handleChange();
    }, [oldPassword, newPassword, confirmNewPassword])

    return (
        <Modal
            open={props.isOpen}
            onClose={() => props.handleClose()}
        >
            <Box sx={style}>
                <Typography id="change-password-modal-title" variant="h5" align="center">
                    Change Password
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="old_password"
                        label="Old Password"
                        name="old_password"
                        type="password"
                        onChange={handleOldPasswordChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="new_password"
                        label="New Password"
                        name="new_password"
                        type="password"
                        onChange={handleNewPasswordChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="confirm_new_password"
                        label="Confirm New Password"
                        name="confirm_new_password"
                        type="password"
                        onChange={handleConfirmNewPasswordChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={isSubmitDisabled}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const AddTagModal = ({tags, isOpen, onClose}) => {
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const {authTokens} = useContext(AuthContext);
    const { setLoading } = useLoading();

    const fetchAllTags = async () => {
        const response = await axios.get(
            `${baseUrl}all_tags/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens?.access,
                }
            }
        );

        setAllTags(response.data.data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(selectedTags);
        const body = JSON.stringify({
            'tags': selectedTags
        });

        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens?.access,
            }
        };

        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}set_user_tags/`,
                body,
                config
            );

            if (response.status === 201) {
                onClose(selectedTags);
                notifyWithToast("success", "Expertise updated successfully!");
            }
        } catch (error) {
            onClose();

            notifyWithToast("error", error.response.data.message);
        }

        setLoading(false);
    }

    const handleChange = (_, value) => {
        setSelectedTags(value);
        setIsSubmitDisabled(false);
    }

    useEffect(() => {
        if (isOpen) {
            fetchAllTags();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedTags(tags);
    }, [tags]);

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={style}>
                <Typography id="add-tag-modal-title" variant="h5" align="center">
                    Edit Tags
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Autocomplete
                        multiple
                        id="tags"
                        name="tags"
                        options={allTags.map((option) => option.name)}
                        defaultValue={tags}
                        onChange={handleChange}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                            />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Tags" placeholder="Add Tags" />
                        )}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={isSubmitDisabled}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export {CreateOrgModal, AddMemberModal, EditProfilePicModal, EditPersonalInfoModal, EditAddressModal, ChangePasswordModal, AddTagModal};