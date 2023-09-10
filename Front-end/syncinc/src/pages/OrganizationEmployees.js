import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Grid, Fab } from "@mui/material";
import Paper from '@mui/material/Paper';
import MemberTable from "../components/MemberTable";
import { useLoading } from "../context/LoadingContext";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AddMemberModal } from "../components/Modals";
import { fabStyle } from "../styles/styles";

const OrganizationEmployees = ({employees, search}) => {
    const { id }= useParams();
    
    let [addModalOpen, setAddModalOpen] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    
    const handleAddModalOpen = () => {
        console.log("handle Member modal open")
        setAddModalOpen(true);
    }
    const handleAddModalClose = (employee) => {
        setAddModalOpen(false);
    }

    const [role, setRole] = useState();

    useEffect(() => {
        // fetchOrganizationEmployees();
        handleNameSort();
    }, [id]);

    useEffect(() => {
        setFilteredEmployees(employees);
    }, [employees]);

    useEffect(() => {
        if (!search || search === "") {
            setFilteredEmployees(employees);
            return;
        }
        
        setFilteredEmployees(employees.filter(employee => {
            return employee.username?.toLowerCase().includes(search.toLowerCase());
        }));
    }, [search]);

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
            <Paper 
                sx={{
                    marginTop: '1.5rem',
                    borderRadius: '0.5rem'
                }} 
                elevation={0}
            >
                <Grid container spacing={2} >
                    {
                    role === 'Admin' &&
                    <Grid item display={'flex'} xs={12} md={12} sx={{justifyContent: 'flex-end'}}>
                        <Fab
                            color="primary"
                            aria-label="add"
                            size="medium"
                            onClick={() => handleAddModalOpen()}
                            sx={fabStyle}
                        >
                            <AddRoundedIcon />
                        </Fab>

                        <AddMemberModal id={id} memberType={'employee'} open={addModalOpen} handleClose={handleAddModalClose}/>
                    </Grid>
                    }
                </Grid>

                <MemberTable
                    pageName="Employee"
                    members={filteredEmployees}
                />
            </Paper>
            
        </>
    );
};

export default OrganizationEmployees;