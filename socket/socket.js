// import {Server} from 'socket.io'
// import http from 'http';
// import express from 'express'

// const app=express()

// const server=http.createServer(app);
// const io=new Server(server,{
//     cors:{
//         origin:['http://localhost:3000'],
//         methods:['GET','POST']
//     }
// })


// export const getReceiverSocketId=(receiverId)=>{
//     return userSocketMap[receiverId]
// }


// const userSocketMap={};    //{userId:socketId}

// io.on('connection',(socket)=>{
//     console.log("A user connected",socket.id)

//     const userId=socket.handshake.query.userId
//     if(userId!="undefined") userSocketMap[userId]=socket.io

//     io.emit("getOnlineUsers",Object.keys(userSocketMap))

//     socket.on("disconnect",()=>{
//         console.log("User disconnected" , socket.id)
//         delete userSocketMap[userId]
//         io.emit("getOnlineUsers",Object.keys(userSocketMap))

//     })
// })

// export {app,io,server}






import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all methods
        allowedHeaders: ['Content-Type": "application/json'], // Allow all headers
        credentials: true // Allow cookies/auth if needed
    }
});

// Added this line to track user sockets
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    // Fixed issue: Corrected userSocketMap assignment
    if (userId !== "undefined") {
        userSocketMap[userId] = socket.id; // Change socket.io to socket.id
        console.log(`Mapped ${userId} to socket ${socket.id}`);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`Unmapped ${userId} from socket ${socket.id}`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
