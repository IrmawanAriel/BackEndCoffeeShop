import { product } from './product';
export interface promoBody {
    id: number;
    exp_date : Date;
    discount : number;
    voucher : string;
    activate : boolean;
    product_name?: string[];
}
export interface promoQuery {
    voucher? : string;
}