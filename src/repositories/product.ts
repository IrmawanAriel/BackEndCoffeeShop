import { Query, QueryResult } from "pg";

import db from "../configs/pg";
import { product, productBody, productImg, productQuerry } from '../models/product';
import { query } from 'express';

export const getAllProduct = ({category,harga_max,harga_min,limit,page ,product_name,promo,sort,stock}: productQuerry): Promise<QueryResult<product>> => {
    let query = `select * from product where true`; // 1.
    const values = [];
    if (product_name) {
        query += " and product_name ilike $" + (values.length + 1);
        values.push(`%${product_name}%`)
    }
    // console.log(values.length)
    if (category) {
        query += " and category ilike $" + (values.length + 1);
        values.push(`%${category}%`)
    }
    if (stock === "tersedia") {
        query += " and stock !=0";
    }

    // if (promo === "tidak") {
    //     query += " and (promo_id is null or promo_id = 0)"; // 2. left join
    // } else {
    //     query += " and promo_id is not null and promo_id != 0"; // inner
    // }

    if (harga_min) {
        query += " and price >= $" + (values.length + 1);
        values.push(harga_min)
    }
    if (harga_max) {
        query += " and price <= $" + (values.length + 1);
        values.push(harga_max)
    }
    if (sort) { /// price asc
        const [column, order] = sort.split(' ');
        if (['asc', 'desc'].includes(order.toLowerCase()) && column) {
            query += ` order by ${column} ${order}`;
        }
    }
    if (limit) {
        query += " limit $" + (values.length + 1);
        values.push(limit);
    }
    if (page && limit) { //default val
        query += " offset $" + (values.length + 1);
        values.push((parseInt(page) - 1) * parseInt(limit));
    }

    console.log(query , values);
    return db.query(query, values);
}

export const GetOneProduct = (product_name: string) => {
    const query = "select * from product where product_name =%1";
    const values = [product_name];
    return db.query(query, values);

}

export const createProduct = (body: productBody): Promise<QueryResult<product>> => {
    const query = `insert into product (price, description, rating, product_name, stock, category)
        values ($1,$2,$3,$4,$5,$6)
        returning *`;
    const { price, description, rating, product_name, stock, category } = body;
    const values = [price, description, rating, product_name, stock, category];
    return db.query(query, values);
}


export const UpdateProduct = (id: number, body: productBody): Promise<QueryResult<product>> => {
    const query = `UPDATE product SET price = $1, description = $2, rating = $3, product_name = $4 WHERE id=$5 RETURNING *`;
    const { price, description, rating, product_name } = body;
    const values = [price, description, rating, product_name, id];
    return db.query(query, values);
}


export const deleteProduct = (id: number): Promise<QueryResult<product>> => {
    const query = "delete from product where id = $1 returning id";
    const values = [id];
    return db.query(query, values);
}

export const getTotalProduct = ({ product_name }: productQuerry): Promise<QueryResult<{ total_product: string }>> => {
    let query = "select count(*) as total_product from product";
    let values = [];
    if(product_name){
        query += ' where product_name ilike $1';
         values.push(`%${product_name}%`);
    }
    console.log(query,values)
    return db.query(query,values);
}

export const getProdImg = (id: number, image?: string): Promise<QueryResult<productImg>> => {
    const query = "update product set image = $1 where id = $2 ";
    const values = [image || null, id];
    return db.query(query, values);
}