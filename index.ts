import express from 'express';
import { config } from "dotenv";
import { connect } from "./db/utils/connection";
import chalk from "chalk";
import { logger } from "./middleware/logger";
config();
connect();
const app = express();

app.use(express.json());
app.use(logger);

const PORT = process.env.EXPRESS_PORT;

app.listen(PORT,() => {
    console.log(chalk.blue(`App is running on http://localhost:${PORT}`));
})