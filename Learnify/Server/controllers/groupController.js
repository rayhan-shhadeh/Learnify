import express from 'express';
import {groupService}from '../services/groupService.js';
export const groupController = {
    async createGroup(req, res) {
        try {
            const newGroup = await groupService.createGroup(req.body);
            res.status(201).json({
                status: 'success',
                data: newGroup,
            });
        }
        catch (error) {
            console.error('Error in createGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    ,
    async getGroupById(req, res) {
        try {
            const group = await groupService.getGroupById(req.params.id);
            if (!group) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.status(200).json({
                status: 'success',
                data: group,
            });
        }
        catch (error) {
            console.error('Error in getGroupById:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    ,
    async getAllGroups(req, res) {
        try {
            const groups = await groupService.getAllGroups();
            res.status(200).json({
                status: 'success',
                data: groups,
            });
        }
        catch (error) {
            console.error('Error in getAllGroups:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }

    ,
    async updateGroup(req, res) {
        try {
            const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
            if (!updatedGroup) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.status(200).json({
                status: 'success',
                data: updatedGroup,
            });
        }
        catch (error) {
            console.error('Error in updateGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    ,
    async deleteGroup(req, res) {
        try {
            const deletedGroup = await groupService.deleteGroup(req.params.id);
            if (!deletedGroup) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.message = 'Group deleted';
            res.status(200).json({
                status: 'success',
                data: deletedGroup,
            });


        }
        catch (error) {
            console.error('Error in deleteGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    },
    async getUsersInGroup(req, res) {
        try {
            const group = await groupService.getUsersInGroup(req.params.id);
            if (!group) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.status(200).json({
                status: 'success',
                data: group.users,
            });
        }
        catch (error) {
            console.error('Error in getUsersInGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    ,
    async addUsersToGroup(req, res) {
        try {
            if (!Array.isArray(req.body.userIds)) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'userIds must be an array',
                });
            }

            const group = await groupService.addUsersToGroup(req.params.id, req.body.userIds);
            if (!group) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.status(200).json({
                status: 'success',
                data: group,
            });
        }
        catch (error) {
            console.error('Error in addUsersToGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    ,
    async removeUsersFromGroup(req, res) {
        try {
            const group = await groupService.removeUsersFromGroup(req.params.id, req.params.userId);
            if (!group) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Group not found',
                });
            }
            res.status(200).json({
                status: 'success',
                data: group,
            });
        }
        catch (error) {
            console.error('Error in removeUsersFromGroup:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    },
    async getGroupsForUser(req, res) {
        try {
            const groups = await groupService.getGroupsForUser(req.params.id);
            res.status(200).json({
                status: 'success',
                data: groups,
            });
        }
        catch (error) {
            console.error('Error in getGroupsForUser:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    },
    async getGroupsByAdminId(req, res) {
        try {
            const groups = await groupService.getGroupsByAdminId(req.params.id);
            res.status(200).json({
                status: 'success',
                data: groups,
            });
        }
        catch (error) {
            console.error('Error in getGroupsByAdminId:', error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    

};

