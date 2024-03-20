import consola from 'consola';

const SocketInit = (app, server) => {
    const io = require('socket.io')(server, {
        pingTimeout: 60000,
        cors: {
            origin: 'http://localhost:3000',
            // credentials: true,
        },
    });
    /* 
IO means All
Socket means Specific
*/

    io.on('connection', (socket) => {
        consola.success('Socket Connected Successfully');
        /* add All Logic here */
        socket.on('setup', (userData) => {
            socket.join(userData._id);
            socket.emit('user_connected');
        });

        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('User Joined Room:-' + room);
        });

        socket.on('new message', (newMsg) => {
            console.log('🤩 ~ socket.on ~ newMsg:', newMsg);
            let chats = newMsg.data.chat;
            if (!chats.users) return console.log('chat.users not defined');

            chats.users.forEach((user) => {
                if (user._id === newMsg.data.sender._id) return;
                socket.in(user._id).emit('message recieved', newMsg.data);
            });
        });
    });
};

export default SocketInit;
