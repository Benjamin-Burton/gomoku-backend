// imports express but also the TYPES
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { request } from 'http';

import userRouter from './router/user.router';
import gamesRouter from './router/game.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json()); // enables JSON data from the body
app.use('/users', userRouter);
app.use('/games', gamesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`[server running at http://localhost:${port}`);
})