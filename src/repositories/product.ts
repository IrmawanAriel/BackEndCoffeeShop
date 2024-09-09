import { QueryResult } from "pg";
import db from "../configs/pg";
import { product, productBody, productImg, ProductOrderRelation, productQuerry } from '../models/product';

export const getAllProduct = ({ category, harga_max, harga_min, limit, page, product_name, promo, sort, stock }: productQuerry): Promise<QueryResult<product>> => {
    let query = `SELECT price, description, rating, image, "uuid", category, product_name, id FROM product`;
    const values = [];
    const conditions = [];

    if (promo === "true") {
        query += " INNER JOIN promo_product ON product.id = promo_product.product_id WHERE promo_product.promo_id IS NOT NULL";
    } else {
        query += " WHERE true";
    }

    if (product_name) {
        conditions.push(`product_name ILIKE $${values.length + 1}`);
        values.push(`%${product_name}%`);
    }

    if (category) {
        conditions.push(`category ILIKE $${values.length + 1}`);
        values.push(`%${category}%`);
    }

    if (stock === "tersedia") {
        conditions.push("stock != 0");
    }

    if (harga_min) {
        conditions.push(`price >= $${values.length + 1}`);
        values.push(harga_min);
    }

    if (harga_max) {
        conditions.push(`price <= $${values.length + 1}`);
        values.push(harga_max);
    }

    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }

    if (sort) {
        const [column, order] = sort.split(' ');
        if (['asc', 'desc'].includes(order.toLowerCase()) && column) {
            query += ` ORDER BY ${column} ${order}`;
        }
    }

    if (limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(limit);
    }

    if (page && limit) {
        query += ` OFFSET $${values.length + 1}`;
        values.push((parseInt(page) - 1) * parseInt(limit));
    }


    return db.query(query, values);
};


export const GetOneProduct = (id: number) => {
    const query = `SELECT product.*, promo.voucher 
                    FROM product 
                    LEFT JOIN promo_product ON product.id = promo_product.product_id 
                    LEFT JOIN promo ON promo.id = promo_product.promo_id 
                    WHERE product.id = $1`;
                    
    const values = [id]; 
    return db.query(query, values);
}


export const createProduct = (body: productBody, image?: string): Promise<QueryResult<product>> => {
    const query = `insert into product (price, description, rating, product_name, stock, category, image)
        values ($1,$2,$3,$4,$5,$6,$7)
        returning *`;
    const { price, description, rating, product_name, stock, category } = body;
    const values = [price, description, rating, product_name, stock, category, image];
    return db.query(query, values);
}

export const UpdateProduct =  (id: number, body: productBody ,image?: string): Promise<QueryResult<product>> => {
    let query = "update product set " ; 
    const { price, description, rating, product_name } = body;
    const values = [];

    if (price !== undefined &&price !== null) {
        query += `price = $${values.length + 1}, `;
        values.push(price);
    }

    if (description !== undefined && description !== null) {
        query += `description = $${values.length + 1}, `;
        values.push(description);
    }

    if (rating !== undefined && rating !== null) {
        query += `rating = $${values.length + 1}, `;
        values.push(rating);
    }

    if (product_name !== undefined && product_name !== null) {
        query += `product_name = $${values.length + 1}, `;
        values.push(product_name);
    }

        if (image) {
            query += `image = $${(values.length + 1)}, `;
            values.push(image);
        }

        query = query.slice(0, -2); //hapus koma dan spasi
        query += ` WHERE id=$${(values.length + 1)} RETURNING *`;
        values.push(id);
    
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
    // console.log(query,values)
    return db.query(query,values);
}

export const getProdImg = (id: number, image?: string): Promise<QueryResult<productImg>> => {
    const query = "update product set image = $1 where id = $2 ";
    const values = [image || null, id];
    return db.query(query, values);
}

export const makeProductOrderRelation = (body:ProductOrderRelation )  => {
    const query = 'insert into order_product ( order_id, product_id, ice, quantity, size ) values ($1,$2,$3,$4, $5) returning *';
    const values = [body.order_id , body.product_id, body.ice , body.quantity, body.size ];
    return db.query(query, values);
}

export const getProductOrderRelation = ( id: number): Promise<QueryResult<ProductOrderRelation[]>> => {
    const query = 'SELECT op.order_id, op.product_id, op.ice, op.quantity, p.product_name, p.price, p.description , p.image FROM order_product op JOIN product p ON op.product_id = p.id WHERE op.order_id = $1;'
    const values = [id];
    return db.query(query, values);
}