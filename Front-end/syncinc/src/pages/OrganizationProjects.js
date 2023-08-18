import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import axios from "axios";

import { Box, Typography, Button, Grid, Icon, Menu } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';

import SummaryCard from "../components/SummaryCard";
import AuthContext from '../context/AuthContext';
import { baseUrl } from "../utils/config";
import OrganizationDetails from "./OrganizationDetails";
import TitleBar from "../components/TitleBar";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";
import NavMenu from "../components/NavMenu";


const OrganizationProjects = () => {
    const  { id } = useParams();
    const { setLoading } = useLoading();
    const { authTokens } = useContext(AuthContext);;
    const navigate = useNavigate();
    
    const menuItems = ["projects", "employees", "vendors"];
    const handleMenuSelect = (menu) => {
        if(menu === "employees")
            navigate(`/organization/${id}/employees`);
        else if(menu === "vendors")
            navigate(`/organization/${id}/vendors`);
    }

    const [organization, setOrganization] = useState({});
   
    // use axios to get organization details
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

            console.log(response);
            setOrganization(response.data.data);
            console.log(organization)
        } catch (error) {
            console.log(error.response.data.message);
            // window.location.href = '/organizations';
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrganizationProjectDetails();
    }, []);

    return (
        <>  
            <TitleBar 
                title="organization name"
                subtitle="projects"
            >
                <NavMenu menuItems={menuItems} handleMenuSelect={handleMenuSelect}/>
            </TitleBar>
            <Grid  
                container 
                spacing={3}
                columns={{ xs: 12, sm: 6, md: 3 }}
                paddingTop={2}
            >
            {organization?.projects?.map((project, idx) => (
                <Grid 
                    item
                    key={`project-${idx}`}
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <SummaryCard
                        title={project.name}
                        count={0}
                        name="Tasks"
                        onClick={() => navigate(`/project/${project.id}`)}
                    >
                        <WorkIcon fontSize='large' color='primary' />
                        {/* <ListItemIcon fontSize='small' color='primary' /> */}
                    </SummaryCard>
                </Grid>
            ))}
            </Grid>
        </>
        
        
    );
};

export default OrganizationProjects;