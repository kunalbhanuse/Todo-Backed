import { z, email } from "zod";

const registrationValidationZod = z.object({
  name: z.string().min(2, "name must be at least 2 charecters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
});

const loginValidationZod = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export { registrationValidationZod, loginValidationZod };
