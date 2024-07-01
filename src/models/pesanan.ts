export interface pesananModel {
        id?: number;
        user_id: number;
        status: number;
        quantity: number;
        ice: boolean;
        takeaway: boolean;
        total: number;
        orderdate: Date;
        page: string;
        limit: string;
        destination: string;
        payment_method: string;
}

export interface deletePesanan {
    id: number;
}