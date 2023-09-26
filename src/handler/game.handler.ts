import express, { Request, Response } from "express";

import validateSchema from '../middleware/validateSchema';
import { createGameSchema, makeMoveSchema, getGameByIdSchema, getGameByUsernameSchema, getGamesSchema } from '../schema/game.schema';
import { createGame, getAllGames, getGameById, getGamesByUsername, updateGame } from '../service/game.service'

import { deserializeUser } from "../middleware/deserializeUser";
import { getUserById } from "../service/auth.service";

const gamesRouter = express.Router();
//gamesRouter.use(deserializeUser);
// return all the games
gamesRouter.get("/", async (req: Request, res: Response) => {
    try {
        const result = await getAllGames();
        return res.status(200).send(
            result.map(g => ({
                _id: g._id,
                playerOne: g.playerOne,
                playerTwo: g.playerTwo,
                firstPlayer: g.firstPlayer,
                winner: g.winner,
                boardsize: g.boardSize,
                moveList: g.movelist,
                username: g.username
            })
            )
        );
    } catch (err) {
        return res.status(500).send(err);
    }
})

gamesRouter.get("/game/:gameid", validateSchema(getGameByIdSchema), async (req: Request, res: Response) => {
    try {
        const userdata = await getUserById(req.userId);
        if (!userdata) return res.sendStatus(500);
        const username = userdata.username;
        const game = await getGameById(req.params.gameid);
        console.log(username)
        if (!game) return res.sendStatus(404);
        if (game.username !== username) return res.sendStatus(404);
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
        const result = await createGame(input);
        console.log(result)
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send(err)
    }
})

// for making a move
gamesRouter.put("/:gameid/:move", validateSchema(makeMoveSchema), async (req: Request, res: Response) => {
    const gameid = req.params.gameid;
    const move = parseInt(req.params.move);

    const game = await getGameById(gameid);

    console.log(game);
    if (!game) return res.sendStatus(404);
    if (!game.boardSize) { game.boardSize = 5; }
    const boardModel = game.boardModel;
    // now we check if this move caused victory
    const row = Math.floor(move / game.boardSize)
    const col = move % game.boardSize
    if (boardModel[row][col] === 0) {
        boardModel[row][col] = game.currentPlayer == 1 ? 1 : 2;
    }

    if (game.winner) return res.status(200).send({ "error": "move could not be added." })

    game.movelist.push(move);

    const currentPlayer = game.currentPlayer
    // row-based
    console.log(boardModel);
    for (let offset = 4; offset >= 0; offset--) {
        if (col - offset < 0 || col + 5 - offset > game.boardSize) {
            continue
        }
        const slice = boardModel[row].slice(col - offset, col - offset + 5)
        if (slice.every((v) => v === currentPlayer)) {
            game.finished = true
            game.winner = game.currentPlayer == 1 ? game.playerOne : game.playerTwo
            // save winning locations
            game.winList = Array.from({ length: 5 }).map(
                (_, idx) => { return (row * game.boardSize) + col - offset + idx }
            )
        }
    }
    // col-based
    for (let offset = 4; offset >= 0; offset--) {
        if (row - offset < 0 || row + 5 - offset > game.boardSize) {
            continue
        }
        const slice = Array.from({ length: 5 }).map(
            (_, idx) => { return boardModel[row - offset + idx][col] }
        )
        if (slice.every((v) => v === currentPlayer)) {
            game.finished = true
            game.winner = game.currentPlayer == 1 ? game.playerOne : game.playerTwo
            // save winning locations
            game.winList = Array.from({ length: 5 }).map(
                (_, idx) => { return ((row - offset) * game.boardSize) + (idx * game.boardSize) + (col) })
        }
    }

    // diagonal-based top-bottom
    for (let offset = 4; offset >= 0; offset--) {
        if (row - offset < 0 || row + 5 - offset > game.boardSize
            || col - offset < 0 || col + 5 - offset > game.boardSize) {
            continue
        }
        //top-bottom diagonal
        let slice = Array.from({ length: 5 }).map(
            (_, idx) => { return boardModel[row - offset + idx][col - offset + idx] }
        )
        if (slice.every((v) => v === currentPlayer)) {
            game.finished = true
            game.winner = game.currentPlayer == 1 ? game.playerOne : game.playerTwo
            // save winning locations
            game.winList = Array.from({ length: 5 }).map(
                (_, idx) => { return ((row - offset) * game.boardSize) + (idx * game.boardSize) + (col) })
        }
    }

    // diagonal-based bottom-top
    for (let offset = 4; offset >= 0; offset--) {
        if (row - 4 + offset < 0 || row + offset >= game.boardSize
            || col - offset < 0 || col - offset + 5 > game.boardSize) {
            continue
        }
        //bottom-top diagonal
        let slice = Array.from({ length: 5 }).map(
            (_, idx) => { return boardModel[row + offset - idx][col - offset + idx] }
        )
        if (slice.every((v) => v === currentPlayer)) {
            game.finished = true
            game.winner = game.currentPlayer == 1 ? game.playerOne : game.playerTwo
            // save winning locations
            game.winList = Array.from({ length: 5 }).map(
                (_, idx) => { return ((row - offset) * game.boardSize) + (idx * game.boardSize) + (col) })
        }
    }

    // update whose turn it is and update the game result
    if (game.finished) {
        game.currentPlayer = 0;
    } else {
        console.log("swapping players")
        console.log(game.currentPlayer)
        if (game.currentPlayer == 1) {
            console.log("1 to 2")
            game.currentPlayer = 2
        } else {
            game.currentPlayer = 1;
        }
    }

    // check if the game over due to all the tiles being placed
    if (!game.completed && game.movelist.length === game.boardSize * game.boardSize) {
        game.completed = true
        game.winner = "Draw";
    }

    // update database with move and state
    const result = await updateGame(gameid, game);
    console.log(result)
    if (result) return res.status(200).send(game);
    return res.sendStatus(500);
})

export default gamesRouter;

