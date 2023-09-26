import express, { Request, Response } from "express";

import validateSchema from '../middleware/validateSchema';
import { getGamesSchema } from '../schema/game.schema.ts';

const gamesRouter = express.Router();

gamesRouter.get("/", validateSchema(getGamesSchema), (req: Request, res: Response) => {
    res.status(200).json([
        {
            "all movies": 1
        }
    ])
})

export default gamesRouter;

