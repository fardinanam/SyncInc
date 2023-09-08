import toast from 'react-hot-toast';
import InfoIcon from '@mui/icons-material/Info';

const toastStyle = {
    startPosition: 'bottom-right',
    position: 'bottom-right',
    style: {
        background: 'main',
    },
    duration: 4000,
}
const notifyWithToast = (type, message) => {
    if (type === 'error') {
        toast.error(message, toastStyle);
    } else if (type === 'success') {
        toast.success(message, toastStyle);
    } else if (type === 'loading') {
        toast.loading(message);
    } else if (type === 'description') {
        const descStyle = {
            ...toastStyle,
            position: 'top-center',
            
            options:{
                hideProgressBar: false,
            }
        }
        toast(
            <div>
                <p>
                    {message}
                </p>
            </div>, 
            descStyle,
        )
    } else {
        const infoStyle = {
            ...toastStyle,
            icon: <InfoIcon sx={{
                    color: '#FAF200'
                }}/>,
        }

        toast(message, infoStyle);
    }
}

export default notifyWithToast;