import util ,{promisify} from 'util';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import AppError from '../utils/appError.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';
import Cookies from 'js-cookie';

const prisma = new PrismaClient(); 

const createPasswordResetToken =function()  {
  const resetToken = crypto.randomBytes(32).toString('hex');
  prisma.user_.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log({resetToken},prisma.user_.passwordResetToken);
  prisma.user_.passwordResetExpires = Date.now() +10 *60 *1000;
return resetToken;
};

const signToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN});
}
export const authController = {
  
    async signUp (req, res) {
        try {
          const { email, username, password, dateOfBirth,flag, subscription, Major } = req.body;
      
          if (!email || !username || !password || !dateOfBirth|| !flag || !subscription || !Major) {
            return res.status(400).json({ error: 'All fields are required' });
          }
          // Check if email is already in use
    const existingUser = await prisma.user_.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Save the user to the database

          
          const newUser = await prisma.user_.create({
            data: {
              email: req.body.email,
              username: req.body.username,
              password: hashedPassword,
              dateOfBirth: new Date(req.body.dateOfBirth), // Convert to Date object
              flag : req.body.flag,
              subscription: req.body.subscription,
              Major: req.body.Major,
              active: true,
            },
          });
          
          const token = await createAuthToken(newUser);

          res.cookie('authToken', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
          });
          //localStorage.setItem('authToken', token);
          res.status(201).json({ status:'success', token, message: 'User registered successfully', user: newUser });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }

    async function createAuthToken(newUser) {
      const token = signToken(newUser.userId);
      const updateToken = await prisma.user_.update({
        where: { userId: newUser.userId },
        data: { token: token },
      });
      return token;
    }
      },
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

    // 1) Check if email and password exist
      if (!email || !password) {
        return next(new AppError('Please provide Email and Password', 400));
        //return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const user = await prisma.user_.findUnique({
        where: {
                email ,
        },
      });    
    // 2) Check if user exists and password is correct
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: ' Unauthorized - Invalid password' });
      }
    // 3) Check if everything is ok and Generate JWT token
      const token = signToken(user.userId);
      const updateToken = await prisma.user_.update({
        where: { userId: user.userId },
        data: { token: token },
      })


      res.cookie('authToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:"None", // Adjust as needed
    });
          console.log('Token - controller:', token);

      res.setHeader('Authorization', `Bearer ${token}`);
      // localStorage is not available in Node.js, so this line is removed
      return res.status(200).json({ status: 'success', token, message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }, 
   async protect(req,res,next) {
    try {
          // 1) Getting token and check of it's there
          let token;
          if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
          ) {
            token = req.headers.authorization.split(' ')[1];
          }

          if (!token) {
            return next(
              new AppError('You are not logged in! Please log in to get access.', 401)
            );
          }

          // 2) Verification token
          const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
          console.log(decoded);
          // 3) Check if user still exists
          const currentUser = await prisma.user_.findUnique({
            where:{
              userId:decoded.id
            },
          });
          if (!currentUser) {
            return next(
              new AppError(
                'The user belonging to this token does no longer exist.',
                401
              )
            );
          }

          if (currentUser.passwordChangedAt) {
            const passwordChangedAt = new Date(currentUser.passwordChangedAt).getTime() / 1000;
            if (passwordChangedAt > decoded.iat) {
              return next(new AppError('User recently changed password! Please log in again.', 401));
            }
          }
          

          // GRANT ACCESS TO PROTECTED ROUTE
          req.user = currentUser;
          next();
          }catch{
            return res.status(401).json({ error: 'Unauthorized - You do not have permission to access this route' });
          }
  },
  async forgotpassword(req, res , next){
    const user = await prisma.user_.findUnique({
      where: { email: req.body.email },
    });
  
    if (!user) {
      return next(new AppError("There is no user with that email address.", 404));
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  console.log(resetToken);
    await prisma.user_.update({
      where: { email: req.body.email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });
  
   const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;
  
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
     await sendEmail({
       email: user.email,
       subject: "Your password reset token (valid for 10 min)",
        message,
      });
  
      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      await prisma.user_.update({
        where: { email: req.body.email },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });
  
      return next(new AppError("There was an error sending the email. Try again later!", 500));
    }
  },

  async resetPassword(req, res , next){

    //1) get user based on token
     const hashedToken = crypto
     .createHash("sha256")
     .update(req.params.token)
     .digest("hex");
    //1)get user based on token 
    const user = await prisma.user_.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: {
         gt:  new Date(),
        },
      },
    });
    // 2) check if token has not expired and there is user, see the new password 
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
  
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
    await prisma.user_.update({
      where: { userId: user.userId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    const token = signToken(user.userId);
    const updateToken = await prisma.user_.update({
      where: { userId: user.userId },
      data: { token: token },
    });

    res.cookie('authToken', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
      token
    });
  
  },
  async updatePassword(req, res, next){
    const user = await prisma.user_.findUnique({
      where: { userId: req.user.userId },
    });
  
    if (!user || !(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    if (user.isGoogleAccount) {
      return next(new AppError('Google users cannot update their password.', 400));
    }
    
  
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
    await prisma.user_.update({
      where: { userId: req.user.userId },
      data: { password: hashedPassword },
    });
  
    res.status(200).json({
      status: "success",
      user
    });
  },
  async googleLogin(req, res, next) {
    const { idToken } = req.body; // Token from client-side
  
    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Your Google client ID
      });
      const { email, name, picture, sub: googleId } = ticket.getPayload();
  
      // Check if the user already exists
      let user = await prisma.user_.findUnique({
        where: { googleId },
      });
  
      if (!user) {
        // Create a new user if they don't exist
        user = await prisma.user_.create({
          data: {
            email,
            username: name,
            googleId,
            profilePicture: picture,
            isGoogleAccount: true,
          },
        });
      }
  
      // Generate a JWT token for the user
      const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
  
      res.status(200).json({
        status: 'success',
        token,
        user,
      });
    } catch (error) {
      console.error('Google login error:', error);
      return next(new AppError('Error logging in with Google.', 500));
    }
  },
  

};

export const restrictTo = (...allowedFlags) => {
  return async (req, res, next) => {
    try {
      console.log('User flag:', req.user.flag); // Log the user's flag
      console.log('Allowed flags:', allowedFlags); // Log the allowed flags
  
      if (!allowedFlags.includes(req.user.flag)) {
        console.log('Access denied'); // Log when access is denied
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
  
      console.log('Access granted'); // Log when access is granted
      next();
    } catch (error) {
      console.error(error);
      return next(new AppError('Something went wrong!', 500));
    }
  };
  
}