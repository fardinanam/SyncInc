import { common } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { light } from "@mui/material/styles/createPalette";

const theme = createTheme({
    palette: {
        background: {
            main: "#F5F5F5",
            light: "#FFFFFF",
        },
        main: {
            main: "#FFFFFF",
        },
    },
})

export default theme;