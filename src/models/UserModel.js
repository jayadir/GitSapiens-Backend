const mongoose= require("mongoose");
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    providerId: { type: String },
    username: { type: String },
    bio: { type: String },
    image: { type: String },
    userProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserAndProject' }],
    skills: [{ type: String }],
})
module.exports = mongoose.model('User', schema);