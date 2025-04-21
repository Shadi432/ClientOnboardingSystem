import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import z from "zod";
import jwt, { Secret } from "jsonwebtoken";
import cors from "cors";
import { UserValidator, User } from "./types";
import { GetUserFromDB } from "./database";
import bcrypt from "bcryptjs";



dotenv.config();
const app: Express = express();

const stringCoercer = z.coerce.string();
const PORT = stringCoercer.parse(process.env.PORT);
const ACCESS_TOKEN_SECRET: Secret = stringCoercer.parse(process.env.ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET: Secret = stringCoercer.parse(process.env.REFRESH_TOKEN_SECRET);

console.log(process.env.PORT);

app.use(express.json());

app.use(cors());

function generateAccessToken(){

}

function generateRefreshToken(){

}

async function LoginUser(username: string, password: string, res: Response) {
    const user = await GetUserFromDB(username);

    if (user == null){
        // Return error response
        console.log("User was not found!");
        res.sendStatus(400);
        return;
    }

    try {
        if (await bcrypt.compare(password, user.Pass)) {
            // Correct password, authenticate the user!

            const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
            const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "5m" });
            console.log("Correct pass")

            const cookie1 = res.cookie("accessToken", "test", { httpOnly: true });
            const cookie2 = res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: true});
            console.log(cookie1);
            res.sendStatus(200)
            return
        }
        // Incorrect password
        console.log("Password provided was incorrect");
        res.sendStatus(400);
    } catch (err) {
        console.log(`Errors whilst logging in: ${err}`);
        res.sendStatus(400);
    }

    // Response: 2 set cookie headers alongside a 400 if successful, get other codes too.
    res.sendStatus(200);
}

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

// 
app.post("/login", (req: Request, res: Response) => {
    // Validate the data

    // What if user doesn't exist?
    LoginUser(req.body.username, req.body.password, res);
    
});

app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:${3000}`);
});
