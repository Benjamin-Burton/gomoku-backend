import express, { Request, Response } from "express";

import validateSchema from '../middleware/validateSchema';
import { createGameSchema, makeMoveSchema, getGameByIdSchema, getGameByUsernameSchema, getGamesSchema } from '../schema/game.schema';

import { createGame, getAllGames, getGameById, getGamesByUsername, updateGame } from '../service/game.service'

import { deserializeUser } from "../middleware/deserializeUser";

const gamesRouter = express.Router();
gamesRouter.use(deserializeUser);
// return all the games
gamesRouter.get("/", validateSchema(getGamesSchema), async (req: Request, res: Response) => {
    const userId = req.userId;
    console.log(userId);
    try {
        const result = await getAllGames();
        return res.status(200).send(
            result.map(g => ({
                _id: g._id,
                playerOne: g.playerOne
            })
            )
        );
    } catch (err) {
        return res.status(500).send(err);
    }
})

gamesRouter.get("/game/:gameid", validateSchema(getGameByIdSchema), async (req: Request, res: Response) => {
    try {
        console.log(req.params.gameid)
        const game = await getGameById(req.params.gameid);
        console.log(game);
        if (!game) return res.sendStatus(404);
        return res.status(200).send(game);
    } catch (err) {
        return res.status(500).send(err);
    }
})

gamesRouter.get("/user/:username", validateSchema(getGameByUsernameSchema), async (req: Request, res: Response) => {
    console.log("username");
    try {
        const username = req.params.username;
        console.log(username)
        const result = await getGamesByUsername(username)
        if (!result) return res.sendStatus(404);
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send(err);
    }
})

// for creating a game
gamesRouter.post("/", validateSchema(createGameSchema), async (req: Request, res: Response) => {
    try {
        const game = req.body
        console.log(req.body)
        const input = {
            ...req.body,
        }
        const result = createGame(input);
        return res.status(200).send({ "test": "test" })
    } catch (err) {
        return res.status(500).send(err)
    }
})

// for making a move
gamesRouter.put("/:gameid/:move", validateSchema(makeMoveSchema), async (req: Request, res: Response) => {
    try {
        const gameid = req.params.gameid;
        const move = parseInt(req.params.move);

        let game = await getGameById(gameid);
        console.log(game);
        if (!game) return res.sendStatus(404);
        if (game.winner) return res.status(200).send({ "error": "move could not be added." })
        game.movelist.push(move);
        const result = await updateGame(gameid, game);
        if (result) return res.status(200).send(game);
        return res.sendStatus(500);

    } catch (err) {
        res.status(500).send(err);
    }
})

export default gamesRouter;

