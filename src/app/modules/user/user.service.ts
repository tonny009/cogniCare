
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import { fileUploader } from "../../helper/fileuploader";


const createPatient = async (req: Request)=> {
    //console.log("payload:", payload)

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        console.log("Cloudinary upload result:", {uploadResult})
        req.body.patient.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result;

}

export const UserService = {
    createPatient
}