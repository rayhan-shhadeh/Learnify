import express from 'express';
import { userController } from '../controllers/userController.js';
import { authController } from '../controllers/authController.js';
import '../middleware/authMiddleware.js'
import passport from 'passport';
import multer from 'multer';
const upload = multer();
export const userRouter = express.Router();

userRouter.post('/signup',upload.single('photo') ,authController.signUp);
userRouter.post('/login', authController.login);
userRouter.post('/forgot', authController.forgotpassword);//return an email to return password
userRouter.patch('/users/resetPassword/:token', authController.resetPassword);//return a token to retrive the new password
userRouter.get('/getallusers', userController.getAllUsers);


userRouter.patch('/users/updatepassword', authController.updatePassword);//return an email to return password
userRouter.patch('/users/updateme/:id', userController.updateMe);//return an email to return password
userRouter.delete('/users/deleteme', userController.deleteMe);//return an email to return password
userRouter.patch('/users/updateprofile/:id', userController.updateUserData);//return an email to return password
userRouter.get('/users/getme/:id',userController.getUserData);
userRouter.patch('/users/updateprofile', userController.updateUserData);
userRouter.patch('/users/username/:username',userController.getUserIdByUsername);

// Google Login Route
userRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
  
  // Google Callback Route
  userRouter.get('/api', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/api');  // Redirect to a logged-in page, like dashboard
    }
  );
  userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/login');
    });
  });
  