import express, { NextFunction,Response, Request } from "express";
import { UserController } from "./user.controller";
import { file } from "zod";
import { fileUploader } from "../../helper/fileuploader";
import { UserValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// nhere we set safeguard before necessary routes, so that only authorized users can access those routes, we can also set role based access control by passing the roles as arguments to the auth middleware

router.get(
    "/", 
    auth(UserRole.ADMIN),
    UserController.getAllFromDB
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
    //auth(UserRole.ADMIN), // only admin can create another admin
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createAdmin(req, res, next) // parsing the stringified data and validating it
    },
)

router.post(
    "/create-doctor",
    auth(UserRole.ADMIN), // only admin can create a doctor
    fileUploader.upload.single("file"), // for single file upload with field name "profileImage"
    (req: Request, res: Response, next: NextFunction) => {
        req.body= UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createDoctor(req, res, next) // parsing the stringified data and validating it
    },
)

export const userRoutes= router;