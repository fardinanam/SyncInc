import { Button, CssBaseline } from "@mui/material"
import { useNavigate } from "react-router-dom"

const ErrorPage = ({errorCode = "404"}) => {
    const navigate = useNavigate();

    return (
        <>
            <CssBaseline />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    flexDirection: 'column'
                }}
            >
                <h1>{errorCode} Page Not Found</h1>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                > Go Home </Button>
            </div>
        </>
    )
}

export default ErrorPage