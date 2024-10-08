import { Request, response, Response } from 'express';
import { createUser, getAllUsers, updateOneUsers, deleteUser, registerUser, loginUser, setImgUsers, getTotalUser, getUserByIdOnly } from "../repositories/users"
import { usersQuery, usersReq, usersReg, usersLogin } from "../models/users";
import bcrypt from "bcrypt";
import Jwt from 'jsonwebtoken';
import { payloadInterface } from '../models/payload';
import { jwtOptions } from '../middlewares/authorization';
import getLink from '../helpers/getLink';
import { IUsersRes } from '../models/response';
import { cloudinaryUploader } from '../helpers/cloudinary';

export const getUsers = async (req: Request<{}, {}, {}, usersQuery>, res: Response) => {
    try {
        const { fullname, page, limit, id, uuid } = req.query;
        const result = await getAllUsers(fullname, limit, uuid, (page as string));
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            })
        }
        //mendaptkan total pesanan
        const TotdataUser = await getTotalUser(id);

        //mendapatkan value page untuk di oper ke response
        const pageUser = parseInt(page || '1');

        //mendapatkan jumlah total pesanan 
        const totalData = TotdataUser.rows[0].total_user;

        //mendapatkan data total page
        const totalPage = Math.ceil(totalData / (limit || 3)); // assign default limit 3 karna error "limit possible to undefined"
        return res.status(200).json({
            msg: "sucses",
            data: result.rows,
            meta: {
                totalData,
                totalPage,
                pageUser,
                prevLink: pageUser > 1 ? getLink(req, "previous") : null,
                nextLink: pageUser != totalPage ? getLink(req, "next") : null,
            }
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        })
    }
}

export const UserById = async (req: Request<{ id: number }, {}, usersReq>, res: Response<IUsersRes>) => {
    try {
        const id = req.params.id;
        const result = await (getUserByIdOnly(id.toString()))
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            })
        }
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "gagal mengambil user"
        })
    }

}

export const updateUsers = async (req: Request<{ id: number }, {}, usersReq>, res: Response<IUsersRes>) => {
    try {
        const { file } = req;
        const id = req.params.id;
        const body = req.body;
        const { password } = req.body;
        let hashed;

        // Check if there is no data input
        if (Object.keys(body).length === 0 && !file) {
            return res.status(400).json({
                msg: 'Tidak ada data yang diinput',
                data: [],
            });
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            hashed = await bcrypt.hash(password, salt);
        }

        const { result, error } = await cloudinaryUploader(req as any, "image", file?.filename as string);
        if (error) throw error;
        if (!result) throw new Error("Upload gagal");
        let result1 = await updateOneUsers(body, id, hashed, result.secure_url);

        if (result1.rows.length === 0) {
            return res.status(404).json({
                msg: 'Data tidak ditemukan',
                data: [],
            });
        }

        return res.status(200).json({
            msg: "Sukses",
            data: result1.rows,
        });

    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message.includes('nilai kunci ganda melanggar batasan unik')) {
                return res.status(409).json({
                    msg: "Email sudah terdaftar",
                    err: "Duplicate email",
                });
            }
            if (err.message.includes('Unexpected end of form')) {
                return res.status(400).json({
                    msg: "Terjadi kesalahan pada upload file",
                    err: "Unexpected end of form",
                });
            }
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal server error",
        });
    }
}


export const createNewUser = async (req: Request<{}, {}, usersReq>, res: Response<IUsersRes>) => {
    try {
        const body = req.body;
        const result = await createUser(body);
        if (result.rows.length === 0) {
            return res.status(404).json({
                msg: 'data tak ditemukan',
                data: [],
            })
        }
        return res.status(200).json({
            msg: "sucses",
            data: result.rows
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message.includes('nilai kunci ganda melanggar batasan unik')) {
                return res.status(409).json({
                    msg: "Email sudah terdaftar",
                    err: "Duplicate email",
                });
            }
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        })
    }

}

export const deleteOneUser = async (req: Request<{ id: number }>, res: Response<IUsersRes>) => {
    const id = req.params.id;
    try {
        const result = await deleteUser(id);
        return res.status(200).json({
            msg: "delete sucses",
            data: result.rows
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: `internal  server error`
        })
    }
}

export const register = async (req: Request<{}, {}, usersReg>, res: Response) => {
    const { password } = req.body;
    const { file } = req;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(password, salt);

        // Save to the database
        const result = await registerUser(req.body, hashed, file?.filename);

        if (result.rowCount !== 1) {
            return res.status(404).json({
                msg: 'Gagal register, isi data dengan benar',
                data: [],
            });
        }

        return res.status(200).json({
            msg: "Register sukses",
            data: "added " + result.rowCount + " data",
        });

    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message.includes('nilai kunci ganda melanggar batasan unik')) {
                return res.status(409).json({
                    msg: "Email sudah terdaftar",
                    err: "Duplicate email",
                });
            }
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal server error",
        });
    }
}


export const login = async (req: Request<{}, {}, usersLogin>, res: Response<{ msg: string; id?: number; image?: string; err?: string; data?: { token: string; }[] }>) => {
    try {
        const { email, password } = req.body;
        const checkUser = await loginUser(email);

        //error handling jika no user
        if (!checkUser.rows.length) throw new Error('No user has found.');

        //jika ditemukan usernya
        const { password: hashedPwd, fullname, role, id, image } = checkUser.rows[0];
        const checkPass = await bcrypt.compare(password, hashedPwd);

        //error handling jika no pass match
        if (!checkPass) throw new Error('login gagal');

        //jika cocok maka beri payload
        const payload: payloadInterface = {
            email,
            id,
            role,
        };

        const token = Jwt.sign(payload, <string>process.env.JWT_SECRET, jwtOptions)
        return res.status(200).json({
            msg: "selamat datang, " + fullname,
            id: id,
            image: image,
            data: [{ token }],
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

export const GetUserImg = async (req: Request<{ email: string }>, res: Response) => {
    try {
        const { file } = req;
        const result = await setImgUsers(req.params.email, file?.filename);
        return res.status(200).json({
            msg: "Gambar berhasil ditambahkan",
            data: result.rows,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (/(invalid(.)+uuid(.)+)/g.test(error.message)) {
                return res.status(401).json({
                    msg: "Error",
                    err: "User tidak ditemukan",
                });
            }
            console.log(error.message);
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    }
}