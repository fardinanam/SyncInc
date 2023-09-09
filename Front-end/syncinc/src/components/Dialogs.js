import { Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText } from "@mui/material"

const ConfirmDialog = ({ title, helpText, actionType, open, handleClose, handleConfirm, confirmIcon, confirmColor}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {helpText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}
                    variant="normal"
                    color="primary"
                >Cancel</Button>
                <Button onClick={handleConfirm}
                    startIcon={confirmIcon}
                    color={confirmColor}
                    variant="contained"
                    size="small"
                    disableElevation
                >{actionType}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog