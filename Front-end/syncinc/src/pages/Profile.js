import { useState, useEffect, useContext } from "react"
import axios from "axios"

import { Box, Typography } from "@mui/material"

import { baseUrl } from "../utils/config"
import AuthContext from "../context/AuthContext"

const Profile = () => {
    const { authTokens } = useContext(AuthContext);
    let [profileInfo, setProfileInfo] = useState({});

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
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchProfileInfo();
    }, [])

    return (
        <>
            <Box 
                display={"flex"}
                alignItems={"center"}
            >
                <Typography 
                    variant="h5" 
                    fontWeight={"bold"}
                    align="center"
                    width={"100%"}
                >
                    Profile
                </Typography>
            </Box>
            <Box>

            </Box>
        </>
    )
}

export default Profile