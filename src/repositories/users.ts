import {Query, QueryResult} from "pg";
import db from "../configs/pg";
import { usersReq, usersReg, usersGetId, UsersParam, usersGetUuid } from "../models/users";

export const getAllUsers = (fullname?: string, limit?: number | undefined, uuid? : string ,page?: string | undefined): Promise<QueryResult<usersGetUuid>> => {
    let query = "select fullname, email, uuid , address from users";
    const values= [];
    if (uuid) {
        query += ` where uuid = $${values.length + 1}`;
        values.push(uuid)
    }
    if (fullname) {
        query += ` where fullname ilike $${values.length + 1}`;
        values.push(`%${fullname}%`)
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) {
        query += " offset $" + (values.length + 1);
        values.push((parseInt(page) - 1) * limit);
    }

    return db.query(query, values);
}

export const getUserByIdOnly = (id : string ): Promise<QueryResult<usersGetUuid>> => {
    let query = "select fullname, email, image , address, phone from users where id =$1  ";
    const values= [id];
    return db.query(query, values);
}

export const updateOneUsers = (body: usersReq, id: number, hashed?: string, image?: string): Promise<QueryResult<usersReq>> => {
    const { fullname, email, address, phone } = body
    let query = "update users set ";
    const values = [];

    if (fullname) {
        query += `fullname = $${values.length + 1}, `;
        values.push(fullname);
    }

    if (email) {
        query += `email = $${values.length + 1}, `;
        values.push(email);
    }

    if (address) {
        query += `address = $${values.length + 1}, `;
        values.push(address);
    }

    if (phone) {
        query += `phone = $${values.length + 1}, `;
        values.push(phone);
    }

    if (hashed) {
        query += `password = $${values.length + 1}, `;
        values.push(hashed);
    }

    if (image) {
        query += `image = $${values.length + 1}, `
        values.push(image);
    }

    query = query.slice(0,-2);
    query += ` where id = ${id} returning *`;
    return db.query(query, values);

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

export const registerUser = (body: usersReg , hashed: string, image?: string): Promise<QueryResult<usersReg>> => {

    let Query = "insert into users (fullname, email, password" + (image ? ", image" : "") + ") values ($1, $2, $3" + (image ? ", $4" : "") + ")";
    const values = [body.fullname, body.email, hashed];
    if(image) values.push(image);
    return db.query(Query, values);
}

export const loginUser = (email: string): Promise<QueryResult<{id: number, fullname: string; password: string; role: string; image: string; uuid: string}>> => {
    const Query = "select fullname, uuid, id , password, role, image from users where email = $1";
    const values = [email];
    
    return db.query(Query, values);
}

export const setImgUsers = (email: string, image?: string): Promise<QueryResult<usersGetId>>  => {
    const query = 'update users set image = $1 where email = $2 returning email, image'
    const values = [image || null, email];
    return db.query(query, values);
}

export const getTotalUser = (id?: number): Promise<QueryResult<{ total_user: number }>> => {
    let query = "select count(*) as total_user from users";
    let values = [];
    if(id){
        query += ' where id = $1';
         values.push(`${id}`);
    }
    return db.query(query,values);
}