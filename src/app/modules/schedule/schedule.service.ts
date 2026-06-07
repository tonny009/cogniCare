import { compareAsc,addHours,addMinutes, format } from "date-fns";
const insertIntoDB = async (payload: any) => {

    // Here we are defining and  creating many schedules  which admin will create at a time very easily
    // the format of each schedule should be : {Start time: 2026-10-10T10:00, End-time: 2026-10-10T10:30 }
    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {

        //creating 2026-10-10T10:00 format using date-fns
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )
    console.log("payload: ", payload);
    return payload;

}
}

export const ScheduleService = {
    insertIntoDB
}
