import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

import router from "./src/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(express.json());
app.use(express.urlencoded({ 
    extended: false }));

app.get("/",(req: Request, res: Response)=> {
    res.send("OK");
});

app.use(router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`server is runing on ${PORT}`);
});