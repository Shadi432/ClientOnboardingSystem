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

app.get("/", (req: Request, res: Response) => {

    console.log(req.body);

    res.send("Express + TypeScript Server");
});


app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:${3000}`);
});
