import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

import router from "./src/routes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

var corsOptions = {
    origin: ['http://localhost:8000','http://127.0.0.1:5500'],
    methods: "PUT" // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));


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