import mongoose from "mongoose";
import chalk from "chalk";

export const connect = async () => {
    const host = process.env.DATABASE_HOST;
    const port = process.env.DATABASE_PORT;
    const database = process.env.DATABASE_NAME;
    const user = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;

    const connectionString = `mongodb://${user}:${password}@${host}:${port}/${database}`;
    await mongoose.connect(connectionString);

    //TODO: await initDB();

    console.log(chalk.bgRed.green("Database Connected"));
}

