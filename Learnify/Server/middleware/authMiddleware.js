// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });

// export const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    
//     if (!token) {
//         return res.status(403).json({ error: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach decoded user info to request object
//         next();
//     } catch (err) {
//         return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }
// };
 