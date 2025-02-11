import express from 'express'
import  conn  from './database/conn.js'
import dotenv from 'dotenv'
import authRoutes from './Routes/authRoutes.js' 
import messageRoutes from './Routes/messageRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket.js'
// import cors from 'cors'
// app.use(cors())
// const app=express()

dotenv.config()
const PORT=process.env.PORT
app.use(express.json())
app.use(cookieParser())
console.log(process.env.PORT)

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/user',userRoutes)


// app.get('/',(req,res)=>{
//     res.send("hello")
// })



server.listen(PORT,()=>{
    conn()
    console.log(`listening to port ${PORT}`)
})
