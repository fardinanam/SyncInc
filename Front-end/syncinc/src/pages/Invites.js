import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {Typography, Button, Grid, List, ListItem} from "@mui/material";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import Paper from '@mui/material/Paper';

import { useLoading } from "../context/LoadingContext";
import notifyWithToast from "../utils/toast";


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
            console.log(response.data.data);
            setInvites(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }

    }

    const handleAccept = async (designation_id) => {
        try {
            console.log("accept", `${baseUrl}accept_invite/${designation_id}/`)
            const response = await axios.get(
                `${baseUrl}accept_invite/${designation_id}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )
            notifyWithToast("success", "You have joined the organization successfully");
            setInvites(invites.filter((invite) => invite.id !== designation_id));
            
            console.log(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }
    }

    const handleReject = async (designation_id) => {
        console.log("reject", designation_id)
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
            notifyWithToast("success", "Your rejection has been recorded successfully");
            setInvites(invites.filter((invite) => invite.id !== designation_id));
            console.log(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    
    return (
        <>
            <Paper 
                sx={{
                    marginTop: '1.5rem',
                    borderRadius: '0.5rem'
                }} 
                elevation={0}
            >
                <Table aria-label="simple table">
                        <TableBody>
                            {invites?.map((invite) => (
                            <TableRow
                                key={invite.id}
                                sx={{alignItems:"flex-start"}}
                            >   
                                <TableCell width={"60%"}>
                                    <Typography>
                                        You are invited to join {invite?.organization?.name} as employee
                                    </Typography>
                                </TableCell>
                                <TableCell width={"20%"}>
                                    <Button variant="contained" color="success" onClick={() => handleAccept(invite.id)}>
                                        Accept
                                    </Button>
                                </TableCell>
                                <TableCell >
                                    <Button variant="contained" color="error" onClick={() =>  handleReject(invite.id)}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </Paper>
            
        </>
    );
};

export default Invites;