// import express from "express";
// import protectroute from '../Middleware/protectRoute.js'
// import Conversation from '../Model/conversationSchema.js'
// import Message from '../Model/messageSchema.js'
// import { getReceiverSocketId,io } from "../socket/socket.js";

// const router = express.Router()

// router.post("/send/:id", protectroute, async (req, res) => {
//     try {
//         const { message } = req.body
//         const { id: receiverID } = req.params;
//         // console.log(req.user._id)
//         const senderID = req.user._id

//         let conversation = await Conversation.findOne({
//             participant: { $all: [senderID, receiverID] }
//         })

//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participant: [senderID, receiverID],
//             })
//         }
//         const newMessage = await new Message({
//             senderID,
//             receiverID,
//             message
//         })
//         // console.log(conversation)

//         if (newMessage) {
//             await conversation.message.push(newMessage._id)
//         }
//         // socket io 
//         // await conversation.save();
//         // await newMessage.save()

//         // this will work in parallel
//         await Promise.all([conversation.save(), newMessage.save()])

//         // socketIo functionality
//         const receiverSocketId=getReceiverSocketId(receiverID)
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("newMessage",newMessage)
//         }
//         res.status(201).json(newMessage)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: "Internal server error" })
//     }
// })

// router.get('/:id', protectroute, async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params;
//         const senderID = req.user._id
//         const conversation = await Conversation.findOne({
//             participant: { $all: [senderID, userToChatId] }
//         }).populate("message")

//         if (!conversation) {
//             return res.status(200).json([])
//         }
//         return res.status(201).json(conversation.message)
//     } catch (error) {
//         console.log(error)
//     }

// })

// export default router





import express from "express";
import protectRoute from '../Middleware/protectRoute.js';
import Conversation from '../Model/conversationSchema.js';
import Message from '../Model/messageSchema.js';
// Ensure you import the `io` instance
import { getReceiverSocketId } from "../socket/socket.js"; 
import { io } from "../socket/socket.js"; // Added this line to import io

const router = express.Router();

router.post("/send/:id", protectRoute, async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;

        let conversation = await Conversation.findOne({
            participant: { $all: [senderID, receiverID] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participant: [senderID, receiverID],
            });
        }

        const newMessage = new Message({
            senderID,
            receiverID,
            message
        });

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }

        // Ensure conversation and message are saved correctly
        await Promise.all([conversation.save(), newMessage.save()]);

        // socketIo functionality
        const receiverSocketId = getReceiverSocketId(receiverID);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', protectRoute, async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderID = req.user._id;
        const conversation = await Conversation.findOne({
            participant: { $all: [senderID, userToChatId] }
        }).populate("message");

        if (!conversation) {
            return res.status(200).json([]);
        }
        return res.status(201).json(conversation.message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
