import { Server } from "socket.io";

const registerChatHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('🟢 User connected:', socket.id);

        socket.on('joinRoom', ({ poolId, userId }) => {
            socket.join(poolId);
            console.log(`${userId} joined room: ${poolId}`);
        });

        socket.on("typing", ({ poolId, user }) => {
            socket.to(poolId).emit("typing", { user });
          });
        
          socket.on("stopTyping", ({ poolId, user }) => {
            socket.to(poolId).emit("stopTyping", { user });
          });

        socket.on('sendMessage', ({ poolId, message, sender }) => {
            const msgPayload = {
                sender,
                message,
                timestamp: new Date(),
            };

            io.to(poolId).emit('receiveMessage', msgPayload);
        });

        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};


export { registerChatHandlers };