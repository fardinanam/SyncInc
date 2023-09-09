import { useState, useContext, useEffect } from "react";
import TitleBar from "../components/TitleBar";
import OrganizationNavMenu from "../components/OrganizationNavMenu";
import { useParams } from "react-router-dom";
import { Tab, Tabs, Typography, Box, SpeedDial, Stack } from "@mui/material";
import SearchBar from "../components/SearchBar";
import DescriptionIcon from '@mui/icons-material/Description';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import OrganizationProjects from "./OrganizationProjects";
import OrganizationEmployees from "./OrganizationEmployees";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/config";
import notifyWithToast from "../utils/toast";
import AuthContext from "../context/AuthContext";
import { fabStyle } from "../styles/styles";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { AddMemberModal } from "../components/Modals";
import UserInfo from "../components/UserInfo";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ConfirmDialog from "../components/Dialogs";


const OrganizationDetails = () => {
    const { id } = useParams();
    const [tab, setTab] = useState("Projects");
    const [organizationName, setOrganizationName] = useState();
    const [role, setRole] = useState();
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [admin, setAdmin] = useState();
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const { authTokens } = useContext(AuthContext);
    const [editSpeedDialOpen, setEditSpeedDialOpen] = useState(false);
    const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
    const [searchedText, setSearchedText] = useState("");
    const [isDeleteOrgDialogOpen, setIsDeleteOrgDialogOpen] = useState(false);

    const fetchOrganizationDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}get_organization_details/${id}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }

            )

            setOrganizationName(response.data?.data?.name);
            setRole(response.data?.data?.role)
            setAdmin(response.data?.data?.admin);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);
    }


    const fetchOrganizationProjectDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseUrl}organization_projects/${id}/`,  
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }  

            )

            setProjects(response.data?.data?.projects);
        } catch (error) {
            navigate(-1);
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);
    }

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

            setEmployees(response.data.data.employees);
            // setFilteredEmployees(response.data.data.employees)
        } catch (error) {
            console.log(error.response.data.message);
        }
        setLoading(false);

    }

    const handleDeleteOrganization = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${baseUrl}delete_organization/${id}/`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + authTokens?.access,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )

            if (response.status === 200) {
                notifyWithToast("success", response.data.message);
                navigate("/organizations");
            }
        } catch (error) {
            notifyWithToast("error", error.response.data.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrganizationDetails();
        fetchOrganizationProjectDetails();
        fetchOrganizationEmployees();
    }, []);

    return (
        <>
            <TitleBar 
                title={organizationName}
                subtitleElement={
                    <Typography variant="h7"
                        fontWeight="bold"
                        color="text.secondary"
                    >
                        {tab}
                    </Typography>
                }
            >
            <Stack direction="row"
                flexWrap="wrap"
                rowGap={1}
                columnGap={1}
                justifyContent="flex-end"
            >
                <Box 
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                <UserInfo
                    sx={{
                        width: '3rem',
                        height: '3rem'
                    }}
                    userInfo={admin}
                />
                </Box>
                <Stack 
                    direction="column"
                    justifyContent="center"
                >
                    <Typography fontWeight="light">
                        Admin
                    </Typography>
                    <Typography variant="subtitle2">
                        {admin?.name}
                    </Typography>
                </Stack>
            </Stack>
            </TitleBar>
            <Box display="flex" 
                justifyContent="space-between" 
                mb={1}
                rowGap={1}
                columnGap={1}
            >
                <Tabs
                    value={tab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    onChange={(event, newValue) => {
                        setTab(newValue);
                    }}
                >
                    <Tab 
                        label="Projects" 
                        icon={<DescriptionIcon />} 
                        value={"Projects"} 
                        iconPosition="start"
                    />
                    <Tab 
                        label="Employees" 
                        icon={<SupervisedUserCircleIcon />} 
                        value={"Employees"} 
                        iconPosition="start"
                    />
                </Tabs>
                <Box 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-end"
                >
                    <SearchBar 
                        placeholder={`Search ${tab}...`}
                        onChange={(event) => setSearchedText(event.target.value)}
                    />
                </Box>
                
            </Box>
            {
                tab === "Projects" &&
                <OrganizationProjects 
                    projects={projects}
                    role={role}
                    search={searchedText}
                />
            }
            {
                tab === "Employees" &&
                <OrganizationEmployees 
                    employees={employees}
                    search={searchedText}
                />
            }

            {
                role === 'Admin' &&
                <Box>
                    <SpeedDial
                        ariaLabel="Organization Actions"
                        sx={fabStyle}
                        icon={<EditRoundedIcon />}
                        onClose={() => setEditSpeedDialOpen(false)}
                        onOpen={() => setEditSpeedDialOpen(true)}
                        open={editSpeedDialOpen}
                    >
                        <SpeedDialAction
                            key="Add Project"
                            icon={<AddRoundedIcon />}
                            tooltipTitle="Project"
                            tooltipOpen
                            onClick={() => navigate(`/organization/${id}/add-project`)}
                        />
                        <SpeedDialAction
                            key="Add Employee"
                            icon={<PersonAddRoundedIcon />}
                            tooltipTitle="Employee"
                            tooltipOpen
                            onClick={() => setAddEmployeeModalOpen(true)}
                        />
                        {
                            role === 'Admin' &&
                            <SpeedDialAction
                                key="Delete Organization"
                                icon={<DeleteRoundedIcon />}
                                tooltipTitle="Organization"
                                tooltipOpen
                                onClick={() => setIsDeleteOrgDialogOpen(true)}
                            />
                        }
                    </SpeedDial>
                    <AddMemberModal id={id} 
                        memberType={'employee'}     
                        open={addEmployeeModalOpen} 
                        handleClose={()=>setAddEmployeeModalOpen(false)}
                    />
                </Box> 
            }
            {
                role === 'Admin' &&
                <ConfirmDialog
                    open={isDeleteOrgDialogOpen}
                    title="Delete Organization"
                    helpText={`Are you sure you want to delete ${organizationName}? Deleting an organization will delete all its projects and employees and cannot be undone.`}
                    actionType="Delete"
                    confirmColor={"error"}
                    confirmIcon={<DeleteRoundedIcon />}
                    handleClose={() => setIsDeleteOrgDialogOpen(false)}
                    handleConfirm={handleDeleteOrganization}
                />
            }
        </>
    )
}

export default OrganizationDetails;