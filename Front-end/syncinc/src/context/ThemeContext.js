import { createTheme } from "@mui/material/styles";

const baseTheme = {
    palette: {
        primary: {
            main: "#6C5DD3",
        },
        background: {
            main: "#F5F5F5",
            light: "#F5F5F5",
            dark: "#161718"
        },
        main: {
            main: "#FFFFFF",
            light: "#FFFFFF",
            dark: "#121212"
        },
    },
};

const theme = (mode) => {
    return createTheme({
        palette: {
            ...(baseTheme.palette),
            mode: mode,
        }
    })
}




export default theme;