import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';

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

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const ToggleColorMode = ({children}) => {
    let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const savedThemePreference = localStorage.getItem("theme");

    if (savedThemePreference) {
        prefersDarkMode = savedThemePreference === "dark";
    } 
    
    const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        [],
    );

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(baseTheme.palette)
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default ToggleColorMode;
export { ColorModeContext };