import { PrismaClient } from '@prisma/client';
import AppError from '../utils/appError.js';
import util ,{promisify} from 'util';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();


export const userController = {
  async getAllUsers (req, res, next){
    try{
      const users = await prisma.user_.findMany();
      res.status(200).json({ 
        status:'success',
        results:users.length,
        data: users 
      });
    }catch{
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async updateMe (req, res, next) {
    // 1) Create error if user POSTs password data
    try {
      // 1) Create error if user POSTs password data
      if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
          status: 'fail',
          message: 'This route is not for password updates. Please use /api/users/updatepassword '
        });
      }

      // Add the rest of your updateMe logic here

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
 
  async deleteMe(req, res, next) {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({
          status: 'fail',
          message: 'You are not logged in! Please log in to get access.'
        });
      }
  
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded);
  
      const currentUser = await prisma.user_.findUnique({
        where: { userId: decoded.id }
      });
      console.log('Current User:', currentUser);
  
      if (!currentUser) {
        return res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token does no longer exist.'
        });
      }
      await prisma.user_.update({
        where: { userId: decoded.id },
        data: { active: false }
      });
  
      res.status(204).json({
        status: 'success',
        data: null,
        message: 'User account deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteMe:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  },
  async updateUserData(req, res, next) {
    try {
      // Format the dateOfBirth if it exists
      let updatedData = { ...req.body };
      if (updatedData.dateOfBirth) {
        updatedData.dateOfBirth = new Date(req.body.dateOfBirth);// Convert to Date object
      }
      
  
      // Update user data
      const updatedUser = await prisma.user_.update({
        where: { userId: req.user.userId },
        data: updatedData,
      });
  
      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
    } catch (err) {
      console.error("Error updating user data:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to update user data",
      });
    }
  },  
  
};

