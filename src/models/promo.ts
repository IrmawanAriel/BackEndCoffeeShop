export interface promoBody {
    id: number;
    exp_date : Date;
    discount : number;
    voucher : string;
    activate : boolean;
}
export interface promoQuery {
    voucher? : string;
}