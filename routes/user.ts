import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) =>{
    console.log(req.body);
});