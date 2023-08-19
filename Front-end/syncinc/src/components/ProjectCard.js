import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ProjectCard = (props) => {
    const theme = useTheme();
    const backgroundColor = theme.palette.main[theme.palette.mode]

    let {name, client, description, children} = props;
    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 0,
                '&:hover': {
                    cursor: 'pointer',
                },
                backgroundColor: backgroundColor,
            }}
            onClick={props.onClick}
        >
            <CardContent>
                {children}
                <Typography
                    variant="h5"
                    fontWeight={'bold'}
                >
                    {name}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 16,
                    }}
                    color="text.secondary" gutterBottom
                >
                    {client}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 14
                    }}
                    color="text.secondary" gutterBottom
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProjectCard;