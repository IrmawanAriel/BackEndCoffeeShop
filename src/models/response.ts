import { productBody, productImg } from "./product";
import { promoBody } from "./promo";
import { usersGet } from "./users";

interface IPaginationMeta {
    totalData?: number;
    totalPage?: number;
    page: number;
    prevLink: string | null;
    nextLink: string | null;
  }
  
  interface IBasicResponse {
    msg: string;
    data?: any[];
    err?: string;
    meta?: IPaginationMeta;
  }

  export interface IProductRes extends IBasicResponse {
    data? : productBody[] | productImg[] ;
  }

  export interface IPromoRes extends IBasicResponse {
    data? : promoBody[];
  }

  export interface IUsersRes extends IBasicResponse {
    data? : usersGet[];
  }