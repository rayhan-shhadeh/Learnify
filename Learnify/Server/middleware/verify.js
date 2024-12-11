

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export async function Verify(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header

        if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt

        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        jwt.verify(cookie,  process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                // if token has been altered or has expired, return an unauthorized error
                return res
                    .status(401)
                    .json({ message: "This session has expired. Please login" });
            }

            const { id } = decoded; // get user id from the decoded token


            const user = await prisma.user_.findUnique({
                where: { userId: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }



            req.user = data; // put the data object into req.user
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}
