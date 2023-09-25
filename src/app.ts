// imports express but also the TYPES
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { request } from 'http';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`[server running at https://localhost:${port}`);
})