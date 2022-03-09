import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * This middleware checks the JWT access token on the cookie and attaches
 * the currentUser field to the Express request object.
 *
 * @remarks
 * Express validator JWT escape should be run before this middleware.
 * Although the 'res' argument is never used, Express uses
 * the order of arguments, and since we need 'next' we therefore
 * need 'res'.
 *
 * @param req  - Modified Express request object with currentUser field.
 * @param res  - Express response object.
 * @param next - Express next object.
 * @returns - next(). It calls the next middleware having now authorized.
 *
 */
export const checkAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userJwt = req.cookies.access_token;
  if (!userJwt) {
    return next();
  }
  try {
    const payload = jwt.verify(userJwt, process.env.JWT_KEY as string);
    req.currentUser = payload;
    return next();
  } catch {
    return next();
  }
};
