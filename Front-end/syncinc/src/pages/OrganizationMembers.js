import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid, IconButton } from "@mui/material";

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {Collapse} from '@mui/material';

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
import NameAvatar from "../components/NameAvatar";
import {ToggleButtonGroup, ToggleButton} from "@mui/material";
import CollapsibleMemberTable from "../components/CollapsibleMemberTable";

const OrganizationMembers = (props) => {
    console.log("in members")
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedValue, setSelectedValue] = useState('members');
    const [organization, setOrganization] = useState({});

    const handleToggleChange = (event, newValue) => {
        console.log(id);
        console.log(newValue);
        if(newValue != null) {
            setSelectedValue(newValue);
            navigate(`/organization/${id}/${newValue}`);
        }
    }

    const [organizationMembers, setOrganizationMembers] = useState({});

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
        console.log("in members")
        try {
            const response = await axios.get(
                `${baseUrl}organization_details/${id}/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )

            console.log(response);
            setOrganization(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }
    }
    const [openEmployees, setOpenEmployees] = useState(false);
    const [openVendors, setOpenVendors] = useState(false);
    const members = [ {id: 1, name: "John Doe", expertise:"Video Editing", completedTasks: 20, averageRating: 4, averageTime: 15, role: "employee" },
                   {id: 2, name: "Jane Doe", expertise:"Motion Graphics", completedTasks: 20, averageRating: 3.5, averageTime: 15, role: "vendor" },
                    {id: 3, name: "Anna F", expertise:"Motion Graphics", completedTasks: 10, averageRating: 3.6, averageTime: 15, role: "vendor" },
                    {id: 4, name: "Robert X", expertise:"Advertising", completedTasks: 20, averageRating: 4.2, averageTime: 15, role: "employee" },
          ]

    return (
        <>
            <Grid 
                container
            >
                <Grid 
                    item
                    display={'flex'}
                    xs={12} md={3}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                >
                    <Typography
                        variant='h5'
                        sx={{ fontWeight: 'bold' }}
                        flexGrow={1}
                        >
                        {organization?.name}
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    display={'flex'}
                    xs={12} md={6}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <ToggleButtonGroup  
                        value={selectedValue}
                        exclusive
                        onChange={handleToggleChange}
                        aria-label="text alignment"
                        sx={{ height: '80%' }}
                    >
                        <ToggleButton value="projects" aria-label="left aligned">
                            <Typography
                                variant='h6'
                                flexGrow={1}
                            >
                                projects
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value="members" aria-label="right aligned">
                            <Typography
                                variant='h6'
                                flexGrow={1}
                            >
                                members
                            </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid 
                    item
                    display={'flex'}
                    xs={12} md={3}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                >
                    <Button variant='contained' onClick={() => navigate('add-project') }>
                        <AddRoundedIcon />
                        Project
                    </Button>

                </Grid>
            
            </Grid>

        
            <Paper>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
                        <TableRow>
                            <TableCell width="25%">Name <IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="25%">Expertise<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="20%">Completed Tasks<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="15%">Average Rating<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="15%">Average Time<IconButton><SortIcon></SortIcon></IconButton></TableCell>
                        </TableRow>
                </Table>
            </Paper>
            <CollapsibleMemberTable
                title={'All Designers'}
                members={members.filter(member => member.role === 'employee')}
            />
            <CollapsibleMemberTable
                title={'All Vendors'}
                members={members.filter(member => member.role === 'vendor')}
            />
        </>
    );
};

export default OrganizationMembers;