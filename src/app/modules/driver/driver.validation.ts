import { z } from "zod";

export const availabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
  }),
});
