import {ErrorRequestHandler} from "express";
import {ApplicationError} from "../error/application-error";
import {CastError, Error} from "mongoose";

export const errorHandler: ErrorRequestHandler = (e, req, res, next)=> {

    // to investigate the error
    console.log(e.constructor.name);

    // my error has a status:
    if (e instanceof ApplicationError)
        return res.status(e.status).json({message: e.message});

    // try to handle syntax error
    if (e instanceof SyntaxError)
        return res.status(400).json({message: e.message+"!", name: e.name});

    const castError = e as CastError
    if (castError) {
        return res.status(400).json({ message: "Cast Error", castError})
    }


    //JS/TS or npm installed libraries
    if (e instanceof Error) {
        return res.status(500).json({message: e.message, e, source: "other"});
    } else {
        return res.status(500).json({message: 'Something went wrong'})
    }
}