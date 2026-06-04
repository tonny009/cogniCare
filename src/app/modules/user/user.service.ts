
import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import { fileUploader } from "../../helper/fileuploader";
import { paginationHelper } from "../../helper/paginationHelper";
import { userSearchableFields } from "./user.constant";


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

const createAdmin = async (req: Request)=> {
    console.log("payload:", req.body)

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        console.log("Cloudinary upload result:", {uploadResult})
        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.admin.email,
                password: hashPassword,
                role: UserRole.ADMIN,            
            }
        });

        return await tnx.admin.create({
            data: req.body.admin
        })
    })

    return result;

}

const createDoctor = async (req: Request)=> {
    //console.log("payload:", req.body)

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        console.log("Cloudinary upload result:", {uploadResult})
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.doctor.email,
                password: hashPassword,
                role: UserRole.DOCTOR,            
            }
        });

        return await tnx.doctor.create({
            data: req.body.doctor
        })
    })
    return result;

}


const getAllFromDB = async (params:any, options:any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}
    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.user.count({
        where: whereConditions
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


export const UserService = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDB
}