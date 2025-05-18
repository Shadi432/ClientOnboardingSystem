import { z } from "zod";

const userTypeEnum = z.enum(["Secretary", "Manager", "Admin", "MLRO"]);
const statusEnum = z.enum(["In Progress", "Pending Review", "Completed"]);

const requiredError = {
  required_error: "This is a required field",
}

export const UserValidator = z.object({
  // UserId optional to let this work for creating users too
  UserId: z.optional(z.number().int().positive()),
  Username: z.string(requiredError)
              .min(3, { message: "Username should be at least 3 characters long"})
              .max(50, { message: "Username should be less than 50 characters long"}),
  Pass: z.string(requiredError)
          .min(5, { message: "Password should be at least 5 characters long"})
          .max(80, { message: "Password should be less than 80 characters long"}),
  Email: z.string(requiredError)
          .email({ message: "Invalid email address"})
          .max(255, { message: "Email should be less than 255 characters long"}),
  UserType: userTypeEnum,
});

export type User = z.infer<typeof UserValidator>;

export const UserAuthenticationDataValidator = z.object({
  success: z.boolean(requiredError),
  headersList: z.nullable(z.any().array()),
  user: z.nullable(UserValidator),
})

export type UserAuthenticationData = z.infer<typeof UserAuthenticationDataValidator>;

// Optional Dates aren't kept in here because I can't validate them to be undefined
export const ClientFormDataValidator = z.object({
  ClientName: z.string()
                .min(3)
                .max(150),
  Owner: z.string(),
  Status: statusEnum,
  FormState: z.object({
    ClientType:  z.enum(["Individual", "Company"]),
    Office: z.enum(["Norwich"]),
    Department: z.enum(["Business"]),
    Partner: z.string().max(50),
    Manager: z.string().max(30).or(z.string().max(0)),
    CaseWorker: z.string().max(30).or(z.string().max(0)),
    Title: z.enum(["Mr", "Mrs", "Miss", "Master", "Dr"]),
    FirstName: z.string().min(2).max(50),
    MiddleName: z.string().min(2).max(50).or(z.string().max(0)),
    LastName: z.string().min(2).max(50),
    Salutation: z.string().max(50).or(z.string().max(0)),
    Gender: z.enum(["Man", "Woman", "Non-Binary", "N/A"]),
    AddressLine1: z.string().min(5).max(100),
    AddressLine2: z.string().min(5).max(100).or(z.string().max(0)),
    Town: z.string().min(2).max(50),
    County: z.string().min(2).max(50).or(z.string().max(0)),
    Country: z.string().min(2).max(30),
    Postcode: z.string().min(4).max(20),
    DateOfBirth: z.string().datetime().or(z.date().max(new Date())),
    DOD: z.string().datetime().or(z.date().max(new Date())).or(z.string().max(0)).nullable(),
  }).partial()
}).required({ClientName: true, Owner: true, Status: true});

export type ClientFormData = z.infer<typeof ClientFormDataValidator>;