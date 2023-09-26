import 'dotenv/config'
import connect from './connectDB'

import UserModel from "../model/user.model";
import users from "../data/users.json";

import GameModel from "../model/game.model";
import games from "../data/games.json";

const run = async () => {
    try {
        await connect();

        await UserModel.deleteMany();
        await UserModel.create(users);

        await GameModel.deleteMany();
        await GameModel.create(games);

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

run()