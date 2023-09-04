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
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AddMemberModal } from "../components/Modals";
import OrganizationNavMenu from "../components/OrganizationNavMenu";

const OrganizationEmployees = (props) => {

    const { authTokens } = useContext(AuthContext);
    const { id }= useParams();
    const { setLoading } = useLoading();
    
    let [addModalOpen, setAddModalOpen] = useState(false);
    
    const handleAddModalOpen = () => {
        console.log("handle Member modal open")
        setAddModalOpen(true);
    }
    const handleAddModalClose = (employee) => {
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
        setLoading(true);
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
        setLoading(false);

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
    
    useEffect(() => {
    }, [nameSort, numTasksSort, ratingSort, timeSort]);
    
    return (
        <>
            <TitleBar 
                title={organizationName}
                subtitle="Employees"
            >
                <OrganizationNavMenu organization_id={id}/>
            </TitleBar>
            <Paper 
                sx={{
                    marginTop: '1.5rem',
                    borderRadius: '0.5rem'
                }} 
                elevation={0}
            >
                <Grid container spacing={2} >
                    {/* <Grid item xs={12} md={8}>
                        <Typography variant="h6">
                            Search option here
                        </Typography>
                    </Grid> */}
                    {
                    role === 'Admin' &&
                    <Grid item display={'flex'} xs={12} md={12} sx={{justifyContent: 'flex-end'}}>
                        
                        <Button 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                            sx={{
                                mr: '1rem'
                            }}
                            onClick={() => handleAddModalOpen()}
                            startIcon={<AddRoundedIcon fontSize="small"/>}
                        >
                                Employee
                        </Button>
                        <AddMemberModal id={id} memberType={'employee'} open={addModalOpen} handleClose={handleAddModalClose}/>
                    </Grid>
                    }
                </Grid>

                <MemberTable
                    pageName="Employee"
                    members={employees}
                />
            </Paper>
            
        </>
    );
};

export default OrganizationEmployees;