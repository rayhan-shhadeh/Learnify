import dotenv from 'dotenv';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Use your Client ID from Google Developer Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Use your Client Secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL,  // The URL where Google will redirect after login
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your database
        let user = await prisma.user_.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Create a new user if they don't exist
          user = await prisma.user_.create({
            data: {
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
            },
          });
        }

        // You can use 'done' to pass the user object to the next step
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user information into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user information from session
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user_.findUnique({
    where: { userId: id },
  });
  done(null, user);
});
