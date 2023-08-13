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
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const OrganizationMembers = (props) => {
   
    const { authTokens } = useContext(AuthContext);
    const id = props.id;
    const [organization, setOrganization] = useState();
    const [organizationEmployees, setOrganizationEmployees] = useState({});
    const [organizationVendors, setOrganizationVendors] = useState({});

    useEffect(() => {
        fetchOrganizationProjectDetails();
        handleNameSort();
    }, []);

    // use axios to get organization details
    const fetchOrganizationProjectDetails = async () => {
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

    let [nameSort, setNameSort] = useState(false);
        const handleNameSort = () => {
            if (nameSort) {
                members.sort((a, b) => (a.name < b.name) ? 1 : -1);
            } else {
                members.sort((a, b) => (a.name > b.name) ? 1 : -1);
            }
            setNameSort(!nameSort);
        }

        let [numTasksSort, setNumTasksSort] = useState(false);
        const handleNumTasksSort = () => {
            if (numTasksSort) {
                members.sort((a, b) => (a.completedTasks > b.completedTasks) ? 1 : -1);
            } else {
                members.sort((a, b) => (a.completedTasks < b.completedTasks) ? 1 : -1);
            }
            setNumTasksSort(!numTasksSort);
        }

        let [ratingSort, setRatingSort] = useState(false);
        const handleRatingSort = () => {
            if (ratingSort) {
                members.sort((a, b) => (a.averageRating > b.averageRating) ? 1 : -1);
            } else {
                members.sort((a, b) => (a.averageRating < b.averageRating) ? 1 : -1);
            }
            setRatingSort(!ratingSort);
        }
        let [timeSort, setTimeSort] = useState(false);
        const handleTimeSort = () => {
            if (timeSort) {
                members.sort((a, b) => (a.averageTime > b.averageTime) ? 1 : -1);
            } else {
                members.sort((a, b) => (a.averageTime < b.averageTime) ? 1 : -1);
            }
            setTimeSort(!timeSort);
        }
    
    const initMembers = [ {id: 1, name: "John Doe", expertise:"Video Editing", completedTasks: 22, averageRating: 3.0, averageTime: 15, role: "employee" },
                   {id: 2, name: "Jane Doe", expertise:"Motion Graphics", completedTasks: 18, averageRating: 3.5, averageTime: 14, role: "vendor" },
                    {id: 3, name: "Anna F", expertise:"Motion Graphics", completedTasks: 24, averageRating: 3.6, averageTime: 13, role: "vendor" },
                    {id: 4, name: "Robert X", expertise:"Advertising", completedTasks: 6, averageRating: 3.8, averageTime: 15, role: "employee" },
                    {id: 5, name: "James Milner", expertise:"Motion Graphics", completedTasks: 10, averageRating: 4.6, averageTime: 11, role: "vendor" },
                    {id: 6, name: "Fardin Aungon", expertise:"Everything", completedTasks: 16, averageRating: 4.8, averageTime: 12, role: "employee" },
          ]
    const [members, setMembers] = useState(initMembers);
    useEffect(() => {
        console.log(members);
    }, [nameSort, numTasksSort, ratingSort, timeSort]);
    return (
        <>
            <Paper>
                <Table sx={{ minWidth: 650, marginTop: '2rem' }} aria-label="simple table">
                        <TableRow>
                            <TableCell width="25%">Name <IconButton onClick={handleNameSort}><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="25%">Expertise</TableCell>
                            <TableCell width="20%">Completed Tasks<IconButton onClick={handleNumTasksSort}><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="15%">Average Rating<IconButton onClick={handleRatingSort}><SortIcon></SortIcon></IconButton></TableCell>
                            <TableCell width="15%">Average Time<IconButton onClick={handleTimeSort}><SortIcon></SortIcon></IconButton></TableCell>
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