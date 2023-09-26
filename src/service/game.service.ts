import GameModel from "../model/game.model";
import mongoose from 'mongoose';
import { DocumentDefinition } from 'mongoose';
import { GameDocument } from '../model/game.model';


export async function getAllGames() {
    // .lean() strips extra db metadata
    return await GameModel.find().lean();
}

export async function getGameById(id: string) {
    // finding by object id
    return await GameModel.findById(id).lean();
}

export async function getGamesByUsername(username: string) {
    return await GameModel.find({ username }).lean();
}

export async function createGame(input: DocumentDefinition<GameDocument>) {
    const result = await GameModel.create(input)
    return result
}

export async function updateGame(id: string, game: DocumentDefinition<GameDocument>) {
    return GameModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        game,
        { new: true }
    )
}
