import { useState, useEffect, createContext, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    let {user, authToken } = useContext(AuthContext)
    let url = `ws://127.0.0.1:8000/ws/socket_apps/${user?.username}/`
    const [chatSocket, setChatSocket] = useState()
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const chatSocket = new WebSocket(url)
        console.log('Chat Socket:', chatSocket)
        setChatSocket(chatSocket)   
     }, []);
    // chatSocket.onopen = (event) => {
    //     chatSocket.send(JSON.stringify({'data': 'Hello World'}));
    // };
    

    if(chatSocket !== undefined) {
        chatSocket.onmessage = function(e){
            let data = JSON.parse(e.data)
            console.log(notifications)
            setNotifications((prevNotifications) => [data, ...prevNotifications])
            console.log(notifications)
        }
    }
    
        
    return (
        <SocketContext.Provider value={ {notifications, setNotifications} }>
            {children}
        </SocketContext.Provider>
    )
}
    
const useSocket = () => {
    const { chatSocket, setChatSocket} = useContext(SocketContext);
        
    return {
        chatSocket,
        setChatSocket
     };
}
    
export default SocketContext;
export { SocketProvider };

