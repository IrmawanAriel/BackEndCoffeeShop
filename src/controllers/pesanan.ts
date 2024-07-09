import { Request, Response } from 'express';
import { pesananModel, deletePesanan } from '../models/pesanan';
import { GetPesanan, UpdatePesanan, createNewPesanan, deletDataPesanan, getTotalPesanan } from '../repositories/Pesanan';
import getLink from '../helpers/getLink';

export const GetPesananData = async (req: Request<{id: number},{},{},pesananModel>, res: Response) => {
    
    try{
        const { id } = req.params
        const { page, limit } = req.query;
        // console.log(page, limit, id)
        const result = await GetPesanan( id, parseInt(page), parseInt(limit));
        if(result.rows.length === 0 ) {
            return res.status(404).json({
            msg: 'data tak ditemukan',
            data: [],
        })}
        
         //mendaptkan total pesanan
         const TotdataPesanan = await getTotalPesanan( id);

         //mendapatkan value page untuk di oper ke response
         const pageOrder = parseInt(page) || 1;
 
         //mendapatkan jumlah total pesanan 
         const totalData = parseInt(TotdataPesanan.rows[0].total_order);
 
         //mendapatkan data total page
         const totalPage = Math.ceil( totalData/ (parseInt(req.query.limit || '3') )) ; // assign default limit 3 karna error "limit possible to undefined"
         return res.status(200).json({
             msg: "sucses",
             data: result.rows,
             meta: {
                 totalData,
                 totalPage,
                 page,
                 prevLink: pageOrder > 1 ? getLink(req, "previous") : null,
                 nextLink: pageOrder != totalPage ? getLink(req, "next") : null,   
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

export const createPesanan = async (req: Request<{},{},pesananModel>, res: Response) => {
    try {
        const body = req.body;
        const result =  await createNewPesanan(body);
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

export const updateOnePesanan = async (req: Request<{id: number},{},pesananModel>, res: Response) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const result =  await UpdatePesanan(body, id );
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

export const deleteOnePesanan = async (req: Request<{id: deletePesanan}>, res: Response) => {
    try{
        const id = req.params.id;
        const result = await deletDataPesanan(id);
        return res.status(200).json({
            msg: "delete sucses",
            pesan: result.rows
        });
    } catch (err: unknown){
        if (err instanceof Error){
            console.log(err.message);
        }
        return res.status(500).json({
            msg: "error",
            err: `internal  server error`
        })
    }
} 

export const GetPesananDataByUser = async (req: Request<{id: number}>, res: Response) => {
    
    try {
        const {id} = req.params;
        const result = await getDataPesananByUser(id);
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