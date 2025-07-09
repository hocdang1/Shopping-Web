    import {z} from "zod";
    import { formatNumberWithDecimal } from "../utils";

   const currency = z
  .number()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
    {
      message: "Invalid currency format. Must be a number with 2 decimal places.",
    }
  );
    export const insertProductSchema = z.object({
        name: z.string().min(1, "Name is required"),
        slug: z.string().min(1, "Slug is required"),
        category: z.string().min(1, "Category is required"),
        brand: z.string().min(1, "Brand is required"),
        description: z.string().min(1, "Description is required"),
        stock: z.coerce.number(),
        images: z.array(z.string().min(1, "Image URL is required")),
        isFeatured: z.boolean(),
        banner: z.string().nullable(),
        price : currency,
    });