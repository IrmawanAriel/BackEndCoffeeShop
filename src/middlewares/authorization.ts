import { NextFunction, Request, Response } from "express";
import { SignOptions } from "jsonwebtoken";
import { AppParams } from "../models/params";
import jwt from "jsonwebtoken";
import { payloadInterface } from "../models/payload";

export const jwtOptions: SignOptions = {
    expiresIn: "6m", // token akan hangus dalam 5 menit
    issuer: process.env.JWT_ISSUER,
  };

export const authorization = (role?: string[]) =>  (req: Request<AppParams> , res: Response<AppParams>, next: NextFunction) => {
    const bearerToken = req.header("Authorization");
    if(!bearerToken) {
        return res.status(401).json({
          msg: "forbien",
          err: "akses tak diperbolehkan"
      });
    }

    const token = bearerToken.split(" ")[1];

    // verifikasi jwt dengan secret key aplikasi
    jwt.verify(token, <string>process.env.JWT_SECRET, jwtOptions, (err, payload) => {
      // kalo tidak valid, ditolak
      if (err) {
        return res.status(403).json({
          msg: err.message,
          err: err.name,
        });
      }
      // pengecekan role
      if (role) {
        if (!role.includes((payload as payloadInterface).role as string)) {
          return res.status(403).json({
            msg: "Forbidden",
            err: "Akses tidak diperbolehkan",
          });
        }
      }
      // kalo valid, lanjut
      // req.userPayload = payload;
      next();
    });
  };
