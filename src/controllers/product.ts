// export const getPostgres;
import { Request, Response } from 'express';

import { createProduct, getAllProduct, GetOneProduct, UpdateProduct, deleteProduct } from '../repositories/product';
import { productBody, productdeletQuerry, productQuerry } from '../models/product';


export const getProduct = async (req: Request<{},{},{},productQuerry>, res: Response)=>{
    try {
        const result = await getAllProduct(req.query);
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

export const getDetailProduct = async (req: Request<{product_name: string}> , res: Response) => {
    const product_name = req.params.product_name;
    try {
        const result = await GetOneProduct(product_name);
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        return res.status(200).json({
            msg: 'succes',
            data: result.rows
        })
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

export const createNewProduct = async (req: Request<{},{}, productBody>, res: Response) => {
    
    try{
        const result = await createProduct(req.body);
        return res.status(201).json({
            msg: 'succes created',
            data: result
        }) 
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
};

export const UpdateOneProduct = async (req: Request<{id: number},{}, productBody>, res: Response) => {
    try {
        const id = req.params.id;
        const result = await UpdateProduct(id, req.body);
        return res.status(201).json({
            msg: 'upadate succed',
            data: result
        }) 
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
}

export const deleteProductrow = async (req: Request<{id : number}>, res: Response)=> {
    try{
        const id = req.params.id;
        const result = await deleteProduct(id);
        return res.status(200).json({
            msg : "delete succes",
            data: id
        })
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
}

