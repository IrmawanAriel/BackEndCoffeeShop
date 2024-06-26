"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const getLink = (req, info) => {
    const { path, hostname, query, protocol } = req;
    if (!query.page) {
        query.page = "1";
    }
    const getNewPage = (page) => {
        if (info === "next")
            return parseInt(page) + 1;
        if (info === "previous")
            return parseInt(page) - 1;
        return parseInt(page);
    };
    let newQuery = Object.assign(Object.assign({}, query), { page: `${getNewPage(query.page)}` });
    const serialize = (query) => {
        const str = [];
        for (let key in query) {
            if (query.hasOwnProperty(key)) {
                str.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
            }
        }
        return str.join("&");
    };
    const url = new url_1.URL(`${protocol}://${hostname}:${process.env.PORT}${path}`);
    url.search = serialize(newQuery);
    return url.toString();
};
exports.default = getLink;
