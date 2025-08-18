"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../constants/validators";
import { CartItem } from "@/types";
import { prisma } from "@/db/prisma";
// create order and create the order items

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not auther");
    const cart = await getMyCart();

    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
   
    if (!user.paymentMethod) {
      return {
        success: false,
        message: " No payment method",
        redirectTo: "/payment-method",
      };
    }
     const shippingAddress =
  user.address && typeof user.address === "object"
    ? user.address
    : null;

if (!shippingAddress) {
  return {
    success: false,
    message: "No shipping address",
    redirectTo: "/shipping-address",
  };
}

const order = insertOrderSchema.parse({
  userId: user.id,
  shippingAddress,
  paymentMethod: user.paymentMethod,
  itemsPrice: cart.itemsPrice,
  shippingPrice: cart.shippingPrice,
  taxPrice: cart.taxPrice,
  totalPrice: cart.totalPrice,
  
});
    //Create a transaction to create order and order itemsin database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error("Order not created");
    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  }  catch (error) {
  console.error("Create order error:", error);
  if (isRedirectError(error)) throw error;
  return { success: false, message: formatError(error) };
}
}

//Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
      user: true,
    },
  });

  // alias OrderItem -> orderItems để dễ dùng trong UI
  return convertToPlainObject({
    ...data,
    orderItems: data?.OrderItem ?? [],
  });
}