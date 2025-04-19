const GroupModel = require("../models/GroupChatModel");
const UserGroupModel = require("../models/userGoups");
const ChatsModel = require("../models/ChatsModel");
exports.fetchGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const userGroups = await UserGroupModel.find({ userId }).populate(
      "groupId"
    );
    // .populate("userId");
    if (!userGroups) {
      return res.status(404).json({ message: "No groups found" });
    }
    return res
      .status(200)
      .json({ message: "Groups fetched successfully", data: userGroups });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching groups" });
  }
};
exports.createGroupChat = async (req, res) => {
  try {
    const { userId, groupName, groupDescription, projectId } = req.body;
    const group = await GroupModel.create({
      name: groupName,
      description: groupDescription,
      projectId,
      admin: userId,
    });
    if (!group) {
      return res.status(400).json({ message: "Group creation failed" });
    }
    const userGroup = await UserGroupModel.create({
      userId,
      groupId: group._id,
      role: "admin",
    });
    if (!userGroup) {
      return res.status(400).json({ message: "User group creation failed" });
    }
    return res.status(200).json({
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating group" });
  }
};

exports.updateGroupChat = async (req, res) => {
  try {
    const { groupId, groupName, groupDescription, password, userId } = req.body;

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId, admin: userId },
      {
        $set: {
          ...(groupName && { name: groupName }),
          ...(groupDescription && { description: groupDescription }),
          ...(password && { groupPassword: password }),
        },
      },
      { new: true }
    );

    if (!updatedGroup) {
      return res
        .status(404)
        .json({ message: "Group not found or unauthorized" });
    }

    res.json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    console.error("Error updating group:", error);
    res
      .status(500)
      .json({ message: "Internal server error while updating group" });
  }
};

exports.fetchChat = async (req, res) => {
  try {
    const { groupId } = req.params;
    const chats = await ChatsModel.find({ groupId })
      .populate("sender")
      .sort({ createdAt: -1 });
    if (!chats) {
      return res.status(404).json({ message: "No chats found" });
    }
    return res
      .status(200)
      .json({ message: "Chats fetched successfully", data: chats });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error while fetching chat" });
  }
};

exports.fetchGroupMembers=async(req,res)=>{
  try {
    const {groupId}=req.params;
    const groupMembers=await UserGroupModel.find({groupId}).populate("userId");
    if(!groupMembers){
      return res.status(404).json({message:"No group members found"});
    }
    return res.status(200).json({message:"Group members fetched successfully",data:groupMembers});

  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error while fetching group members"});
  }
}