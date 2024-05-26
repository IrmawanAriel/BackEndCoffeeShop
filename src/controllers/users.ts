import { Request, Response } from 'express';
import { createUser, getAllUsers, updateOneUsers, deleteUser, registerUser, loginUser } from "../repositories/users"
import {  usersQuery, usersReq, usersReg, usersLogin } from "../models/users";
import bcrypt from "bcrypt";
import  Jwt  from 'jsonwebtoken';
import { payloadInterface } from '../models/payload';
import { jwtOptions } from '../middlewares/authorization';

export const getUsers = async (req: Request<{},{},{},usersQuery>, res: Response)=>{
    try {
        const { fullname, page , limit } =  req.query;
        const result =await getAllUsers( fullname, limit , page );
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        })
    }
}

export const updateUsers = async(req: Request<{id: number},{},usersReq>, res: Response) =>{
    try {
        const id = req.params.id;
        const body = req.body;
        let result = await updateOneUsers(body, id);
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        })
    }
    
}

export const createNewUser = async (req: Request<{},{},usersReq>, res: Response) => {
    try{
        const body = req.body;
        const result = await createUser(body);
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        })
    }
    
}

export const deleteOneUser = async (req: Request<{id: number}>, res: Response) => {
    const id = req.params.id;
    try{
        const result = await deleteUser(id);
        return res.status(200).json({
            msg: "delete sucses",
            data: result.rows
        });
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: `internal  server error`
        })
    }
}

export const register = async (req: Request<{},{},usersReg>, res : Response) => {
    const { password } = req.body;
    try{ 
        //make hash pass
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(password, salt);

        //simpan keadalam db
        const result = await registerUser(req.body, hashed);
        return res.status(200).json({
            msg: "register sucses",
            // data: result.rows
        });
        
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: `internal  server error`
        })
    }
}

export const login = async (req: Request<{}, {}, usersLogin>, res: Response<{msg: string; err?: string; data?: {token: string}[]}>) => {
    try{
        const {email, password} = req.body;
        const checkUser = await loginUser(email);

        //error handling jika no user
        if(!checkUser.rows.length) throw new Error ('No user has found.');

        //jika ditemukan usernya
        const {password: hashedPwd, fullname } = checkUser.rows[0];
        const checkPass = await bcrypt.compare( password , hashedPwd );

        //error handling jika no pass match
        if(!checkPass) throw new Error ('login gagal');
        
        //jika cocok maka beri payload
        const payload: payloadInterface = {
            email
        };

        const token = Jwt.sign( payload, <string>process.env.JWT_SECRET, jwtOptions )
        return res.status(200).json({
            msg: "selamat datang, " + fullname,
            data: [{ token }]
        });

    } catch (error) {
        if (error instanceof Error) {
            if (/(invalid(.)+uuid(.)+)/g.test(error.message)) {
                return res.status(401).json({
                    msg: "Error",
                    err: "Siswa tidak ditemukan",
                });
            }
            
            return res.status(401).json({
                msg: "Error",
                err: error.message,
            });
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
}