import { Request } from "express";

import { URL } from 'url';
import { AppParams, queryParams } from "../models/params";
import { productQuerry } from "../models/product";

const getLink = (req: Request<AppParams, {}, {}, queryParams>, info?: "previous" | "next"): string => {
  const { path, hostname, query, protocol} = req;

  if(!query.page){
    query.page = "1";
  }

  const getNewPage = (page: string): number => {
    if (info === "next") return parseInt(page) + 1;
    if (info === "previous") return parseInt(page) - 1;
    return parseInt(page);
  };

  let newQuery = { ...query, page: `${getNewPage(query.page )}` };
  const serialize = (query: queryParams): string => {
    const str = [];
    for (let key in query) {
      if ((query as Object).hasOwnProperty(key)) {
        str.push(`${encodeURIComponent(key)}=${encodeURIComponent((query as Record<string, string>)[key])}`);
      }
    }
    return str.join("&");
  };

  const url = new URL(`${protocol}://${hostname}:${process.env.PORT}${path}`);
  url.search = serialize(newQuery);

  return url.toString();
};

export default getLink;
