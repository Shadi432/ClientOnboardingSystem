import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import z from "zod";
import cors from "cors";
import axios from "axios";

const companyNumber = "01002769";

dotenv.config();
const app: Express = express();

const stringCoercer = z.coerce.string();
const PORT = stringCoercer.parse(process.env.PORT);
const AUTH_STR = stringCoercer.parse(process.env.AUTHSTR);

app.use(express.json());

app.use(cors());

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

app.post("/", async (req: Request, res: Response) => {
    if (req.body.ExtraInfo && req.body.ExtraInfo == "CorrectData.txt"){
        res.send(true)
    }  else {
        // To simulate processing time
        await sleep(4000);
        res.send(true);
    }
});

app.get("/", async (req: Request, res: Response) => {
    console.log("Check");
    if (req.query.companyName == "Mcdo"){
        await axios.get(`https://api.company-information.service.gov.uk/company/${companyNumber}`,{
            headers: {
            "Authorization": `Basic ${AUTH_STR}`,
            }})
        .then((response) => res.send(true))
        .catch((err) => console.log(err))
        .finally(() => console.log("Finished company check"));
    } else {
        res.send(false);
    }
})

app.listen(3000, () => {
    console.log(`[server]: Server is running at http://localhost:${3000}`);
});
