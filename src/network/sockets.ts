import { serverDisconnectedTimeOut } from '../store/system/actions';
import { TIMEOUT_DISCONNECT } from '../store/system/messages';
import { Socket } from 'socket.io';

interface LastMessage {
    user: string;
    id: number;
    message: string;
    timestamp: number;
}
export const userJoinedChat = (socket: Socket, setAllChats) => {
    socket.on('user has joined', (user) => {
        setAllChats((prev) => [...prev, { joinedUser: user }]);
    });
};

export const userLeftChatMessage = (socket: Socket, setAllChats) => {
    socket.on('user has left', (user) => {
        setAllChats((prev) => [...prev, { leftUser: user }]);
    });
};

export const userInactivityDisconnect = (socket: Socket, dispatch) => {
    socket.on('user disconnected due to inactivity', (user) => {
        dispatch(
            serverDisconnectedTimeOut({
                loggedIn: false,
                userName: '',
                serverDown: false,
                errorMessage: TIMEOUT_DISCONNECT,
            }),
        );
    });
};

export const receiveMessages = (socket: Socket, setAllChats) => {
    socket.on('receive messages', (event) => {
        const newMessages = JSON.parse(event);
        setAllChats((prev) => [...prev, newMessages]);
    });
};

export const sendMessages = async (
    socket: Socket,
    lastMessage: LastMessage,
    setAllChats: React.Dispatch<React.SetStateAction<any[]>>,
): Promise<void> => {
    socket.emit('send messages', JSON.stringify(lastMessage));
    setAllChats((prev) => [...prev, lastMessage]);
};

export const userLeavingEmitAction = (socket: Socket, currUser: string) => socket.emit('user has left', currUser);

export const userHasDisconnectedAction = (socket: Socket, currUser: string) => socket.emit('disconnect', currUser);

export const sendUserName = (socket: Socket, userName: string): void => socket.emit('send-username', userName);

export const checkUserName = (socket: Socket, userName: string): void => socket.emit('check-username', userName);
