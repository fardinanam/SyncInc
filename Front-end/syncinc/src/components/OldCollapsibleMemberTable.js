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
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Rating from '@mui/material/Rating';
import Chip from "@mui/material/Chip";
import NameAvatar from "./NameAvatar";
import ListItem from '@mui/material/ListItem';
import ListChips from "./ListChips";

const OldCollapsibleMemberTable = ({title, members}) => {
    const [open, setOpen] = useState(true);
    console.log(members);
    
    return (
        <Paper sx={{marginTop: '2rem'}}>
                <Typography variant='h6' sx={{ fontWeight: 'bold', paddingTop: '10px', paddingBottom: '10px'}}>
                    <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                                >
                                {open? (
                                <KeyboardArrowUpIcon />
                                ) : (
                                <KeyboardArrowDownIcon />
                                )}
                            
                    </IconButton>
                        {title}
                </Typography>
                <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                > 
                    <Table sx={{ minWidth: 650}} aria-label="simple table">
                    <TableBody>
                        {members.map((member) => (
                        <TableRow
                        key={member.id}
                        sx={{alignItems:"flex-start"}}
                        >   
                            <TableCell width="25%">{member.name}</TableCell>
                            <TableCell width="25%">
                                <ListChips chipData={member.expertise} />
                            </TableCell>
                            <TableCell width="20%">{member.completed_tasks}</TableCell>
                            <TableCell width="15%"><Rating name="average_rating" value={member.avg_rating} precision={0.25} readOnly/></TableCell>
                            <TableCell width="15%">{member.avg_time} days</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                </Collapse>
            </Paper> 
    );
};
export default OldCollapsibleMemberTable;
