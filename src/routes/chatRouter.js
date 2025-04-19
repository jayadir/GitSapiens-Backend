const chatController= require('../controllers/GroupController');
const express = require('express');
const chatRouter = express.Router();
chatRouter.get('/fetch-groups/:userId', chatController.fetchGroups);
chatRouter.post('/create-group-chat', chatController.createGroupChat);
chatRouter.get('/fetch-chat/:groupId', chatController.fetchChat);
chatRouter.get('/fetch-group-members/:groupId', chatController.fetchGroupMembers);
module.exports=chatRouter;