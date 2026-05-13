import express, { NextFunction,Response, Request } from "express";
import { file } from "zod";
import { AuthController } from "./auth.controller";


const router = express.Router();

router.post(
    "/login",
    AuthController.login
)

export const authRoutes= router;