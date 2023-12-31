import { Grid, Box, Typography, Button, IconButton } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddItemLayout = ({ title, onClose, children }) => {
    return (
        <>
            <Box
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
            
                <Grid container mt={10}>
                    <Grid item xs={0} md={3} />
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={12}>
                                <Grid container>
                                    <Grid item xs={1} sm={2} />
                                    <Grid item xs={10} sm={8} >
                                        <Typography 
                                            sx = {{
                                                fontWeight: 'bold'
                                            }} 
                                            align="center"
                                            variant="h5" 
                                        >
                                        {title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1} sm={2}>
                                        <Box 
                                            sx={{
                                                textAlign: 'right',
                                                verticalAlign: 'middle',
                                            }}
                                        >
                                            <IconButton 
                                                color="error" 
                                                onClick={onClose}
                                            >
                                                <CloseRoundedIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {children}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={0} sm={3} />
                </Grid>
            </Box>
        </>
    )
};

export default AddItemLayout;