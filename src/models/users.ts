export interface usersReq {
    id: number;
    fullname: string;
    email: string;
    password: string;
    address :string;
    image?: string;
}

export interface usersQuery {
    id?: number;
    fullname?: string;    
    page?: string;
    limit?: number;
}

export interface usersGetId{
    email?: number;
    image?: string;
}

export interface UsersParam{
    email: string;
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
    image?: string;
}


export interface usersLogin {
    email: string;
    password: string;
}