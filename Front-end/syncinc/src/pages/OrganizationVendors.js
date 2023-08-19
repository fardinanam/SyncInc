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


const OrganizationVendors = (props) => {
   
    const { authTokens } = useContext(AuthContext);
    const { id }= useParams();
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    const menuItems = ["projects", "employees", "vendors"];
    const handleMenuSelect = (menu) => {
        if(menu === "projects")
            navigate(`/organization/${id}/projects`);
        else if(menu === "employees")
            navigate(`/organization/${id}/employees`);
    }
    
    let [addModalOpen, setAddModalOpen] = useState(false);
    
    const handleAddModalOpen = () => {
        console.log("handle Member modal open")
        setAddModalOpen(true);
    }
    const handleAddModalClose = (vendor) => {
        if(vendor) {
            setVendors([...vendors, vendor]);
        }
        setAddModalOpen(false);
    }

    const [organizationName, setOrganizationName] = useState();
    const [role, setRole] = useState()
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    
    useEffect(() => {
        fetchOrganizationVendors();
        handleNameSort();
    }, [id]);

    // use axios to get organization details
    const fetchOrganizationVendors = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}organization_vendors/${id}/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )
            setOrganizationName(response.data.data.name);
            setRole(response.data.data.role);
            setVendors(response.data.data.vendors);
            setFilteredVendors(response.data.data.vendors);
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }

    }

    let [nameSort, setNameSort] = useState(false);
        const handleNameSort = () => {
            if (nameSort) {
                vendors.sort((a, b) => (a.name < b.name) ? 1 : -1);
            } else {
                vendors.sort((a, b) => (a.name > b.name) ? 1 : -1);
            }
            setNameSort(!nameSort);
        }

        let [numTasksSort, setNumTasksSort] = useState(false);
        const handleNumTasksSort = () => {
            if (numTasksSort) {
                vendors.sort((a, b) => (a.completed_tasks > b.completed_tasks) ? 1 : -1);
            } else {
                vendors.sort((a, b) => (a.completed_tasks < b.completed_tasks) ? 1 : -1);
            }
            setNumTasksSort(!numTasksSort);
        }

        let [ratingSort, setRatingSort] = useState(false);
        const handleRatingSort = () => {
            if (ratingSort) {
                vendors.sort((a, b) => (a.avg_rating > b.avg_rating) ? 1 : -1);
            } else {
                vendors.sort((a, b) => (a.avg_rating < b.avg_rating) ? 1 : -1);
            }
            setRatingSort(!ratingSort);
        }
        let [timeSort, setTimeSort] = useState(false);
        const handleTimeSort = () => {
            if (timeSort) {
                vendors.sort((a, b) => (a.averageTime > b.averageTime) ? 1 : -1);
            } else {
                vendors.sort((a, b) => (a.averageTime < b.averageTime) ? 1 : -1);
            }
            setTimeSort(!timeSort);
        }
    useEffect(() => {
        // console.log(members);
    }, [nameSort, numTasksSort, ratingSort, timeSort]);
    return (
        <>
            <TitleBar 
                title={organizationName}
                subtitle="Vendors"
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
                                Vendor
                        </Button>
                        <AddMemberModal id={id} memberType={'vendor'} open={addModalOpen} handleClose={handleAddModalClose}/>
                        
                    </Grid>
                    }
                </ Grid>

                <MemberTable
                    pageName="Vendors"
                    members={vendors}
                />
            </Paper>
        
    </>
    );
};

export default OrganizationVendors;