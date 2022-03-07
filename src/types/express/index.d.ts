/* eslint-disable no-unused-vars */
import express from 'express';
import jwt from 'jsonwebtoken';

// Attach the optional currentUser field to the Express Request object.
declare global {
  namespace Express {
    interface Request {
      currentUser?: string | jwt.JwtPayload;
    }
  }
}
