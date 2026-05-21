import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: profilePicture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Create new user
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture,
      });
    }
    
    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const devBypassAuth = async (req, res, next) => {
  try {
    const { provider } = req.body || {};
    let email = 'guest@example.com';
    let name = 'Guest User';
    let profilePicture = 'https://api.dicebear.com/7.x/bottts/svg?seed=guest';
    let googleId = 'guest-bypass-id-12345';

    if (provider === 'google') {
      email = 'google.user@gmail.com';
      name = 'Google User';
      profilePicture = 'https://api.dicebear.com/7.x/adventurer/svg?seed=google';
      googleId = 'google-mock-id-12345';
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture,
      });
    }
    
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};
