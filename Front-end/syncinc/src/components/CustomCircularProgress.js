import { Box, useTheme, Typography, Paper, Stack } from "@mui/material";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck"
import { useState, useEffect } from "react";

import {
  CircularProgressbar,

  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CustomCircularProgress = ({ type, numerator, denominator }) => {
    const [percentage, setPercentage] = useState(0);

    const theme = useTheme()

    useEffect(() => {

        if (numerator && denominator) {
            if (denominator === 0)
                setPercentage(0);
            else {
                const p = parseFloat(((numerator / denominator) * 100.0)).toFixed(0);
                setPercentage(p);
            }
        }
        
    }, [numerator, denominator])


    return (
      <Paper
      sx={{
          borderRadius: "0.5rem",
          width: 250,
          padding: "1rem 0rem"
      }}
      elevation={0}
      >
      <Stack 
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
      >
          <Typography 
              fontWeight="bold"
          >
              Completed {type} Targets
          </Typography>
          <Box 
              sx={{
                  width:130, 
                  height:"8rem"
              }}
          >
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textColor: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
                  pathColor: theme.palette.success[theme.palette.mode],
                  trailColor: theme.palette.mode === "dark" ? "#242424" : "#E0E0E0",
                  width: "10px",
                  height: "10px"
                })}
                strokeWidth="15"
              />
              
           </Box>
           <Stack 
              direction="row"
              justifyContent="space-between"
              spacing={1}
          >
              <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-start"
              >
                  <LibraryAddCheckIcon
                      size="large" 
                      color='success'
                  />
                  <Stack 
                      direction="column"
                  >
                      <Typography 
                          variant='h7'
                          fontWeight="bold"
                      >
                          Completed {type}s
                      </Typography>
                      {/* <Typography
                          fontSize="10px"
                      >
                          Global
                      </Typography> */}
                  </Stack>
              </Stack>
              <Typography
                  variant='h7'
                  fontWeight="bold"
              >
                  {numerator ? numerator : 0}
              </Typography>
          </Stack>
      </Stack>
      </Paper>
      
    );
  };
  

export default CustomCircularProgress;