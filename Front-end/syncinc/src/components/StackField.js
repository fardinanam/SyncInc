import { Stack, Typography } from "@mui/material";

const StackField = (props) => {
    return (
        <Stack>
            <Typography
                fontWeight={"light"}
                fontSize={"small"}
            >
                {props.title}
            </Typography>
            {props.value}
        </Stack>

    )
}

export default StackField;