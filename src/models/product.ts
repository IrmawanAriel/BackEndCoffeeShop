import { ParamsDictionary } from 'express-serve-static-core';
export interface product {
    id: number;
    description: string;
    price: number;
    product_name: string;
    rating: number;
    stock: number;
    category: string;

}

export interface productBody {
    id: number;
    description: string;
    price: number;
    product_name?: string;
    rating: number;
    stock: number;
    category: string;
    json: string[];
    voucher?: string
}

export interface ParamsIProduct {
    id: number
}

export interface productImg {
    id?: number;
    image? : string;
}

export interface productQuerry {
    product_name?: string;
    category?: string;
    promo?: string;
    harga_min?: string;
    harga_max?: string;
    sort?: string;
    stock?: string;
    page: string;
    limit?: string;

}

export interface ProductOrderRelation {
    order_id: number;
    product_id: number;
    quantity: number;
    ice: boolean;
    size: string;
}