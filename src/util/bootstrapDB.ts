import 'dotenv/config'
import connect from './connectDB'

import UserModel from "../model/user.model";
import users from "../data/users.json";

const run = async () => {
    try {
        await connect();

        await UserModel.deleteMany();
        await UserModel.create(users);

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

run()