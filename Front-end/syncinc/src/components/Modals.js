import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Avatar, Checkbox, TextField, Rating, Switch } from "@mui/material";
import { baseUrl } from '../utils/config';
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import notifyWithToast from "../utils/toast";
import { useLoading } from "../context/LoadingContext";
import SearchSuggestion from "./SearchSuggestion";
import { IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import AutocompleteTagInput from "./AutocompleteTagInput";
import AutocompleteUserInput from "./AutocompleteUserInput";
import TelegramIcon from '@mui/icons-material/Telegram';
import { modalStyle } from "../styles/styles";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddMemberModal = ( props ) => {

    const { id } = props
    const { memberType } = props

    const {authTokens} = useContext(AuthContext);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    
    const handleSearchChange = (event) => {
        const inputText = event.target.value;
        if (inputText?.trim() !== '') {
            setFilteredOptions(
                options.filter(option => {
                    return option.username.toLowerCase().includes(inputText.toLowerCase()) 
                        || option.first_name?.toLowerCase().includes(inputText.toLowerCase() 
                        || option.last_name?.toLowerCase().includes(inputText.toLowerCase()) 
                        || option.email?.toLowerCase().includes(inputText.toLowerCase())) 
                        || option.name?.toLowerCase().includes(inputText.toLowerCase())
                }) 
            );
        } else {
            setFilteredOptions([])
        }
    };
    

    const handleClose = (member) => {
        setSelectedOption(null)
        setFilteredOptions([])
        props.handleClose(member);
    }
    
    const handleSelectedOption = (event, value) => {
        setSelectedOption(value);
        setFilteredOptions([])
    }

    const fetchSuggestedMembers = async () => {
        try {
            console.log("link",`${baseUrl}get_${memberType}_suggestions/${id}`)
            const response = await axios.get(
                `${baseUrl}get_${memberType}_suggestions/${id}`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )

            setOptions(response.data.data);
        } catch (error) {
            console.log("error",error.response.data.message);
            // window.location.href = '/organizations';
        }
    }

    const handleClear = () => {
        setSelectedOption(null)
        setFilteredOptions([])
    }
    useEffect(() => {
        if (props.open)
            fetchSuggestedMembers();
    }, [props.open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(selectedOption) {
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + authTokens?.access,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            };
            const body = JSON.stringify({
                'id': selectedOption.id,
            })

            let url = ''

            if (memberType === "project_leader") {
                url = `${baseUrl}assign_project_leader/${id}/`
            } else if (memberType === "employee") {
                url = `${baseUrl}invite_${memberType}/${id}/`
            } else {
                url = `${baseUrl}add_${memberType}/${id}/`
            }

            try {
                const response = await axios.post(
                    url,
                    body ,
                    config
                )

                handleClose(response.data.data);
                if(memberType === "employee")
                    notifyWithToast("success", "Employee invited successfully");
                else
                    notifyWithToast("success",memberType+" added successfully");
            } catch (error) {
                handleClose();
                notifyWithToast("error","Something went wrong");
                
            }
        }        
    }
        return (
            <>
                <Modal
                    open={props.open}
                    onClose={() => handleClose()}
                >
                <Box 
                    sx={{ 
                        ...modalStyle,
                        width: 400 
                    }}
                    
                >
                    <Typography id="parent-modal-title" variant="h5" align="center">
                        {props.title? props.title : "Add Member"}
                    </Typography>
                    <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                    >
                    {/* <SearchBar /> */}
                        {selectedOption?
                            <Grid container>
                                <SearchSuggestion suggestion={selectedOption} />
                                <Grid item md={1}>
                                <IconButton onClick={handleClear} size="small">
                                    <ClearIcon />
                                </IconButton>
                                </Grid>
                            </Grid>
                            :
                            <AutocompleteUserInput
                                label="Search Member"
                                filteredOptions={filteredOptions}
                                onChangeAutocomplete={handleSelectedOption}
                                onChangeInput={handleSearchChange}
                            />
                        }
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            {memberType === "project_leader" ?
                                "Assign"
                            : <><TelegramIcon /> Invite</>
                            }
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
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

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
            if (error.response?.data?.data?.name)
                notifyWithToast("error", error.response.data.data.name[0]);
            else
                props.handleClose("error", error.response.data);
        }
        setLoading(false);
    }
    return (
        <>
            <Modal
                open={props.open}
                onClose={() => {
                    setIsSubmitDisabled(true);
                    props.handleClose("close")}
                }
                keepMounted={false}
            >
            <Box 
                sx={{ 
                    ...modalStyle,
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
                        onChange={(e) => {
                            if (e.target.value !== '') {
                                setIsSubmitDisabled(false);
                            } else {
                                setIsSubmitDisabled(true);
                            }
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitDisabled}
                    >
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
                sx={modalStyle}
                onSubmit={handleSubmit}
            >
                <Typography id="parent-modal-title" variant="h5" align="center">
                    Change Profile Picture
                </Typography>
                <Avatar
                    alt="Profile Picture"
                    src={selectedFile ? URL.createObjectURL(selectedFile) : props.profile_picture}
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
                <Box sx={modalStyle}>
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
            <Box sx={modalStyle}>
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
            <Box sx={modalStyle}>
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
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const {authTokens} = useContext(AuthContext);
    const { setLoading } = useLoading();

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
        setSelectedTags(tags);
    }, [tags]);

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Typography id="add-tag-modal-title" variant="h5" align="center">
                    Edit Tags
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <AutocompleteTagInput 
                        defaultTags={tags}
                        isLoaded={isOpen}
                        onChange={handleChange}
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

const EditTaskModal = ({isOpen, onClose, task, taskType}) => {
    const {authTokens} = useContext(AuthContext);
    const [deadline, setDeadline] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const {setLoading} = useLoading();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        setDeadline(task.deadline);
        setSelectedTags(task.tags.map(tag => tag.name));
        setName(task.name);
        setDescription(task.description);
    }, [task.deadline, task.tags, task.name, task.description]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = JSON.stringify({
            'name': name,
            'description': description,
            'tags': selectedTags,
            'deadline': dayjs(deadline).format('YYYY-MM-DD'),
            'project': task.project.id,
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
                `${baseUrl}update_${taskType.toLowerCase()}_task_details/${task.id}/`,
                body,
                config
            )

            if (response.status === 200) {
                onClose(response.data.data);
                notifyWithToast("success", "Task updated successfully!");
            }
        } catch (error) {
            console.log(error.response?.data?.message);
            onClose();
            notifyWithToast("error", error.response?.data?.message);
        }
        setLoading(false);

    }

    const handleNameChange = (e) => {
        if (e.target.value !== task.name) {
            setName(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleDescriptionChange = (e) => {
        if (e.target.value !== task.description) {
            setDescription(e.target.value);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleDeadlineChange = (date) => {
        if (date !== task.deadline) {
            setDeadline(date);
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }

    const handleTagsChange = (_, value) => {
        setSelectedTags(value);
        setIsSubmitDisabled(false);
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Typography id="edit-task-modal-title" variant="h5" align="center">
                    Edit {taskType} Task
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        defaultValue={name}
                        margin="normal"
                        fullWidth
                        id="task_name"
                        label="Task Name"
                        name="task_name"
                        autoFocus
                        onChange={handleNameChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Deadline"
                            defaultValue={dayjs(deadline)}
                            minDate={dayjs().add(1, 'day')}
                            fullWidth
                            id="deadline"
                            name="deadline"
                            onChange={handleDeadlineChange}
                            sx={{
                                width: '100%',
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        defaultValue={description}
                        margin="normal"
                        fullWidth
                        id="task_description"
                        label="Task Description"
                        name="task_description"
                        multiline
                        maxRows={4}
                        onChange={handleDescriptionChange}
                    />
                    <AutocompleteTagInput
                        defaultTags={task?.tags.map(tag => tag.name)}
                        isLoaded={isOpen}
                        onChange={handleTagsChange}
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

const AddTaskModal = ({isOpen, onClose, taskType}) => {
    const {id} = useParams();
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();
    const [deadline, setDeadline] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedTags);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            name: e.target.task_name.value,
            description: e.target.task_description.value,
            tags: selectedTags,
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
                onClose(response.data.data);
                notifyWithToast('success', 'Task created successfully');
            }
        } catch (error) {
            onClose();
            notifyWithToast('error', error.response.data.message);
        }
        
        
        setLoading(false);
    }

    const handleDeadlineChange = (date) => {
        setDeadline(date);

        if (date !== '') {
            setIsSubmitDisabled(false);
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Typography id="add-task-modal-title" variant="h5" align="center">
                    Add {taskType} Task
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="task_name"
                        label="Task Name"
                        name="task_name"
                        required
                        autoFocus
                    />
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

                    <TextField
                        margin="normal"
                        fullWidth
                        id="task_description"
                        label="Task Description"
                        name="task_description"
                        multiline
                        required
                    />
                    <AutocompleteTagInput
                        isLoaded={isOpen}
                        onChange={(_, value) => setSelectedTags(value)}
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

const AssignTaskModal = ({isOpen, onClose, task, organization_id}) => {
    const {authTokens} = useContext(AuthContext);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const {setLoading} = useLoading();
    const [isTagSuggestionEnabled, setIsTagSuggestionEnabled] = useState(true);
    const [matchedTagOptions, setMatchedTagOptions] = useState([]);

    const handleSearchChange = (event) => {
        const inputText = event.target.value;
        if (inputText.trim() !== '') {
            isTagSuggestionEnabled
            ? setFilteredOptions(
                matchedTagOptions?.filter(option => option.username.toLowerCase().includes(inputText.toLowerCase()))
            )
            : setFilteredOptions(
                options?.filter(option => option.name.toLowerCase().includes(inputText.toLowerCase()))
            );
        } else {
            isTagSuggestionEnabled
            ? setFilteredOptions(matchedTagOptions)
            : setFilteredOptions([]);
        }
    };

    const handleSelectedOption = (_, value) => {
        setSelectedOption(value);
        setFilteredOptions([])
    }

    const handleClear = () => {
        setSelectedOption(null)
        setFilteredOptions([])
    }

    const handleClose = (data) => {
        onClose(data);
        handleClear();
    }

    const mactchTags = () => {
        const taskTags = task?.tags?.map(tag => tag.name);
        const members = options;
        const matchedTagOptions = members.filter(member => {
            const memberExpertises = member.expertise;
            member.filtered_expertise = [];

            for (let i = 0; i < memberExpertises.length; i++) {
                if (taskTags?.includes(memberExpertises[i])) {
                    member.filtered_expertise.push(memberExpertises[i]);
                }
            }

            if (member.filtered_expertise.length > 0) {
                return true;
            }

            return false;
        });

        setMatchedTagOptions(matchedTagOptions);
    }

    const fetchMembers = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${baseUrl}organization_employees/${organization_id}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    }
                }
            );

            if (response.status === 200) {
                setOptions(response.data.data.employees);
            }
        } catch (error) {
            notifyWithToast('error', error.response.data?.message);
        }
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            'id': task.id,
            'assignee': selectedOption.id,
        });

        setLoading(true);

        try {
            const response = await axios.put(
                `${baseUrl}assign_user_task/`,
                body,
                config
            );

            if (response.status === 200) {
                handleClose(response.data.data);
                notifyWithToast('success', 'Task assigned successfully');
            }
        } catch (error) {
            handleClose();
            notifyWithToast('error', error.response.data.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen]);

    useEffect(() => {
        mactchTags();
    }, [options]);

    useEffect(() => {
        setFilteredOptions([]);
    }, [isTagSuggestionEnabled]);

    return (
        <Modal
            open={isOpen}
            onClose={() => {setIsTagSuggestionEnabled(true); handleClose()}}
        >
            <Box 
                sx={modalStyle}
            >
                <Typography id="assign-task-modal-title" variant="h5" align="center">
                    Assign Task
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >   
                    <Box 
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mb={1}
                    >
                    {!selectedOption &&
                        <>
                            <Switch 
                                color="success" 
                                size="small" 
                                checked={isTagSuggestionEnabled}
                                onChange={() => setIsTagSuggestionEnabled(!isTagSuggestionEnabled)}
                            />
                            <Typography fontSize='xs'>{isTagSuggestionEnabled ? 'Suggestion On' : 'Suggestion Off'}
                            </Typography>
                        </>
                    }
                    </Box>
                    {selectedOption?
                        <Grid container>
                            <SearchSuggestion selected={selectedOption ? true : false} suggestion={selectedOption} />
                            <Grid item md={1}>
                            <IconButton onClick={handleClear} size="small">
                                <ClearIcon />
                            </IconButton>
                            </Grid>
                        </Grid>
                        :
                        <AutocompleteUserInput
                            label="Search Member"
                            filteredOptions={filteredOptions}
                            onChangeAutocomplete={handleSelectedOption}
                            onChangeInput={handleSearchChange}
                            onFocus={handleSearchChange}
                        />
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                    >
                        Assign
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const ConfirmAcceptTaskModal = ({isOpen, onClose, task, taskType}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            status: 'Completed',
        });

        setLoading(true);
        
        try {
            const response = await axios.put(
                `${baseUrl}update_user_task_status/${task.id}/`,
                body,
                config
            );

            if (response.status === 200) {
                onClose(response.data.data);
                notifyWithToast('success', 'Task accepted successfully');
            }
        } catch (error) {
            onClose();
            notifyWithToast('error', 'Failed to mark task as completed');
        }

        setLoading(false);
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" align="center">
                        Are you sure you want to accept this {taskType} task?
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        startIcon={<CheckRoundedIcon />}
                    >
                        Accept
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const ConfirmRejectTaskModal = ({isOpen, onClose, task, taskType}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            status: 'Rejected',
        });

        setLoading(true);
        
        try {
            const response = await axios.put(
                `${baseUrl}update_user_task_status/${task.id}/`,
                body,
                config
            );

            if (response.status === 200) {
                onClose(response.data?.data);
                notifyWithToast('success', 'Task rejected successfully');
            }
        } catch (error) {
            onClose();
            notifyWithToast('error', 'Failed to reject task');
        }

        setLoading(false);
    }

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" align="center">
                        Are you sure you want to reject this {taskType} task?
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2 }}
                        startIcon={<CloseRoundedIcon />}
                    >
                        Reject
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const RateTaskModal = ({isOpen, onClose, taskId, review, taskType}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            rating: rating,
            comment: comment ? comment : "",
        });

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}update_user_task_rating/${taskId}/`,
                body,
                config
            );

            if (response.status === 200) {
                onClose(response.data?.data);
                notifyWithToast('success', 'Task rated successfully');
            }
        } catch (error) {
            onClose();
            notifyWithToast('error', 'Failed to rate task');
        }
        
        setLoading(false);
    }

    useEffect(() => {
        setRating(review?.rating);
    }, [review?.rating]);

    useEffect(() => {
        setComment(review?.comment);
    }, [review?.comment]);

    return (
        <Modal
            open={isOpen}
            onClose={() => onClose()}
        >
            <Box sx={modalStyle}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Typography variant='h5' align="center">
                        Rate This Task
                    </Typography>
                    <Rating
                        size="large"
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="comment"
                        label="Comment"
                        name="comment"
                        multiline
                        defaultValue={comment}
                        onChange={(e) => setComment(e.target.value)}
                        inputProps={{
                            maxLength: 256,
                        }}

                        helperText={`${comment?.length}/256`}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        startIcon={<CheckRoundedIcon />}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const TerminateTaskModal = ({isOpen, onClose, task, taskType}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();

    const handleSubmit = async (e) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            status: 'Terminated',
        });

        setLoading(true);

        try {
            const response = await axios.put(
                `${baseUrl}update_user_task_status/${task.id}/`,
                body,
                config
            );

            if (response.status === 200) {
                onClose(response.data?.data);
                notifyWithToast('success', 'Task terminated successfully');
            }
        } catch (error) {
            onClose();
            notifyWithToast('error', 'Failed to terminate task');
        }

        setLoading(false);
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" align="center">
                        Are you sure you want to terminate {task?.name}?
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2 }}
                        startIcon={<CloseRoundedIcon />}
                    >
                        Terminate
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const EditProjectModal = ({isOpen, onClose, project}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();
    const projectId = useParams().id;
    const [initialProject, setInitialProject] = useState(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [deadline, setDeadline] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        const body = JSON.stringify({
            name: e.target.project_name.value,
            description: e.target.project_description.value,
            deadline: dayjs(deadline).format('YYYY-MM-DD'),
        });

        console.log(body);

        setLoading(true);

        try {
            const response = await axios.put(
                `${baseUrl}update_project_details/${projectId}/`,
                body,
                config
            );

            if (response.status === 200) {
                onClose(response.data?.data);
                notifyWithToast('success', 'Project updated successfully');
            }
        } catch (error) {
            notifyWithToast('error', error.response.data.message);
        }

        setLoading(false);
    }

    useEffect(() => {
        setInitialProject(project);
        setDeadline(project.deadline);
    }, [project.name, project.description, project?.deadline]);

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
                <Box    
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h5" align="center">
                        Edit Project
                    </Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="project_name"
                        label="Project Name"
                        name="project_name"
                        defaultValue={project?.name}
                        autoFocus
                        onChange={(e) => {
                            if (e.target.value !== project?.name) {
                                setIsSubmitDisabled(false);
                            } else {
                                setIsSubmitDisabled(true);
                            }
                        }}
                    />
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                    >
                        <DatePicker
                            label="Deadline"
                            defaultValue={dayjs(project?.deadline)}
                            minDate={dayjs().add(1, 'day')}
                            id="deadline"
                            name="deadline"
                            onChange={(date) => {
                                if (date !== project?.deadline) {
                                    setIsSubmitDisabled(false);
                                } else {
                                    setIsSubmitDisabled(true);
                                }

                                setDeadline(date);
                            }}
                            sx={{
                                width: '100%',
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="project_description"
                        label="Project Description"
                        name="project_description"
                        multiline
                        defaultValue={project?.description}
                        onChange={(e) => {
                            if (e.target.value !== project?.description) {
                                setIsSubmitDisabled(false);
                            } else {
                                setIsSubmitDisabled(true);
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        startIcon={<CheckRoundedIcon />}
                        disabled={isSubmitDisabled}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

const ConfirmProjectCompleteModal = ({isOpen, onClose, project}) => {
    const {authTokens} = useContext(AuthContext);
    const {setLoading} = useLoading();
    const projectId = useParams().id;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `${baseUrl}complete_project/${projectId}/`,
                null,
                config
            );

            if (response.status === 200) {
                onClose(response.data?.data);
                notifyWithToast('success', 'Project completed successfully');
            }
        } catch (error) {
            notifyWithToast('error', error.response.data.message);
        }
        setLoading(false);
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body1" align="center">
                        Are you sure you want to complete {project?.name}?
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2 }}
                        startIcon={<CheckRoundedIcon />}
                    >
                        Complete
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}



export {
    CreateOrgModal, 
    AddMemberModal, 
    EditProfilePicModal, 
    EditPersonalInfoModal, 
    EditAddressModal, 
    ChangePasswordModal, 
    AddTagModal,
    AddTaskModal,
    AssignTaskModal,
    EditTaskModal,
    ConfirmAcceptTaskModal,
    ConfirmRejectTaskModal,
    RateTaskModal,
    TerminateTaskModal,
    EditProjectModal,
    ConfirmProjectCompleteModal,
};