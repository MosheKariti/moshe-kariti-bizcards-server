import { Router } from "express";
import { ILogin, IUser } from "../db/types/db";
import { validateLogin, validateUser } from "../middleware/validateSchema";
import { userService } from "../services/userService";
import { User } from "../db/model/user.model";
import { verifyAdmin } from "../middleware/verify-admin";
import { verifyUserOrAdmin } from "../middleware/verify-userOrAdmin";

const router = Router();

// Register
router.post("/", validateUser, async (req, res, next) => {
    const body = req.body as IUser;
    try {
        const savedUser = await userService.saveUser(body);
        return res.status(200).json(savedUser);
    } catch (e) {
        //BAD Request (validation failed)
        return res.status(400).json(e);
    }
});

//Login
router.post("/login", validateLogin, async (req, res, next) => {
    try {
        const { email, password } = req.body as ILogin;
        const token = await userService.login(email, password);
        return res.status(200).json({ token });
    } catch(e) {
        next(e);
    }
});

//Get all users
router.get("/", verifyAdmin, async (req, res, next) => {

    const users = await User.find();
    res.json(users);
});

//Get user by ID
router.get("/:id", verifyUserOrAdmin, async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json( {message: `user with id: ${id} Not found`} )
        }
        res.json(user);
    } catch (e) {
        next(e)
    }

});

export default router;
