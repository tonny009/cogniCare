import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";

const createPatient= catchAsync(async(req:Request,res:Response)=>{
    //console.log(req.body);
    const result = await UserService.createPatient(req);

    console.log(req.body)
    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Patient created successfully",
        data: result
    })
}
)

export const UserController = {
    createPatient
}

//http://localhost:3000/api/v1/user/create-patient