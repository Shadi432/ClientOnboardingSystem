import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import z from "zod";
import jwt, { Secret } from "jsonwebtoken";
import cors from "cors";
import { UserValidator, User } from "./types";
import bcrypt from "bcryptjs";



dotenv.config();
const app: Express = express();

const stringCoercer = z.coerce.string();
const PORT = stringCoercer.parse(process.env.PORT);

app.use(express.json());

app.use(cors());

function generateAccessToken(){

}

function generateRefreshToken(){

}

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

app.post("/", async (req: Request, res: Response) => {

    if (req.body.ExtraInfo && req.body.ExtraInfo == "CorrectData.txt"){
        res.send(true)
    }  else {
        // To simulate processing time
        await sleep(4000);
        res.send(false);
    }
});


app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:${3000}`);
});
