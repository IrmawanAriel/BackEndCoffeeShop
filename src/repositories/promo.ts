import db from "../configs/pg";
import {Query, QueryResult} from "pg";
import { promoBody, promoQuery } from "../models/promo";
import { query } from 'express';

export const getAllPromoData = (voucher?: string): Promise<QueryResult<promoBody>> => {
    let query = "select * from promo";
    let values= [];
    if (voucher){
        query += " where voucher ilike $1";
        values.push(`%${voucher}%`)
    }
    return db.query(query,values);
}

export const CreatePromo = async (body: promoBody): Promise<QueryResult<promoBody>> => {

    const GetProductname = (product_name: string[], id: number) => {
        product_name.forEach(element => {
            const values1: string[] = []
            const query = `INSERT INTO promo_product (product_id, promo_id) VALUES ((SELECT id FROM product WHERE product_name = $1 limit 1), ${id})`
            values1.push(element)
            db.query(query,values1);
        });
    }

    let query = "insert into promo (voucher, discount, activate, exp_date) values ($1,$2,$3,$4) returning id"
    const values = [body.voucher, body.discount, body.activate, body.exp_date];
    const result = await db.query(query,values)
     
    if(body.product_name) {
        const idPromo = result.rows[0].id;
        GetProductname(body.product_name, idPromo);
    }

    return result;


    
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