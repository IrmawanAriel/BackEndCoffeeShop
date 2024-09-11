import { NextFunction, Request, Response } from "express";
import { SignOptions } from "jsonwebtoken";
import { AppParams } from "../models/params";
import jwt from "jsonwebtoken";
import { payloadInterface } from "../models/payload";



export const jwtOptions: SignOptions = {
  expiresIn: "6m", // token akan hangus dalam 6 menit
  issuer: process.env.JWT_ISSUER,
};

export const authorization = (role?: string[]) => (req: Request<{id: number},AppParams>, res: Response<AppParams>, next: NextFunction) => {
  const bearerToken = req.header("Authorization");
  const idParam = req.params.id;

  if (!bearerToken) {
    return res.status(401).json({
      msg: "forbidden",
      err: "Akses tidak diperbolehkan",
    });
  }

  const token = bearerToken.split(" ")[1];

  // Verifikasi jwt dengan secret key aplikasi
  jwt.verify(token, <string>process.env.JWT_SECRET, jwtOptions, (err, payload) => {
    if (err) {
      return res.status(403).json({
        msg: err.message,
        err: err.name,
      });
    }

    const tokenDecoded = payload as payloadInterface;

    // Pengecekan role
    if (role) {
      if (!role.includes(tokenDecoded.role)) {
        return res.status(403).json({
          msg: "Forbidden",
          err: "Akses tidak diperbolehkan",
        });
      }
    }

    // Pengecekan id dari token harus sama dengan id yang diminta di params
    if(role?.includes('user')){
      if (tokenDecoded.id !== Number(idParam)) {
        return res.status(403).json({
          msg: "Forbidden",
          err: "Tidak memiliki akses untuk akun ini",
        });
      }
    }

    // Lanjutkan ke middleware berikutnya
    next();
  });
};
