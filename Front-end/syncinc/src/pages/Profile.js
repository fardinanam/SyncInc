import { useState, useEffect, useContext } from "react"
import axios from "axios"

import { Avatar, Box, Typography, Drawer, Grid, Button, Stack } from "@mui/material"
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { baseUrl } from "../utils/config"
import AuthContext from "../context/AuthContext"
import { useTheme } from "@mui/material/styles"

import EditButton from "../components/EditButton"
import { EditProfilePicModal, EditPersonalInfoModal, EditAddressModal, ChangePasswordModal } from "../components/Modals"
import notifyWithToast from "../utils/toast"
import { useLoading } from "../context/LoadingContext"

const sectionStyle = {
    borderRadius: 2,
    border: 0.5,
    borderColor: "grey.300",
    p: 2
}

const StackField = (props) => {
    return (
        <Stack>
            <Typography
                fontWeight={"light"}
                fontSize={"small"}
            >
                {props.title}
            </Typography>
            <Typography>
                {props.value}
            </Typography>
        </Stack>

    )
}

const Profile = () => {
    const { authTokens } = useContext(AuthContext);
    const theme = useTheme();
    const mainColor = theme.palette.main
    const [profileInfo, setProfileInfo] = useState({});
    const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
    const [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
    const { setLoading } = useLoading();

    const handleEditProfilePicModalOpen = () => {
        setIsProfilePicModalOpen(true);
    }

    const handleEditPersonalInfoModalOpen = () => {
        setIsEditPersonalInfoModalOpen(true);
    }

    const handleEditAddressModalOpen = () => {
        setIsEditAddressModalOpen(true);
    }

    const handleChangePassModalOpen = () => {
        setIsChangePassModalOpen(true);
    }

    const handleEditProfilePicModalClose = (data) => {
        if (data) {
            setProfileInfo({
                ...profileInfo, 
                profile_picture: data.profile_picture
            });
        }
        setIsProfilePicModalOpen(false);
    }

    const handleEditPersonalInfoModalClose = (data) => {
        if (data) {
            setProfileInfo({
                ...profileInfo, 
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number,
                birth_date: data.birth_date,
            });
        }

        setIsEditPersonalInfoModalOpen(false);
    }

    const handleEditAddressModalClose = (data) => {
        if (data) {
            setProfileInfo({
                ...profileInfo, 
                address: {
                    street: data.street,
                    city: data.city,
                    country: data.country,
                    zip_code: data.zip_code,
                }
            });
        }

        setIsEditAddressModalOpen(false);
    }

    const handleChangePassModalClose = (type, data) => {
        setIsChangePassModalOpen(false);

        if (type === "error") {
            notifyWithToast(type, data.message);
        } else {
            notifyWithToast(type, data);
        }
    }

    const fetchProfileInfo = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}accounts/profile_info/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            
            setProfileInfo(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);

            if (error.response.status === 401) {
                localStorage.removeItem("tokens");
                window.location.reload();
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchProfileInfo();
    }, [])

    return (
        <>
            <Box>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Account Settings
                </Typography>
            </Box>
            <Stack spacing={2}
                bgcolor={mainColor}
                sx={{
                    borderRadius: 2,
                    mt: 2,
                    ml: "auto",
                    mr: "auto",
                    pl: 2,
                    pb: 2,
                    pr: 2,
                    pt: 1
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold"
                >
                    My Profile
                </Typography>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={sectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Avatar alt={profileInfo.first_name} src={profileInfo.profile_picture && baseUrl.concat(String(profileInfo.profile_picture).substring(1))} sx={{ width: 75, height: 75 }} />
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"start"}
                            flexGrow={1}
                            ml={2}
                        >
                            <Typography 
                                fontWeight={"bold"}
                            >
                                {profileInfo.first_name} {profileInfo.last_name}
                            </Typography>
                            <Typography>
                                {profileInfo.email}
                            </Typography>
                            <Typography>
                                @{profileInfo.username}
                            </Typography>
                        </Box>
                        <Box 
                            display={"flex"}
                            alignItems={"center"}
                        >
                            <EditButton 
                                variant="outlined"
                                size="small"
                                onClick={handleEditProfilePicModalOpen}
                            >
                                Edit <EditRoundedIcon fontSize="small"/>
                            </EditButton>
                            <EditProfilePicModal 
                                isOpen={isProfilePicModalOpen}
                                handleClose={handleEditProfilePicModalClose}
                                profile_picture={profileInfo.profile_picture && String(profileInfo.profile_picture).substring(1)}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={sectionStyle}
                >
                    <Box
                        display={"flex"}
                        
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Personal Information
                        </Typography>
                        <EditButton 
                            variant="outlined" 
                            size="small"
                            onClick={handleEditPersonalInfoModalOpen}
                        >Edit <EditRoundedIcon fontSize="small" /> </EditButton>
                        <EditPersonalInfoModal
                            isOpen={isEditPersonalInfoModalOpen}
                            handleClose={handleEditPersonalInfoModalClose}
                            phone={profileInfo.phone}
                            birthDate={profileInfo.birth_date}
                        />
                    </Box>
                    <Grid 
                        container
                        rowSpacing={2}
                    >
                        <Grid item xs={12} md={6}>
                            <StackField 
                                title="First Name"
                                value={profileInfo.first_name} 
                            />   
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Last Name"
                                value={profileInfo.last_name}
                            />
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                            <StackField
                                title="Email"
                                value={profileInfo.email}
                            />
                        </Grid> */}
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Phone Number"
                                value={profileInfo.phone ? profileInfo.phone : "-"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Birth Date"
                                value={profileInfo.birth_date 
                                    ? String(new Date(profileInfo.birth_date).toLocaleDateString()) 
                                    : "-"}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box 
                    display={"flex"}
                    flexDirection={"column"}
                    sx={sectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Address
                        </Typography>
                        <EditButton
                            variant="outlined"
                            size="small"
                            onClick={handleEditAddressModalOpen}
                        >
                            Edit 
                            <EditRoundedIcon fontSize="small" /> 
                        </EditButton>
                        <EditAddressModal 
                            isOpen={isEditAddressModalOpen}
                            handleClose={handleEditAddressModalClose}
                            address={profileInfo.address}
                        />
                    </Box>
                    <Grid
                        container
                        rowSpacing={2}
                    >
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Country"
                                value={profileInfo.address?.country 
                                    ? profileInfo.address.country
                                    : "-"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="City"
                                value={profileInfo.address?.city
                                    ? profileInfo.address.city
                                    : "-"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Street"
                                value={profileInfo.address?.street 
                                    ? profileInfo.address.street
                                    : "-"}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Zip Code"
                                value={profileInfo.address?.zip_code
                                    ? profileInfo.address.zip_code
                                    : "-"}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Security
                </Typography>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={sectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Change Password
                        </Typography>
                        <EditButton
                            variant="outlined"
                            size="small"
                            onClick={handleChangePassModalOpen}
                        >
                            Edit
                            <EditRoundedIcon fontSize="small" />
                        </EditButton>
                        <ChangePasswordModal
                            isOpen={isChangePassModalOpen}
                            handleClose={handleChangePassModalClose}
                        />
                    </Box>
                </Box>
            </Stack>
        </>
    )
}

export default Profile