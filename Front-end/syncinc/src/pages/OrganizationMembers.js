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
import CollapsibleMemberTable from "../components/CollapsibleMemberTable";

const OrganizationMembers = (props) => {
   
    const { authTokens } = useContext(AuthContext);
    const id = props.id;
    const [organization, setOrganization] = useState();
    const [organizationEmployees, setOrganizationEmployees] = useState({});
    const [organizationVendors, setOrganizationVendors] = useState({});

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
        console.log("in members")
        try {
            const response = await axios.get(
                `${baseUrl}organization_members/${id}/`,  
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
    
    const members = [ {id: 1, name: "John Doe", expertise:"Video Editing", completedTasks: 20, averageRating: 4, averageTime: 15, role: "employee" },
                   {id: 2, name: "Jane Doe", expertise:"Motion Graphics", completedTasks: 20, averageRating: 3.5, averageTime: 15, role: "vendor" },
                    {id: 3, name: "Anna F", expertise:"Motion Graphics", completedTasks: 10, averageRating: 3.6, averageTime: 15, role: "vendor" },
                    {id: 4, name: "Robert X", expertise:"Advertising", completedTasks: 20, averageRating: 4.2, averageTime: 15, role: "employee" },
          ]

    return (
        <>
            <Paper>
                <Table sx={{ minWidth: 650, marginTop: '2rem' }} aria-label="simple table">
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