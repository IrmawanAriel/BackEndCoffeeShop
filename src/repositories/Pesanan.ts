import { query, Request, Response } from "express";
import { GetPesananData } from "../controllers/pesanan";
import { deletePesanan, pesananModel } from "../models/pesanan";
import { QueryResult } from "pg";
import db from "../configs/pg";

export const GetPesanan = (id?: number, page?: number, limit?: number): Promise<QueryResult<pesananModel>> => {
    let query = "select * from orders";
    let values =[];
    if(id){
        query += " where id=$" + (values.length+1) ;
        values.push(`${id}`)
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) {
        query += " offset $" + (values.length + 1);
        values.push((page - 1) * limit);
    }

    console.log(page)

    return db.query(query, values);
}

export const createNewPesanan = (body: pesananModel): Promise<QueryResult<pesananModel>> => {   
    const query = "insert into orders (product_id, user_id, status, quantity, ice, takeaway, total) values ($1,$2,$3,$4,$5,$6,$7)";
    const values = [body.product_id, body.user_id, body.status , body.quantity, body.ice, body.takeaway, body.total];
    return db.query(query, values)
}

export const UpdatePesanan = (body: pesananModel, id: number): Promise<QueryResult<pesananModel>> => {
    const query = "UPDATE orders SET product_id = $1, user_id = $2, status = $3, quantity = $4, ice = $5, takeaway = $6, total = $7 WHERE id = $8 returning *";
    const values = [body.product_id, body.user_id, body.status , body.quantity, body.ice, body.takeaway, body.total, id];
    return db.query(query, values)
}

export const deletDataPesanan = (id: deletePesanan): Promise<QueryResult<pesananModel>> => {
    const query ="delete from orders where id=$1 returning id";
    const values = [id];
    return db.query(query, values)
}