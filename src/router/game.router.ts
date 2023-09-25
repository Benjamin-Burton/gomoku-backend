import express, { Request, Response } from "express";

const gamesRouter = express.Router();

gamesRouter.get("/", (req: Request, res: Response) => {
    res.status(200).json([
        {
            "all movies": 1
        }
    ])
})

export default gamesRouter;

