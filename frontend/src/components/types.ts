import { z } from "zod";

const userTypeEnum = z.enum(["Secretary", "Manager", "Admin", "MLRO"])

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