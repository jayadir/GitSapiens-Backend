const mongoose = require("mongoose");
const User = require("./UserModel");
const GroupChatSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // password: {
    //     type: String,
    //     required: true,
    // },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
},{timestamps: true});

module.exports = mongoose.model("GroupChat", GroupChatSchema);