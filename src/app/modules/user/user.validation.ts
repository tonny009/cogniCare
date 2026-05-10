import z from "zod";
const createPatientValidationSchema = z.object({
    password: z.string(), // as password same field for all users in the schema

    // user specific fields
    patient: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        address: z.string().optional()
    })
});

export const UserValidation = {
    createPatientValidationSchema
}