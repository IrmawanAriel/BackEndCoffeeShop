export interface pesananModel {
        id?: number;
        product_id: number;
        user_id: number;
        status: number;
        quantity: number;
        ice: boolean;
        takeaway: boolean;
        total: number;
        orderdate: Date;
        page?: number;
        limit?: number;
}

export interface deletePesanan {
    id: number;
}