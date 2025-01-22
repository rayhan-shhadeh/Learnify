import { PrismaClient } from '@prisma/client';
import AppError from '../utils/appError.js';
import util ,{promisify} from 'util';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService.js';

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
  try {
    // 1) Check if user is trying to update password
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Update user document
    const updatedUser = await userService.updateMe(req.params.id, req.body);

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error in updateMe:', error);
    next(new AppError('Failed to update user data', 500));
  }
},
 
  async updateMe (req, res, next) {
    try {
      if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
          status: 'fail',
          message: 'This route is not for password updates. Please use /api/users/updatepassword '
        });

      }
      } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
   async updatePremiumStatus(req,res) {
    try {
      const { flag } = req.body;
      const updatedUser = await prisma.user_.update({
        where: { userId: parseInt(req.params.id, 10) }, 
        data: { flag },
      });
      console.log(`User premium status updated successfully to ${flag===1 ? 'Premium' : 'Non-Premium'}`);
      res.status(200).json({
        status: 'success',
        data: updatedUser,
        message: `User premium status updated successfully to ${flag===1 ? 'Premium' : 'Non-Premium'}`,
      });
    } catch (error) {
      console.error('Error updating premium status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update premium status',
      });
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
        where: { userId: parseInt(req.params.id)},
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
  async getUserData(req, res, next) {
    try {
      const user = await userService.getUserData(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
      
      res.status(200).json({
        status: "success",
        data: user,
      });
    }
    catch (err) {
      console.error("Error getting user data:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to get user data",
      });
    }
  },
  // get user Id based on username
  async getUserIdByUsername(req, res, next) {
    try {
      const userId = await userService.getUserIdByUsername(req.body.username);
      if (!userId) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: userId,
      });
    }
    catch (err) {
      console.error("Error getting user data:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to get user data",
      });
    }
  },
  
};