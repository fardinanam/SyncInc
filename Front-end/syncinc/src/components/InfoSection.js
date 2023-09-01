import { Box, Typography } from "@mui/material";
import { InfoSectionStyle } from "../styles/styles";

const InfoSection = ({title, children}) => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            sx={InfoSectionStyle}
        >
            <Box 
                display='flex'
            >
                <Typography
                    fontWeight={"bold"}
                    flexGrow={1}
                >
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    )
}

export default InfoSection;