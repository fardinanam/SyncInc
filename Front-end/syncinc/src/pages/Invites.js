import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {Typography, Button, Stack, Box} from "@mui/material";

import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import Paper from '@mui/material/Paper';

import { useLoading } from "../context/LoadingContext";
import notifyWithToast from "../utils/toast";
import UserInfo from "../components/UserInfo";


const Invites = (props) => {

    const { authTokens } = useContext(AuthContext);
    const { id }= useParams();
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const [invites, setInvites] = useState([]);  

    useEffect(() => {
        fetchInvites();
    }, []);

    const fetchInvites = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}get_invites/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            setInvites(response.data?.data);
        } catch (error) {
            console.log(error.response.data?.message);
            // window.location.href = '/organizations';
            notifyWithToast("error", "Something went wrong");
        }

        setLoading(false);
    }

    const handleAccept = async (invitation_id) => {
        setLoading(true);
        try {
            console.log("accept", `${baseUrl}accept_invite/${invitation_id}/`)
            const response = await axios.get(
                `${baseUrl}accept_invite/${invitation_id}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );

            notifyWithToast("success", "You have joined the organization successfully");
            setInvites(invites.filter((invite) => invite.id !== invitation_id));
        } catch (error) {
            console.log(error.response.data?.message);
        }
        setLoading(false);
    }

    const handleReject = async (designation_id) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${baseUrl}reject_invite/${designation_id}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )
            notifyWithToast("success", "You have rejected the invitation successfully");
            setInvites(invites.filter((invite) => invite.id !== designation_id));
        } catch (error) {
            console.log(error.response.data?.message);
        }

        setLoading(false);
    }

    
    return (
        <>
            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                My Invitations
            </Typography>
            <Paper 
                sx={{
                    marginTop: '1rem',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                }} 
                elevation={0}
            >   {invites?.length > 0 ? 
                <Stack
                    rowGap={1}
                    columnGap={1}
                    flexDirection="column"
                >
                    {invites?.map((invite) => (
                    <Stack
                        flexDirection="row"
                        justifyContent="space-between"
                        key={invite.id}
                        columnGap={1}
                        rowGap={1}
                    >   
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexGrow={1}
                            columnGap={1}
                            rowGap={1}
                        >
                            <UserInfo userInfo={invite?.invited_by} />

                            <Typography>
                                {invite?.invited_by?.name} invited you to join {invite?.organization?.name} 
                            </Typography>
                        </Box>
                        <Stack
                            direction="row"
                            justifyContent="center" spacing={1}
                            style={{
                                margin: 'auto',
                            }}
                        >
                            <Button variant="contained" color="primary" size="small" onClick={() => handleAccept(invite.id)}
                            >
                                Accept
                            </Button>
                            <Button variant="outlined" color="primary" size="small" onClick={() =>  handleReject(invite.id)}>
                                Reject
                            </Button>
                        </Stack>
                    </Stack>
                    ))}
                </Stack>
                :
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                >
                    <Typography variant='h6' color='text.secondary'>
                        You don't have any invitation
                    </Typography>
                </Box>
                }
            </Paper>
            
        </>
    );
};

export default Invites;