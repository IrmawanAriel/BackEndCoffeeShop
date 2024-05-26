import { Request, Response } from 'express';
import { pesananModel, deletePesanan } from '../models/pesanan';
import { GetPesanan, UpdatePesanan, createNewPesanan, deletDataPesanan } from '../repositories/Pesanan';


export const GetPesananData = async (req: Request<{id?: number},{},{},pesananModel>, res: Response) => {
    
    try{
        const { id } = req.params;
        const { page, limit } = req.query;
        const result = await GetPesanan(id, page, limit);
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