export interface usersReq {
    id: number;
    fullname: string;
    email: string;
    password: string;
    address :string;
}

export interface usersQuery {
    fullname?: string;    
    page?: number;
    limit?: number;
}

export interface usersDelete{
    id?: number;
}

export interface usersGet {
    id: number;
    fullname: string;
    email: string;
    address :string;
}

export interface usersReg {
    email: string;
    password: string;
    fullname: string;
}


export interface usersLogin {
    email: string;
    password: string;
}