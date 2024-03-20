import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        chatName: {
            type: String,
            trim: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        latestMessage: {
            type: mongoose.Schema.ObjectId,
            ref: 'Message',
        },
        groupAdmin: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

let ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
