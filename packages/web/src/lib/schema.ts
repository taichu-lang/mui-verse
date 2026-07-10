import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "lengthRule")
  .max(20, "lengthRule")
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: "charRule",
  })
  .refine((value) => /\d/.test(value), {
    message: "charRule",
  });

export function checkPassword(password: string): string | null {
  console.log(password);
  try {
    passwordSchema.parse(password);
    return null;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issues = err.issues;
      return issues[issues.length - 1].message;
    }

    return err as string;
  }
}
