import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ['GET', 'POST'],
        credentials: true
    }
})


const userSocketMap = new Map();

io.on("connection", (socket)=>{
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) {
        userSocketMap.set(userId, socket.id)
    }
    emitOnlineUsers()
    socket.on("disconnect", ()=>{
        console.log("A user disconnected", socket.id);
        if(userId){
            userSocketMap.delete(userId)
        }
    
        emitOnlineUsers()
    })
})

function emitOnlineUsers() {
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
}

export function getReceiverSocketId(userId){
    return userSocketMap.get(userId)
}

export { io, server, app}

