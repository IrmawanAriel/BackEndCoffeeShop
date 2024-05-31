// export const getPostgres;
import { Request, Response } from 'express';

import { createProduct, getAllProduct, GetOneProduct, UpdateProduct, deleteProduct, getTotalProduct, getProdImg } from '../repositories/product';
import { productBody, productQuerry, productImg } from '../models/product';
import { IProductRes } from '../models/response';
import getLink from '../helpers/getLink';


export const getProduct = async (req: Request<{},{},{},productQuerry>, res: Response<IProductRes>)=>{
    try {
        const result = await getAllProduct(req.query);
        console.log(result.rows[0])
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}

        //mendaptkan total product
        const TotdataProduct = await getTotalProduct(req.query);

        //mendapatkan value page untuk di oper ke response
        const page = parseInt(req.query.page) || 1;

        //mendapatkan jumlah total product 
        const totalData = parseInt(TotdataProduct.rows[0].total_product);

        //mendapatkan data total page
        const totalPage = Math.ceil( totalData/ (parseInt(req.query.limit || '3') )) ; // assign default limit 3 karna error "limit possible to undefined"
        return res.status(200).json({
            msg: "sucses",
            data: result.rows,
            meta: {
                totalData,
                totalPage,
                page,
                prevLink: page > 1 ? getLink(req, "previous") : null,
                nextLink: page != totalPage ? getLink(req, "next") : null,   
            }
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

export const getDetailProduct = async (req: Request<{nama_produk: string}> , res: Response<IProductRes>) => {
    try {
        const result = await GetOneProduct(req.params.nama_produk);
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

export const createNewProduct = async (req: Request<{},{}, productBody>, res: Response<IProductRes>) => {
    
    const { file } = req;
    // console.log(req.body);
    if (!file)
        return res.status(400).json({
        msg: "file tidak ada",
        err: "masukan file berjenis JPG dsb",
        });
    try {
        const result = await createProduct(req.body, file.filename);
        return res.status(201).json({
        msg: "success",
        data: result.rows,
        });
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

export const UpdateOneProduct = async (req: Request<{id: number},{}, productBody>, res: Response<IProductRes>) => {
    try {
        const id = req.params.id;
        const result = await UpdateProduct(id, req.body);
        return res.status(200).json({
            msg: 'upadate succed',
            data: result.rows
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

export const deleteProductrow = async (req: Request<{id : number}>, res: Response<IProductRes>)=> {
    try{
        const id = req.params.id;
        const result = await deleteProduct(id);
        return res.status(200).json({
            msg : "delete succes",
            data: result.rows
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

export const UploadProductImg = async (req: Request<{id: string}>, res: Response<IProductRes> ) =>{
    try {
        const { file } = req;
        const id = parseInt(req.params.id);
        const result = await getProdImg( id, file?.filename);
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