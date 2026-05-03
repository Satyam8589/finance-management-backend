import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import prisma from '../lib/prisma.js';

const authenticate = asyncHandler(async (req, res, next) => {
    
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized: No token provided.', 401));
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Unauthorized: Access token expired. Please refresh your token.', 401));
    }
    return next(new AppError('Unauthorized: Invalid token.', 401));
  }

  const currentUser = await prisma.user.findFirst({
    where: { 
      id: decoded.id,
      status: 'active'
    }
  });

  if (!currentUser) {
    return next(new AppError('Unauthorized: User no longer exists or is inactive.', 401));
  }

  req.user = currentUser;
  next();
});

export default authenticate;
