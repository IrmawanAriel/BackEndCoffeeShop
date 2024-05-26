import {Query, QueryResult} from "pg";
import db from "../configs/pg";
import { usersReq, usersGet, usersReg } from "../models/users";
import { query } from 'express';

export const getAllUsers = (fullname?: string, limit?: number | undefined, page?: number | undefined): Promise<QueryResult<usersGet>> => {
    let query = "select * from users";
    const values= [];
    if (fullname) {
        query += " where fullname ilike $1";
        values.push(`%${fullname}%`)
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) {
        query += " offset $" + (values.length + 1);
        values.push((page - 1) * limit);
    }

    return db.query(query, values);
}

export const updateOneUsers = (body: usersReq, id: number): Promise<QueryResult<usersReq>> => {
    const Query = "update users set fullname = $1, email = $2, password = $3 where id = $4 returning *";
    const values = [body.fullname, body.email, body.password, id];
    return db.query(Query, values);
}

export const createUser = (body: usersReq) : Promise<QueryResult<usersReq>> => {
    const Query = "insert into users (fullname, email, password) values ($1, $2, $3) returning *";
    const values = [body.fullname, body.email, body.password];
    return db.query(Query, values);
}

export const deleteUser = (id: number) : Promise<QueryResult<usersReq>> => {
    const Query = "delete from users where id=$1 returning id";
    const values = [id];
    return db.query(Query, values);
}

export const registerUser = (body: usersReg , hashed: string): Promise<QueryResult<usersReg>> => {
    const Query = "insert into users (fullname, email, password) values ($1, $2, $3) returning *";
    const values = [body.fullname, body.email, hashed];
    return db.query(Query, values);
}

export const loginUser = (email: string): Promise<QueryResult<{ fullname: string; password: string}>> => {
    const Query = "select fullname, password from users where email = $1";
    const values = [email];
    return db.query(Query, values);
}