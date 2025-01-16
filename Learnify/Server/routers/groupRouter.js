import express from 'express';
import { groupController } from '../controllers/groupController.js';

export const groupRouter = express.Router();

groupRouter.post('/group/newgroup', groupController.createGroup);
groupRouter.get('/getgroup/:id', groupController.getGroupById);
groupRouter.get('/groups', groupController.getAllGroups);
groupRouter.patch('/update-group/:id', groupController.updateGroup);
groupRouter.delete('/delete-group/:id', groupController.deleteGroup);
groupRouter.get('/group/:id/users', groupController.getUsersInGroup);
groupRouter.post('/group/:id/add-user', groupController.addUsersToGroup);
groupRouter.delete('/group/:id/remove-user/:userId', groupController.removeUsersFromGroup);  
groupRouter.get('/group/getgroupforuser/:id', groupController.getGroupsForUser);
groupRouter.get('/group/getgroupforadmin/:id', groupController.getGroupsByAdminId);
groupRouter.get('/group/:id/usernames', groupController.getUsernamesForUsersInGroup);
groupRouter.put('/groupnames/:id/add-users/', groupController.addUsersToGroupByUsernames);