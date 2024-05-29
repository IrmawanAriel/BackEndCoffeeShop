import { Request } from "express";

import { URL } from 'url';
import { AppParams } from "../models/params";
import { productQuerry } from "../models/product";

const getLink = (req: Request<AppParams, {}, {}, productQuerry>, info?: "previous" | "next"): string => {
  const { path, hostname, query, protocol } = req;
  const newPage = info === "next" ? parseInt(query.page) + 1 : parseInt(query.page) - 1;
  let newQuery: Record<string, string|undefined> = { ...query, page: `${newPage}` };

  const url = new URL(`${protocol}://${hostname}:${process.env.PORT}${path}`);
  Object.keys(newQuery).forEach(key => {
    if (newQuery[key]) {
      url.searchParams.append(key, newQuery[key] as string);
    }
  });

  return url.toString();
};

export default getLink;
