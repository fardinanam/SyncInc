import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
    return (
        <Chip size='small' label={status} color={status === "Completed" || status === "In Progress" || status === "Submitted" ? "success" : status === "Overdue" || status === "Rejected" ? "error" : "warning"} />
    );
}

export default StatusChip;