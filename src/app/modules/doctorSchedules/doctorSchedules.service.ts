import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";

// I put IJWTPayload in a common file to access users from several place easily

const insertIntoDB = async (user: IJWTPayload, payload: {
    scheduleIds: string[]
}) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });
}

export const DoctorScheduleService = {
    insertIntoDB
}