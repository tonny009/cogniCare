
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";


const createPatient = async (payload: createPatientInput)=> {
    //console.log("payload:", payload)

    /*if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadResult?.secure_url
    }*/

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                address: payload.address,
            }
            
        })
    })

    return result;

}

export const UserService = {
    createPatient
}