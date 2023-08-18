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
import MemberTable from "../components/MemberTable";
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import ListChips from "../components/ListChips";
import TitleBar from "../components/TitleBar";
import NavMenu from "../components/NavMenu";
import {Toolbar} from "@mui/material";
import { useLoading } from "../context/LoadingContext";
import { Autocomplete, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddMemberModal } from "../components/Modals";

const OrganizationEmployees = (props) => {
   
    const { authTokens } = useContext(AuthContext);
    const { id }= useParams();
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const menuItems = ["projects", "employees", "vendors"];
    const handleMenuSelect = (menu) => {
        if(menu === "projects")
            navigate(`/organization/${id}/projects`);
        else if(menu === "vendors")
            navigate(`/organization/${id}/vendors`);
    }
    
    let [addModalOpen, setAddModalOpen] = useState(false);
    
    const handleAddModalOpen = () => {
        console.log("handle Member modal open")
        setAddModalOpen(true);
    }
    const handleAddModalClose = (employee) => {
        if(employee) {
            setEmployees([...employees, employee]);
        }
        setAddModalOpen(false);
    }

    const [organizationName, setOrganizationName] = useState();
    const [role, setRole] = useState()
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        fetchOrganizationEmployees();
        handleNameSort();
    }, [id]);

    // use axios to get organization details
    const fetchOrganizationEmployees = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}organization_employees/${id}/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            setRole(response.data.data.role);
            setOrganizationName(response.data.data.name);
            setEmployees(response.data.data.employees);
            setFilteredEmployees(response.data.data.employees)
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }

    }

    let [nameSort, setNameSort] = useState(false);
        const handleNameSort = () => {
            if (nameSort) {
                employees.sort((a, b) => (a.name < b.name) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.name > b.name) ? 1 : -1);
            }
            setNameSort(!nameSort);
        }

        let [numTasksSort, setNumTasksSort] = useState(false);
        const handleNumTasksSort = () => {
            if (numTasksSort) {
                employees.sort((a, b) => (a.completed_tasks > b.completed_tasks) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.completed_tasks < b.completed_tasks) ? 1 : -1);
            }
            setNumTasksSort(!numTasksSort);
        }

        let [ratingSort, setRatingSort] = useState(false);
        const handleRatingSort = () => {
            if (ratingSort) {
                employees.sort((a, b) => (a.avg_rating > b.avg_rating) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.avg_rating < b.avg_rating) ? 1 : -1);
            }
            setRatingSort(!ratingSort);
        }
        let [timeSort, setTimeSort] = useState(false);
        const handleTimeSort = () => {
            if (timeSort) {
                employees.sort((a, b) => (a.averageTime > b.averageTime) ? 1 : -1);
            } else {
                employees.sort((a, b) => (a.averageTime < b.averageTime) ? 1 : -1);
            }
            setTimeSort(!timeSort);
        }
    
    // const initMembers = [ {id: 1, name: "John Doe", expertise:["Video Editing", "Motion Graphics"], completed_tasks: 22, avg_rating: 3.0, averageTime: 15, role: "employee" },
    //                {id: 2, name: "Jane Doe", expertise:["Motion Graphics"], completed_tasks: 18, avg_rating: 3.5, averageTime: 14, role: "vendor" },
    //                 {id: 3, name: "Anna F", expertise:["Motion Graphics"], completed_tasks: 24, avg_rating: 3.6, averageTime: 13, role: "vendor" },
    //                 {id: 4, name: "Robert X", expertise:["Advertising"], completed_tasks: 6, avg_rating: 3.8, averageTime: 15, role: "employee" },
    //                 {id: 5, name: "James Milner", expertise:["Motion Graphics"], completed_tasks: 10, avg_rating: 4.6, averageTime: 11, role: "vendor" },
    //                 {id: 6, name: "Fardin Aungon", expertise:["Everything"], completed_tasks: 16, avg_rating: 4.8, averageTime: 12, role: "employee" },
        //   ]
    // const [members, setMembers] = useState([]);
    useEffect(() => {
    }, [nameSort, numTasksSort, ratingSort, timeSort]);
    
    return (
        <>
            <TitleBar 
                title={organizationName}
                subtitle="Employees"
            >
                <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
            </TitleBar>
            <Paper 
                sx={{
                    marginTop: '1.5rem',
                    borderRadius: '0.5rem'
                }} 
                elevation={0}
            >
                <Grid container spacing={2} >
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6">
                            Search option here
                        </Typography>
                    </Grid >
                    {
                    role === 'Admin' &&
                    <Grid item display={'flex'} xs={12} md={4} sx={{justifyContent: 'flex-end'}}>
                        
                        <Button color="primary" onClick={() => handleAddModalOpen()}>
                            <AddCircleOutlineIcon />
                                Employee
                        </Button>
                        <AddMemberModal id={id} memberType={'employee'} open={addModalOpen} handleClose={handleAddModalClose}/>
                    </Grid>
                    }
                </ Grid>

                <MemberTable
                    pageName="Employee"
                    members={employees}
                />
            </Paper>
            
        </>
    );
};

export default OrganizationEmployees;