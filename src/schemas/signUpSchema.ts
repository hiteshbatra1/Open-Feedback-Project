import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 chracters")
  .max(20, "Username must be not more that 20 chracters")
  .regex(
    /^[a-z0-9]+$/,
    "Username must contain only lowercase letters and numbers",
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please provide valid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
