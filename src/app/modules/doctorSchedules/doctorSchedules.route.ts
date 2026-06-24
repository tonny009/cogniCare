import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedules.controller";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;