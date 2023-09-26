import mongoose, { Document } from "mongoose";

export interface GameDocument extends Document {
    playerOne: string;
    playerTwo: string;
    winner: string;
    completed: boolean;
    firstPlayer: number; // 1 or 2
    movelist: [number];
    boardSize: number;
    username: string; // nameof the user who created this game
}

const gameSchema = new mongoose.Schema({
    playerOne: { type: String, require: true },
    playerTwo: { type: String, require: true },
    winner: { type: String, require: false },
    completed: { type: Boolean, require: true },
    firstPlayer: { type: Number, require: true },
    movelist: { type: [Number], require: true },
    boardSize: { type: Number, require: true },
    username: { type: String, require: true }
})

export default mongoose.model<GameDocument>('Game', gameSchema)