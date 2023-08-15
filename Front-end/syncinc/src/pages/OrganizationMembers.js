import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Box, Typography, Button, Grid, IconButton } from "@mui/material";

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
import ListChips from "../components/ListChips";

const OrganizationMembers = (props) => {
   
    const { authTokens } = useContext(AuthContext);
    const id = props.id;
    const [employees, setEmployees] = useState([]);
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetchOrganizationMemberDetails();
        handleNameSort();
    }, [id]);

    // use axios to get organization details
    const fetchOrganizationMemberDetails = async () => {
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
            console.log(response.data.data);
            setEmployees(response.data.data.employees);
            setVendors(response.data.data.vendors);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }

    }

    let [nameSort, setNameSort] = useState(false);
        const handleNameSort = () => {
            if (nameSort) {
                employees.sort((a, b) => (a.name < b.name) ? 1 : -1);
                vendors.sort((a, b) => (a.name < b.name) ? 1 : -1);
                
            } else {
                employees.sort((a, b) => (a.name > b.name) ? 1 : -1);
                vendors.sort((a, b) => (a.name > b.name) ? 1 : -1);
            }
            setNameSort(!nameSort);
        }

        let [numTasksSort, setNumTasksSort] = useState(false);
        const handleNumTasksSort = () => {
            if (numTasksSort) {
                employees.sort((a, b) => (a.completed_tasks > b.completed_tasks) ? 1 : -1);
                vendors.sort((a, b) => (a.completed_tasks > b.completed_tasks) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.completed_tasks < b.completed_tasks) ? 1 : -1);
                vendors.sort((a, b) => (a.completed_tasks < b.completed_tasks) ? 1 : -1);
            }
            setNumTasksSort(!numTasksSort);
        }

        let [ratingSort, setRatingSort] = useState(false);
        const handleRatingSort = () => {
            if (ratingSort) {
                employees.sort((a, b) => (a.avg_rating > b.avg_rating) ? 1 : -1);
                vendors.sort((a, b) => (a.avg_rating > b.avg_rating) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.avg_rating < b.avg_rating) ? 1 : -1);
                vendors.sort((a, b) => (a.avg_rating < b.avg_rating) ? 1 : -1);
            }
            setRatingSort(!ratingSort);
        }
        let [timeSort, setTimeSort] = useState(false);
        const handleTimeSort = () => {
            if (timeSort) {
                employees.sort((a, b) => (a.averageTime > b.averageTime) ? 1 : -1);
                vendors.sort((a, b) => (a.averageTime > b.averageTime) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.averageTime < b.averageTime) ? 1 : -1);
                vendors.sort((a, b) => (a.averageTime < b.averageTime) ? 1 : -1);
            }
            setTimeSort(!timeSort);
        }
    
    const initMembers = [ {id: 1, name: "John Doe", expertise:["Video Editing", "Motion Graphics"], completed_tasks: 22, avg_rating: 3.0, averageTime: 15, role: "employee" },
                   {id: 2, name: "Jane Doe", expertise:["Motion Graphics"], completed_tasks: 18, avg_rating: 3.5, averageTime: 14, role: "vendor" },
                    {id: 3, name: "Anna F", expertise:["Motion Graphics"], completed_tasks: 24, avg_rating: 3.6, averageTime: 13, role: "vendor" },
                    {id: 4, name: "Robert X", expertise:["Advertising"], completed_tasks: 6, avg_rating: 3.8, averageTime: 15, role: "employee" },
                    {id: 5, name: "James Milner", expertise:["Motion Graphics"], completed_tasks: 10, avg_rating: 4.6, averageTime: 11, role: "vendor" },
                    {id: 6, name: "Fardin Aungon", expertise:["Everything"], completed_tasks: 16, avg_rating: 4.8, averageTime: 12, role: "employee" },
          ]
    // const [members, setMembers] = useState([]);
    useEffect(() => {
        // console.log(members);
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
                title={'All Employees'}
                members={employees}
            />
            <CollapsibleMemberTable
                title={'All Vendors'}
                members={vendors}
            />
        </>
    );
};

export default OrganizationMembers;