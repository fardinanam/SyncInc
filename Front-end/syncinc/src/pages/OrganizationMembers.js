import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid, IconButton } from "@mui/material";
import MainLayout from "../components/MainLayout";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {List, ListItem, ListItemText, ListItemAvatar, ListItemButton, Collapse} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';

import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TagIcon from '@mui/icons-material/Tag';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Rating from '@mui/material/Rating';
import Chip from "@mui/material/Chip";

const OrganizationMembers = (props) => {
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    //const [organizationMembers, setOrganizationMembers] = useState({});

    // useEffect(() => {
    //     fetchOrganizationMembers();
    // }, []);

    // // use axios to get organization details
    // const fetchOrganizationMembers = async () => {
    //     try {
    //         const response = await axios.get(
    //             `${baseUrl}organization_members/${id}/`,  
    //             {
    //                 headers: {
    //                     'Authorization': 'Bearer ' + authTokens?.access,
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                 }
    //             }  

    //         )

    //         console.log(response);
    //         setOrganizationMembers(response.data.data);
    //     } catch (error) {
    //         console.log(error.response.data.message);
    //         // window.location.href = '/organizations';
    //     }
    // }
    const [openEmployees, setOpenEmployees] = useState(false);
    const [openVendors, setOpenVendors] = useState(false);
    const members = [ {id: 1, name: "John Doe", expertise:"Video Editing", completedTasks: 20, averageRating: 4, averageTime: 15, role: "employee" },
                   {id: 2, name: "Jane Doe", expertise:"Motion Graphics", completedTasks: 20, averageRating: 3.5, averageTime: 15, role: "vendor" },
                    {id: 3, name: "Anna F", expertise:"Motion Graphics", completedTasks: 10, averageRating: 3.6, averageTime: 15, role: "vendor" },
                    {id: 4, name: "Robert X", expertise:"Advertising", completedTasks: 20, averageRating: 4.2, averageTime: 15, role: "employee" },
          ]

    return (
        <>
            <Box 
                display= 'flex'                
                alignItems='center'
                paddingBottom={3}
            >
                <Box flexGrow={1}>
                    <Typography 
                        variant='h5'
                        sx={{ fontWeight: 'bold'}}
                    > Members</Typography>
                </Box>
                <Button variant='contained'onClick={() => navigate('/add_project')}><AddRoundedIcon />Member</Button>
            </Box>

            <Paper>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                        <TableRow>
                            <TableCell > <TagIcon></TagIcon></TableCell>
                            <TableCell width="18%">Name <IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="18%">Expertise<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="18%">Completed Tasks<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="18%">Average Rating<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="18%">Average Time<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                        </TableRow>
                </Table>
            </Paper>
            
            <Paper sx={{marginTop: '20px'}}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>
                    <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpenEmployees(!openEmployees)}
                                >
                                {openEmployees ? (
                                <KeyboardArrowUpIcon />
                                ) : (
                                <KeyboardArrowDownIcon />
                                )}
                            
                    </IconButton>
                        All Designers
                </Typography>
            <Collapse
            in={openEmployees}
            timeout="auto"
            unmountOnExit
            > 
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                <TableBody>
                    {members.filter(member => member.role === 'employee').map((member) => (
                    <TableRow
                    key={member.id}
                    sx={{alignItems:"flex-start"}}
                    >   
                        <TableCell >
                            {member.id}
                        </TableCell>
                        <TableCell width="18%">{member.name}</TableCell>
                        <TableCell width="18%"><Chip label={member.expertise} color="success" /></TableCell>
                        <TableCell width="18%">{member.completedTasks}</TableCell>
                        <TableCell width="18%"><Rating name="average_rating" value={member.averageRating} precision={0.25} readOnly/></TableCell>
                        <TableCell width="18%">{member.averageTime} days</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            </Collapse>
            </Paper>



            <Paper sx={{marginTop: '20px'}}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>
                    <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpenVendors(!openVendors)}
                                >
                                {openVendors ? (
                                <KeyboardArrowUpIcon />
                                ) : (
                                <KeyboardArrowDownIcon />
                                )}
                            
                    </IconButton>
                        All Designers
                </Typography>
            <Collapse
            in={openVendors}
            timeout="auto"
            unmountOnExit
            > 
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                <TableBody>
                    {members.filter(member => member.role === 'vendor').map((member) => (
                    <TableRow
                    key={member.id}
                    sx={{alignItems:"flex-start"}}
                    >   
                        <TableCell >
                            {member.id}
                        </TableCell>
                        <TableCell width="18%">{member.name}</TableCell>
                        <TableCell width="18%"><Chip label={member.expertise} color="primary" /></TableCell>
                        <TableCell width="18%">{member.completedTasks}</TableCell>
                        <TableCell width="18%"><Rating name="average_rating" value={member.averageRating} precision={0.25} readOnly/></TableCell>
                        <TableCell width="18%">{member.averageTime} days</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            </Collapse>
            </Paper>
        </>
    );
};

export default OrganizationMembers;