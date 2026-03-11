import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

declare global {
  namespace Express {
    interface Request {
      clerkUserId?: string;
      userRole?: string;
    }
  }
}


export interface AuthRequest extends Request {
  clerkUserId?: string;
  userRole?: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  try {
    
    console.log(" AUTH MIDDLEWARE STARTED");
    console.log("Route:", req.method, req.path);
    
    const authHeader = req.headers.authorization;
    console.log("Authorization header exists:", !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(" No Bearer token");
    
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log("Token length:", token.length);

   
    try {
      console.log("Verifying JWT token...");
      const decoded = await clerkClient.verifyToken(token);
      
      console.log(" Token verified successfully");
      console.log("User ID (sub):", decoded.sub);
      
      req.clerkUserId = decoded.sub;
      console.log(" AUTH MIDDLEWARE PASSED");
    
      
      next();
    } catch (verifyError: any) {
      console.error(" Token verification failed");
      console.error("Error message:", verifyError.message);
      console.error("Error details:", verifyError);
   
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: verifyError.message,
      });
    }
  } catch (error: any) {
    console.error('AUTH MIDDLEWARE ERROR ');
    console.error('Error:', error);
    
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const protect = authMiddleware;