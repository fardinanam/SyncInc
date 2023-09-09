import { useState, useEffect, createContext, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { wsBaseUrl, baseUrl } from '../utils/config';
const SocketContext = createContext();


const SocketProvider = ({ children }) => {
    let { authTokens, user, isLoggedIn } = useContext(AuthContext)
    
    const [chatSocket, setChatSocket] = useState(null)
    const [notifications, setNotifications] = useState([]);
    

    const getUserNotifications = async (e) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + authTokens?.access,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        
        try {  
            const response = await axios.get(
                `${baseUrl}get_user_notifications/`,
                config
            )

            if(response.data.data) {
                let updatedNotifications = response.data.data
                updatedNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNotifications(updatedNotifications)
            }
        } catch (error) {
            console.log(error)   
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            let url = `${wsBaseUrl}ws/socket_apps/${user?.username}/`
            const chatSocket = new WebSocket(url)
            setChatSocket(chatSocket)
            getUserNotifications()
            // console.log('Chat Socket:', chatSocket)
        } else {
            setChatSocket(null)
            setNotifications([])
            // console.log('Chat Socket:', chatSocket)
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            let url = `${wsBaseUrl}ws/socket_apps/${user?.username}/`
            const chatSocket = new WebSocket(url)
            setChatSocket(chatSocket)
            getUserNotifications()
            // console.log('Chat Socket:', chatSocket)
        } else {
            // console.log('Chat Socket:', chatSocket)
            setChatSocket(null)
            // console.log('Chat Socket:', chatSocket)
        }
    }, []);
    
    
    if(chatSocket !== null) {
        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
            let newNotification = data.message

            const updatedNotifications = [...notifications, newNotification];
            updatedNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            // setNotifications((prevNotifications) => [...prevNotifications, newNotification])
            setNotifications(updatedNotifications)
            // console.log(newNotification)
            //ack message
            // chatSocket.send(JSON.stringify({ 'status': 'received', 'id': newNotification.id }));
        }
    }
    
    return (
        <SocketContext.Provider value={ {chatSocket, notifications, setNotifications} }>
            {children}
        </SocketContext.Provider>
    )
}
    
export default SocketContext;
export { SocketProvider };

