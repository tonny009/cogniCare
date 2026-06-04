import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields } from "./user.constant";

const createPatient= catchAsync(async(req:Request,res:Response)=>{
    //console.log(req.body);
    const result = await UserService.createPatient(req);
    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Patient created successfully",
        data: result
    })
}
)

const createAdmin= catchAsync(async(req:Request,res:Response)=>{
    const result = await UserService.createAdmin(req);

    console.log(req.body)
    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admin created successfully",
        data: result
    })
}
)


const createDoctor= catchAsync(async(req:Request,res:Response)=>{
    const result = await UserService.createDoctor(req);

    console.log(req.body)
    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
}
)

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting
    const filters = pick(req.query, userFilterableFields) // searching , filtering

    const result = await UserService.getAllFromDB(filters, options); // calling service function to get data from database

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrive successfully!",
        meta: result.meta,
        data: result
    })
})



export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDB
}

//http://localhost:3000/api/v1/user/create-patient