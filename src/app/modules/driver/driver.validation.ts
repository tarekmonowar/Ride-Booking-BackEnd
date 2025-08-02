import { z } from "zod";

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
