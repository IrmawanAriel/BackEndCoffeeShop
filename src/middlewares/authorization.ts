import { NextFunction, Request, Response } from "express";
import { SignOptions } from "jsonwebtoken";

export const jwtOptions: SignOptions = {
    expiresIn: "6m", // token akan hangus dalam 5 menit
    issuer: <string>process.env.JWT_ISSUER,
  };

export const authorization = (req: Request , res: Response, next: NextFunction) => {
    
}