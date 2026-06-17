import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.DOCTOR, UserRole.DOCTOR),
    ScheduleController.schedulesForDoctor
)

router.post(
    "/",
    ScheduleController.insertIntoDB
)

router.delete(
    "/:id", //this id should be written same in controller file (req.params.id)
    ScheduleController.deleteScheduleFromDB
)
export const ScheduleRoutes = router;