import { z } from "zod";

export function validatePartial<T>(
  data: Partial<T>,
  schema: z.ZodObject,
): string | null {
  const keys = Object.keys(data) as (keyof z.infer<typeof schema>)[];

  if (keys.length === 0) {
    return null;
  }

  const partialSchema = schema.pick(
    keys.reduce((acc, key) => ({ ...acc, [key]: true }), {}) as Record<
      keyof z.infer<typeof schema>,
      true
    >,
  );

  const result = partialSchema.safeParse(data);
  if (!result.success) {
    return result.error.issues[0].message;
  }

  return null;
}
