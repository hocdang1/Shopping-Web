    import {z} from "zod";
    import { formatNumberWithDecimal } from "../utils";
import { PAYMENT_METHODS } from ".";

   const currency = z.coerce.number().refine(
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

    export const signInFormSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    export const signUpFormSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm Password is required and must be at least 6 characters"),
    })
    
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

    export const cartItemSchema = z.object({
        productId: z.string().min(1, "Product is required"),
        name: z.string().min(1, "Name is required"),
        slug: z.string().min(1, "Slug is required"),
        qty: z.number().int().nonnegative("Quantity must be a positive number"),
        image: z.string().min(1, "Image URL is required"),
        price: currency
    });

    export const insertCartSchema = z.object({
        items: z.array(cartItemSchema),
        itemsPrice: currency,
        totalPrice: currency,
        shippingPrice: currency,
        taxPrice: currency,
        sessionCartId: z.string().min(1, "Session Cart ID is required"),
        userId: z.string().optional().nullable(), 

        
    });

    export const shippingAddressSchema = z.object({
        fullName: z.string().min(3,"Name must be at least 3 characters"),
        streetAddress: z.string().min(3,"Address must be at least 3 characters"),
        city: z.string().min(3,"City must be at least 3 characters"),
        postalCode: z.string().min(3,"Postal Code must be at least 3 characters"),
        country: z.string().min(3,"Country must be at least 3 characters"),
        lat:z.number().optional(),
        lng:z.number().optional(),
    })

    //schema for payment method
    export const paymentMethodSchema = z.object ({
        type: z.string().min(1,'Payment method is required'),

    }).refine((data) => PAYMENT_METHODS.includes(data.type),{
        path: ['type'],
        message: 'Invalid payment method',
    });
// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

    

