// imports express but also the TYPES
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { request } from 'http';
import mongoose from 'mongoose';


import connectDB from './util/connectDB';
import userRouter from './handler/user.handler';
import gamesRouter from './handler/game.handler';

dotenv.config();

connectDB();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json()); // enables JSON data from the body
app.use('/users', userRouter);
app.use('/games', gamesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

mongoose.connection.once('connected', () => {
    console.log('Successfully connected to DB');
    app.listen(port, () => {
        console.log(`[server running at http://localhost:${port}`);
    })
})