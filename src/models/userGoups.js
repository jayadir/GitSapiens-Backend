const mongoose= require("mongoose");
const User= require("./UserModel");
const GroupChat= require("./GroupChatModel");
const UserGroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupChat",
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
    },
}, { timestamps: true });
module.exports = mongoose.model("UserGroup", UserGroupSchema);