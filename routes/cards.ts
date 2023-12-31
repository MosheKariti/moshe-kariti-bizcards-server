import { Router } from "express";
import {verifyAdmin} from "../middleware/verify-admin";
import {User} from "../db/model/user.model";
import {Card} from "../db/model/card.model";
import {verifyUser} from "../middleware/verify-user";
import jwt from "jsonwebtoken";
import {validateCard, validateUser} from "../middleware/validateSchema";
import {ICard} from "../db/types/db";
import {ApplicationError} from "../error/application-error";
import {RequestUser} from "../@types/express";
import { ObjectId } from 'mongodb';
import {verifyBusinessUser} from "../middleware/verify-business-user";
import {verifyToken} from "../middleware/verify-token";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const cards = await Card.find();
        return res.status(200).json(cards);
    } catch (e) {
        return res.status(400).json(e);
    }
});

router.get("/my-cards",  async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new ApplicationError(400, "No Auth Header");
    }
    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET ?? "";
    const requestUser = jwt.verify(token, secret) as RequestUser;
    try {
        const myCards = await Card.find({ user_id: requestUser.id });
        return res.status(200).json(myCards);
    } catch (e) {
        return res.status(400).json(e);
    }
});

router.get("/:id",  async (req, res, next) => {
    const cardId = req.params.id;
    try {
        const card = await Card.findById(cardId);
        return res.status(200).json(card);
    } catch (e) {
        return res.status(400).json(e);
    }
});

router.post("/",verifyBusinessUser, validateCard, async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new ApplicationError(400, "No Auth Header");
    }
    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET ?? "";
    const requestUser = jwt.verify(token, secret) as RequestUser;
    const body = req.body as ICard;
    body.user_id = new ObjectId(requestUser.id);
    const card = new Card(body);
    try {
        const saveCard = await card.save();
        return res.status(200).json(saveCard);
    } catch (e) {
        return res.status(400).json(e);
    }
});

router.patch("/:id",verifyToken, async (req, res, next) => {
    const user = req.user;
    const cardId = req.params.id;
    try {
        const card = await Card.findById(cardId);
        if (card && user) {
            const index = card.likes.indexOf(user.id);
            if (index != -1) {
                card.likes.splice(index, 1);
            } else {
                card.likes.push(user.id);
            }
            const saveCard = await card.save();
            return res.status(200).json(saveCard);
        }
    } catch (e) {
        return res.status(400).json(e);
    }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
    const user = req.user;
    const cardId = req.params.id;
    try {
        const card = await Card.findById(cardId);
        if (card && user) {
            if (card.user_id.toString() === user.id || user.isAdmin) {
                const deleteCard = await Card.findByIdAndDelete(card.id);
                return res.status(200).json(deleteCard);
            }
        }
    } catch (e) {
        return res.status(400).json(e);
    }
});

export default router;