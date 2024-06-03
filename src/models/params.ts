import { payloadInterface } from "./payload";
import { ParamsIProduct, productQuerry } from "./product";
import { IProductRes } from "./response";
import { UsersParam, usersQuery } from "./users";
import { ParamsDictionary } from 'express-serve-static-core';


export type AppParams = UsersParam | ParamsDictionary | payloadInterface | ParamsIProduct | IProductRes ;
export type queryParams = productQuerry | usersQuery ;