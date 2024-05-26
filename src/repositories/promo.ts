import db from "../configs/pg";
import {Query, QueryResult} from "pg";
import { promoBody, promoQuery } from "../models/promo";
import { query } from "express";

export const getAllPromoData = (voucher?: string): Promise<QueryResult<promoBody>> => {
    let query = "select * from promo";
    let values= [];
    if (voucher){
        query += " where voucher ilike $1";
        values.push(`%${voucher}%`)
    }
    return db.query(query,values);
}

export const CreatePromo = (body: promoBody): Promise<QueryResult<promoBody>> => {
    let query = "insert into promo (voucher, discount, activate, exp_date) values ($1,$2,$3,$4)"
    const values = [body.voucher, body.discount, body.activate, body.exp_date];
    return db.query(query,values);
}

export const UpdateOnePromo = (body: promoBody, id: number): Promise<QueryResult<promoBody>> => {
    let query = "update promo set voucher =$1, discount =$2, activate =$3, exp_date=$4 where id=$5 RETURNING *"
    const values = [body.voucher, body.discount, body.activate, body.exp_date, id];
    return db.query(query,values);
}


export const deletePromo = (id: number): Promise<QueryResult<promoBody>> => {
    const Query = "delete from promo where id=$1 returning id";
    const values = [id];
    return db.query(Query, values);
}