import { deletePesanan, pesananModel } from "../models/pesanan";
import { QueryResult } from "pg";
import db from "../configs/pg";

// export const GetPesanan = async (id?: number, page?: number, limit?: number): Promise<QueryResult<pesananModel>> => {
//     let query = `SELECT SUM(
//                     CASE 
//                         WHEN promo_product.promo_id IS NOT NULL THEN (product.price * (1 - promo.discount / 100)) * order_product.quantity
//                         ELSE product.price
//                     END
//                  ) as total_order 
//                  FROM orders 
//                  JOIN order_product ON orders.id = order_product.order_id 
//                  JOIN product ON order_product.product_id = product.id 
//                  LEFT JOIN promo_product ON product.id = promo_product.product_id 
//                  LEFT JOIN promo ON promo_product.promo_id = promo.id `;
//     let values = [];
//     if(id){
//         query += " WHERE orders.id = $" + (values.length+1)  ;
//         values.push(`${id}`);
//     }
//     if (limit) {
//         query += " LIMIT $" + (values.length + 1);
//         values.push(limit);
//     }
//     if (page && limit) {
//         query += " OFFSET $" + (values.length + 1);
//         values.push((page - 1) * limit);
//     }


//     const result = await db.query(query,values);

//     if(result.rows.length > 0) {
//         let total_order = Math.round(result.rows[0].total_order);

//         query = `UPDATE orders SET total = $1 WHERE id = $2`;
//         values = [total_order, id];
//         await db.query(query, values);
//     }

//     return result;
// }

export const GetPesanan = async (id?: number, page?: number, limit?: number): Promise<QueryResult<pesananModel>> => {
  let query = `
    SELECT 
      orders.id, 
      orders.takeaway,
      orders.destination, 
      orders.payment_method,  
      orders.orderdate,
      orders.fullname,  
      orders.status,
      SUM(
        CASE 
          WHEN promo_product.promo_id IS NOT NULL THEN (product.price * (1 - promo.discount / 100)) * order_product.quantity
          ELSE product.price * order_product.quantity
        END
      ) as total_order 
    FROM orders 
    JOIN order_product ON orders.id = order_product.order_id 
    JOIN product ON order_product.product_id = product.id 
    LEFT JOIN promo_product ON product.id = promo_product.product_id 
    LEFT JOIN promo ON promo_product.promo_id = promo.id 
  `;

  let values: (number | string | undefined)[] = [];
  
  if (id) {
    query += " WHERE orders.id = $" + (values.length + 1);
    values.push(id);
  }
  
  query += " GROUP BY orders.id";
  
  if (limit) {
    query += " LIMIT $" + (values.length + 1);
    values.push(limit);
  }
  
  if (page && limit) {
    query += " OFFSET $" + (values.length + 1);
    values.push((page - 1) * limit);
  }

  const result = await db.query(query, values);

  // Update the total_order in the orders table if an id is provided and there's a result
  if (id && result.rows.length > 0) {
    const total_order = Math.round(result.rows[0].total_order);
    await db.query(`UPDATE orders SET total = $1 WHERE id = $2`, [total_order, id]);
  }

  return result;
}



export const createNewPesanan = (body: pesananModel): Promise<QueryResult<pesananModel>> => {   
    const query = "insert into orders (user_id, status, takeaway, total, destination, fullname, email) values ($1,$2,$3,$4,$5,$6,$7) returning *";
    const values = [ body.user_id, body.status, body.takeaway, body.total, body.destination, body.fullname, body.email];
    return db.query(query, values)
}

export const UpdatePesanan = (body: pesananModel, id: number): Promise<QueryResult<pesananModel>> => {
    const query = "UPDATE orders SET user_id = $1, status = $2, takeaway = $3, total = $4 WHERE id = $5 returning *";
    const values = [ body.user_id, body.status , body.takeaway, body.total, id];
    return db.query(query, values)
}

export const deletDataPesanan = (id: deletePesanan): Promise<QueryResult<pesananModel>> => {
    const query ="delete from orders where id=$1 returning id";
    const values = [id];
    return db.query(query, values)
}

export const getTotalPesanan = (id?: number): Promise<QueryResult<{ total_order: string }>> => {
    let query = "select count(*) as total_order from orders";
    let values = [];
    if(id){
        query += ' where id = $1';
         values.push(`${id}`);
    }
    // console.log(query,values)
    return db.query(query,values);
}

export const getDataPesananByUser = (id: number): Promise<QueryResult<pesananModel>> => {
  const query = "select * from orders where user_id = $1";
  const values = [id];
  return db.query(query, values)
}