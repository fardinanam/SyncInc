import { useState, useEffect, useContext } from "react"
import axios from "axios"

import { Avatar, Box, Typography, Drawer, Grid, Button, Stack } from "@mui/material"
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { baseUrl } from "../utils/config"
import AuthContext from "../context/AuthContext"
import { useTheme } from "@mui/material/styles"

import EditButton from "../components/EditButton"
import { EditProfilePicModal, EditPersonalInfoModal } from "../components/Modals"

const sectionStyle = {
    borderRadius: 2,
    border: 0.5,
    borderColor: "grey.200",
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
    const mainColor = theme.palette.main[theme.palette.mode]
    let [profileInfo, setProfileInfo] = useState({});
    let [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
    let [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);

    const handleEditProfilePicModalOpen = () => {
        setIsProfilePicModalOpen(true);
    }

    const handleEditPersonalInfoModalOpen = () => {
        setIsEditPersonalInfoModalOpen(true);
    }

    const handleEditProfilePicModalClose = (data) => {
        if (data) {
            console.log("Profile pic data", data);

            setProfileInfo({
                ...profileInfo, 
                profile_picture: data.profile_picture
            });
        }
        setIsProfilePicModalOpen(false);
    }

    const handleEditPersonalInfoModalClose = (data) => {
        if (data) {
            console.log("Personal info data", data);

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

    const fetchProfileInfo = async () => {
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
            console.log(profileInfo);
        } catch (error) {
            console.log(error.response.data.message);
        }
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
                        <Avatar alt={profileInfo.first_name} src={profileInfo && baseUrl.concat(String(profileInfo.profile_picture).substring(1))} sx={{ width: 75, height: 75 }} />
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
                                profile_picture={String(profileInfo.profile_picture).substring(1)}
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
                                value={profileInfo.phone}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Birth Date"
                                value={String(new Date(profileInfo.birth_date).toLocaleDateString())}
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
                        >Edit <EditRoundedIcon fontSize="small" /> </EditButton>
                    </Box>
                    <Grid
                        container
                        rowSpacing={2}
                    >
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Country"
                                value={profileInfo.address?.country}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="City"
                                value={profileInfo.address?.city}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Street"
                                value={profileInfo.address?.address}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Zip Code"
                                value={profileInfo.address?.zip_code}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
        </>
    )
}

export default Profile