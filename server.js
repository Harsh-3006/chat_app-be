import express from 'express';
import conn from './database/conn.js';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import { server } from './socket/socket.js';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// ✅ Apply CORS before defining routes
app.use(cors({
    origin: ['http://localhost:3000', 'https://chatapp-be-production.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);

app.get('/test', (req, res) => {
    res.status(200).json("test complete");
});

server.listen(PORT, () => {
    conn();
    console.log(`Listening on port ${PORT}`);
});
