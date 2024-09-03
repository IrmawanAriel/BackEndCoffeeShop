import { Request, Response } from 'express';
import { createProduct, getAllProduct, GetOneProduct, UpdateProduct, deleteProduct, getTotalProduct, getProdImg, makeProductOrderRelation, getProductOrderRelation } from '../repositories/product';
import { productBody, ProductOrderRelation, productQuerry } from '../models/product';
import { IProductRes } from '../models/response';
import getLink from '../helpers/getLink';
import { cloudinaryUploader } from '../helpers/cloudinary';

export const getProduct = async (req: Request<{},{},{},productQuerry>, res: Response<IProductRes>)=>{
    try {
        const result = await getAllProduct(req.query);
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}

        const TotdataProduct = await getTotalProduct(req.query);

        const page = parseInt(req.query.page) || 1;

        const totalData = parseInt(TotdataProduct.rows[0].total_product);

        const totalPage = Math.ceil( totalData/ (parseInt(req.query.limit || '3') )) ; 
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

export const getDetailProduct = async (req: Request<{id: number}> , res: Response<IProductRes>) => {
    try {
        const result = await GetOneProduct(req.params.id);
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
    const Name_product = req.body.product_name
    if (!file)
        return res.status(400).json({
        msg: "file tidak ada",
        err: "masukan file berjenis JPG dsb",
        });
    try {
        const { result, error } = await cloudinaryUploader(req, "image", Name_product as string);
        if (error) throw error;
        if (!result) throw new Error("Upload gagal");
        console.log(result.secure_url)
        const resultDb = await createProduct(req.body, result.secure_url);
        return res.status(201).json({
        msg: "success",
        data: resultDb.rows,
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
    const { file } = req;
    const Name_product = req.body.product_name
    const id = req.params.id;
    if (!file)
        return res.status(400).json({
        msg: "file tidak ada",
        err: "masukan file berjenis JPG dsb",
        });
    try {
        const { result, error } = await cloudinaryUploader(req as any, "image", Name_product as string);
        if (error) throw error;
        if (!result) throw new Error("Upload gagal");
        const resultDB = await UpdateProduct(id , req.body, result.secure_url);

        if(resultDB.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        return res.status(200).json({
            msg: 'upadate succed',
            data: resultDB.rows
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

export const createOrderRelation = async (req: Request<{},{},ProductOrderRelation> , res: Response) => {
    try{
        const result = await makeProductOrderRelation( req.body )
        return res.status(200).json({
            msg: 'insert succed',
            data: result.rows
        }) 
    }catch(err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
}

export const getOrderRelation = async (req: Request< {idOrder: number} > , res: Response) => {

    const {idOrder} = req.params;
    try {
        const result = await getProductOrderRelation( idOrder );
        return res.status(200).json({
            msg: 'get succed',
            data: result
        }) 
    } 
    catch (error: unknown) {
        if (error instanceof Error){
            console.log(error.message);
        }
        return res.status(500).json({
            msg: "error",
            err: "internal server error"
        });
    }
}