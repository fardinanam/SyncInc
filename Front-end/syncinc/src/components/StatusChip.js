import { Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StatusChip = ({ status }) => {
    const color = status === "Completed" || status === "In Progress" || status === "Submitted" ? "success" : status === "Overdue" || status === "Rejected" || status === "Terminated" ? "error" : "warning";

    return (
        <Chip size='small' label={status} 
            icon={<FiberManualRecordIcon color={color}/>}
        />
    );
}

export default StatusChip;