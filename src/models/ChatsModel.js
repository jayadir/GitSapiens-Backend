const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupChat",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
},{ timestamps: true });
module.exports = mongoose.model("Chat", chatSchema);