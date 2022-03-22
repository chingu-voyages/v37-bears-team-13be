import { cookie } from 'express-validator';

// This validator aims to prevent unusually large cookies
// from being passed to the app, and also aims to sanitize
// cookies that may contain scripts from malicious users.
export const cookieJWTCheck = [
  cookie('access_token')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .isJWT()
    .escape(),
];
