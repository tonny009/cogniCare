import express, { NextFunction,Response, Request } from "express";
import { UserController } from "./user.controller";
import { file } from "zod";
import { fileUploader } from "../../helper/fileuploader";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get(
    "/", UserController.getAllFromDB
) // for testing purpose, to get all the users from the database, we will remove this later

router.post(
    "/create-patient",
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createPatient(req, res, next) // parsing the stringified data and validating it
    },
)

router.post(
    "/create-admin",
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createAdmin(req, res, next) // parsing the stringified data and validating it
    },
)

router.post(
    "/create-doctor",
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createDoctor(req, res, next) // parsing the stringified data and validating it
    },
)

export const userRoutes= router;