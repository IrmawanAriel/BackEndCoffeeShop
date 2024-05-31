import { Request, Response, response } from 'express';
import { promoBody, promoQuery } from '../models/promo';
import { CreatePromo, deletePromo, getAllPromoData, UpdateOnePromo } from '../repositories/promo'; 
import { IPromoRes } from '../models/response';

export const getPromo = async (req: Request<{},{},{},promoQuery>, res: Response<IPromoRes>) => {
    try{
        const { voucher } = req.query;
        const result = await getAllPromoData(voucher);
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

export const CreateNewPromo = async (req: Request<{},{},promoBody>, res: Response<IPromoRes>) => {
    try{
        const body = req.body;
        const result = await CreatePromo(body);
        return res.status(201).json({
            msg: 'succes created',
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
};

export const UpdatePromo = async (req: Request<{id: number},{},promoBody>, res: Response<IPromoRes>) => {
    try{
        const body = req.body;
        const id = req.params.id;
        const result = await UpdateOnePromo(body, id);
        return res.status(201).json({
            msg: 'succes created',
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
};

export const deleteOnePromo = async (req: Request<{id: number}>, res: Response<IPromoRes>) => {
    
    try{
        const id = req.params.id;
        const result = await deletePromo(id);
        return res.status(200).json({
            msg: " delete sucses",
            data: result.rows
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