import { compareAsc,addHours,addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { IJWTPayload } from "../../types/common";


const insertIntoDB = async (payload: any) => {

    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        let startDateTime = new Date(currentDate);
        startDateTime.setHours(startHour ?? 0, startMinute ?? 0, 0, 0);

        const endDateTime = new Date(currentDate);
        endDateTime.setHours(endHour ?? 0, endMinute ?? 0, 0, 0);

        console.log("startDateTime", startDateTime, "endDateTime", endDateTime)
        

        while (startDateTime.getTime() < endDateTime.getTime()) {
    const slotStartDateTime = new Date(startDateTime);
    const slotEndDateTime = addMinutes(startDateTime, intervalTime);

    const existingSchedule =
      await prisma.schedule.findFirst({
        where: {
          startDateTime: slotStartDateTime,
          endDateTime: slotEndDateTime
        }
      });

    //console.log("existing:", existingSchedule);

    if (!existingSchedule) {
        console.log("CREATING");

        const result=await prisma.schedule.create({
            data: {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }
        });
        console.log("CREATED", result);
        schedules.push(result);

    }

    startDateTime = addMinutes(startDateTime, intervalTime);
}

        currentDate.setDate(currentDate.getDate() + 1)
    }

     return schedules;
}


//get all schedules data...........
const schedulesForDoctor = async (
    user: IJWTPayload,
    fillters: any,
    options: IOptions
    
    
) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = fillters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    
    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime //startDateTime should be greater than or equal to filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime //endDateTime should be less than or equal to filterEndDateTime
                    }
                }
            ]
        })
    }
    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    // for getting specific doctor schedule
    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: { // from doctorSchedules table -doctor field , to connect with doctor table and then email field
                email: user.email
            }
        },
        select: { // give schedules ids only
            scheduleId: true
        }
    });
//console.log("doctorScheduleIds", doctorScheduleIds); ( will give all schedule ids as objects which are assigned to doctor)


// so now I make an array of schedule ids
    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);
    

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };


}


const deleteScheduleFromDB = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
}

export const ScheduleService = {
    insertIntoDB,
    schedulesForDoctor ,
    deleteScheduleFromDB
}
