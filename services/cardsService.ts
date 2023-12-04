import {User} from "../db/model/user.model";
import {ApplicationError} from "../error/application-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {ICard, IUser} from "../db/types/db";

const saveCard = async (cardData: ICard) => {
    const card = new User(cardData);
    card.password = await bcrypt.hash(card.password, 12);
    return card.save();
}
export const cardsService = {  }