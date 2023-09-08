import { useState, useContext, useLayoutEffect } from "react"
import axios from "axios"

import { Avatar, Box, Typography, Stack, Grid } from "@mui/material"
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { baseUrl } from "../utils/config"
import AuthContext from "../context/AuthContext"
import { useTheme } from "@mui/material/styles"

import { Button } from "@mui/material"
import { EditProfilePicModal, EditPersonalInfoModal, EditAddressModal, ChangePasswordModal, AddTagModal } from "../components/Modals"
import { useLoading } from "../context/LoadingContext"
import ListChips from "../components/ListChips";
import { InfoSectionStyle } from "../styles/styles";
import StackField from "../components/StackField";
import { useMediaQuery } from "@mui/material";

const Profile = () => {
    const { user, setUser, authTokens } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const mainColor = theme.palette.main
    const [profileInfo, setProfileInfo] = useState({});
    const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
    const [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
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

    const handleAddTagModalOpen = () => {
        setIsAddTagModalOpen(true);
    }

    const handleEditProfilePicModalClose = (data) => {
        if (data) {
            setProfileInfo({
                ...profileInfo, 
                profile_picture: data.profile_picture
            });

            setUser({
                ...user,
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

            setUser({
                ...user,
                first_name: data.first_name,
                last_name: data.last_name,
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

    const handleChangePassModalClose = () => {
        setIsChangePassModalOpen(false);
    }

    const handleAddTagModalClose = (tags) => {
        setIsAddTagModalOpen(false);
        if (tags) {
            setProfileInfo({
                ...profileInfo,
                tags: tags
            });
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

    useLayoutEffect(() => {
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
                    display="flex"
                    flexDirection="column"
                    sx={InfoSectionStyle}
                >
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        rowGap={1}
                        columnGap={2}
                    >
                        <Box 
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            flexGrow={isMobile ? 1 : 0}
                        >
                            <Avatar alt={profileInfo.first_name} src={profileInfo.profile_picture && profileInfo.profile_picture} sx={{ width: 75, height: 75 }} />
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="start"
                            flexGrow={1}
                        >
                            <Typography 
                                fontWeight="bold"
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
                            display="flex"
                            alignItems="center"
                        >
                            <Button 
                                variant="outlined"
                                size="small"
                                onClick={handleEditProfilePicModalOpen}
                                endIcon={<EditRoundedIcon fontSize="small" />}
                            >
                                Edit 
                            </Button>
                            <EditProfilePicModal 
                                isOpen={isProfilePicModalOpen}
                                handleClose={handleEditProfilePicModalClose}
                                profile_picture={profileInfo.profile_picture && profileInfo.profile_picture}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={InfoSectionStyle}
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
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={handleEditPersonalInfoModalOpen}
                            endIcon={<EditRoundedIcon fontSize="small" />}
                        >Edit </Button>
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
                    sx={InfoSectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Expertise
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAddTagModalOpen}
                            endIcon={<EditRoundedIcon fontSize="small" />}
                        >
                            Edit
                        </Button>
                        <AddTagModal 
                            tags={profileInfo.tags}
                            isOpen={isAddTagModalOpen}
                            onClose={handleAddTagModalClose}
                        />
                    </Box>
                    <Stack spacing={{ xs: 1, sm: 1 }} direction="row" useFlexGap flexWrap="wrap"
                    >
                        {profileInfo.tags?.length === 0 
                            ? <Typography>No tag</Typography>
                            : <ListChips chipData={profileInfo.tags} />
                            
                        }
                    </Stack>
                </Box>
                <Box 
                    display={"flex"}
                    flexDirection={"column"}
                    sx={InfoSectionStyle}
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
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleEditAddressModalOpen}
                            endIcon={<EditRoundedIcon fontSize="small" />}
                        >
                            Edit 
                        </Button>
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
                    My Account
                </Typography>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={InfoSectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Account Information
                        </Typography>
                    </Box>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Email"
                                value={profileInfo.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Username"
                                value={profileInfo.username}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box 
                    display={"flex"}
                    flexDirection={"column"}
                    sx={InfoSectionStyle}
                >
                    <Box
                        display={"flex"}
                    >
                        <Typography
                            fontWeight={"bold"}
                            flexGrow={1}
                        >
                            Account Security
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleChangePassModalOpen}
                            endIcon={<EditRoundedIcon fontSize="small" />}
                        >
                            Edit
                        </Button>
                        <ChangePasswordModal
                            isOpen={isChangePassModalOpen}
                            handleClose={handleChangePassModalClose}
                        />
                    </Box>
                    <Grid
                        container
                        rowSpacing={2}
                    >
                        <Grid item xs={12} md={6}>
                            <StackField
                                title="Password"
                                value={"********"}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Stack>
            {/* </Paper> */}
        </>
    )
}

export default Profile