import { model } from "mongoose";
import {userSchema} from "../schema/user.schema";

//typescript(bonus)
//schema (create table)
//model ~ class with CRUD methods

const User = model('User',userSchema);

export { User };

