import { useState, useEffect, createContext, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { baseUrl } from '../utils/config';
const SocketContext = createContext();


const SocketProvider = ({ children }) => {
    let { authTokens, user } = useContext(AuthContext)
    
    const [chatSocket, setChatSocket] = useState(null)
    const [notifications, setNotifications] = useState([]);
    

    const getUnreadNotifications = async (e) => {
        console.log('getUnreadNotifications')
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
            console.log(response.data.data)
            if(response.data.data) {
                setNotifications(response.data.data)
            }
        } catch (error) {
            console.log(error)   
        }
    }

    // useEffect(() => {
    //     if (user !== null) {
    //         const chatSocket = new WebSocket(url)
    //         setChatSocket(chatSocket)
    //         getUnreadNotifications()
    //         console.log('Chat Socket:', chatSocket)
    //     } else {
    //         setChatSocket(null)
    //         console.log('Chat Socket:', chatSocket)
    //     }
    //  }, [user]);

    useEffect(() => {
        console.log(notifications)
        if (user !== null) {
            let url = `ws://127.0.0.1:8000/ws/socket_apps/${user?.username}/`
            const chatSocket = new WebSocket(url)
            setChatSocket(chatSocket)
            getUnreadNotifications()
            console.log('Chat Socket:', chatSocket)
        } else {
            console.log('Chat Socket:', chatSocket)
            setChatSocket(null)
            console.log('Chat Socket:', chatSocket)
        }
     }, []);
    // chatSocket.onopen = (event) => {
    //     chatSocket.send(JSON.stringify({'data': 'Hello World'}));
    // };
    

    if(chatSocket !== null) {
        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
            let newNotification = data.message
            console.log(newNotification)
            setNotifications((prevNotifications) => [...prevNotifications, newNotification])
            console.log(notifications)
            console.log(newNotification)
            //ack message
            // chatSocket.send(JSON.stringify({ 'status': 'received', 'id': newNotification.id }));
        }
    }
    
    console.log(notifications)
    return (
        <SocketContext.Provider value={ {chatSocket, notifications, setNotifications} }>
            {children}
        </SocketContext.Provider>
    )
}
    
export default SocketContext;
export { SocketProvider };

