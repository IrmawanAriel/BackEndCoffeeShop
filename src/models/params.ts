import { payloadInterface } from "./payload";
import { productQuerry } from "./product";
import { UsersParam } from "./users";
import { ParamsDictionary } from 'express-serve-static-core';


export type AppParams = UsersParam | ParamsDictionary | payloadInterface;
export type queryParams = productQuerry;