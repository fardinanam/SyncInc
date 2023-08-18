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
import { useLoading } from "../context/LoadingContext";

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
    
    let [memberModalOpen, setMemberModalOpen] = useState(false);
    const handleAddMemberModalOpen = () => {
        console.log("handle Member modal open")
        setMemberModalOpen(true);
    }
    const handleAddMemberModalClose = () => {
        setMemberModalOpen(false);
    }

    const [vendors, setVendors] = useState([]);

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
            console.log(response.data.data);
            setVendors(response.data.data.vendors);
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
                title="organization name"
                subtitle="Vendors"
            >
                <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
            </TitleBar>
            <MemberTable
                pageName="vendor"
                members={vendors}
            />
        </>
    );
};

export default OrganizationVendors;