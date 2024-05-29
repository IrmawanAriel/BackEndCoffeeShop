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
    id?: number;
    description: string;
    price: number;
    product_name?: string;
    rating: number;
    stock: number;
    category: string;

}

export interface productImg {
    id?: number;
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