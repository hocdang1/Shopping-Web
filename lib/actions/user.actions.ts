'use server';

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
} from "@/lib/constants/validators";
import { auth, signIn, signOut } from "@/auth";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { ShippingAddress } from "@/types";
import z from "zod";

// ------------------- SIGN IN -------------------
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // callbackUrl từ hidden input trong form
    const callbackUrl = (formData.get("callbackUrl") as string) || "/";

    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirectTo: callbackUrl,
    });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

// ------------------- SIGN OUT -------------------
export async function signOutUser() {
  await signOut();
}

// ------------------- SIGN UP -------------------
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Hash password
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    // Tạo user + 1 giỏ hàng trống
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        Carts: {
          create: {
            items: [], // đảm bảo không null
            itemsPrice: 0,
            totalPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
          },
        },
      },
    });

    // callbackUrl từ hidden input trong form
    const callbackUrl = (formData.get("callbackUrl") as string) || "/";

    // Auto sign in ngay sau khi đăng ký
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
      redirectTo: callbackUrl,
    });

    return { success: true, message: "Signed up successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// ------------------- GET USER BY ID -------------------
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// ------------------- UPDATE USER ADDRESS -------------------
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ------------------- UPDATE USER PAYMENT METHOD -------------------
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ------------------- GET ORDER BY ID -------------------
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return convertToPlainObject(data);
}
