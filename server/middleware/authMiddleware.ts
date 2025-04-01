import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseError } from 'firebase-admin/app'; 

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user info (including uid) to the request
    next(); // Token is valid, proceed to the next middleware/route handler
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);

    // Check if it's a FirebaseError and specifically an auth error
    const firebaseError = error as FirebaseError; 
    if (firebaseError.code) { // Check if code property exists
      if (firebaseError.code === 'auth/id-token-expired') {
        return res.status(401).send({ message: 'Unauthorized: Token expired.' });
      }
    }

    // Fallback for other verification errors or non-Firebase errors
    return res.status(403).send({ message: 'Forbidden: Invalid token.' });
  }
};