import express, { NextFunction,Response, Request } from "express";
import { UserController } from "./user.controller";
import { file } from "zod";
import { fileUploader } from "../../helper/fileuploader";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
    "/create-patient",
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createPatient(req, res, next) // parsing the stringified data and validating it
    },
    UserController.createPatient
)

export const userRoutes= router;