import { Grid, Box, Typography, Button } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddItemLayout = ({ title, onSubmit, onClose, children }) => {
    return (
        <>
            <Box
                component="form"
                noValidate
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                onSubmit={onSubmit}
            >
                <Grid container mt={10}>
                    <Grid item xs={0} sm={3} />
                    <Grid item xs={12} sm={6}>
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
                                            <Button color="error" onClick={onClose}>
                                                <CloseRoundedIcon />
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
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