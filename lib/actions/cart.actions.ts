        'use server'
        import {CartItem} from"@/types";
        import {cookies} from"next/headers";
        import { convertToPlainObject, formatError, round2 } from "../utils";
        import { auth } from "@/auth";
        import { cartItemSchema, insertCartSchema } from "../constants/validators";
        import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

        const calcPrice = (items: CartItem[]) => {
            const itemsPrice = round2(
                items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
                ),
                shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
                taxPrice = round2(itemsPrice * 0.15),
                totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
            return {
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                taxPrice: taxPrice.toFixed(2),
                totalPrice: totalPrice.toFixed(2),  
            };
        };  
        export async function addItemToCart(data: CartItem) {
            try{
                //check for the cảt cookie
                const sessionCartId = (await cookies()).get('sessionCartId')?.value;
            
                if (!sessionCartId) {
                throw new Error('Session cart ID not found');
                }
                //Get session and user id
                const session = await auth();
                const userId = session?.user?.id ?(session.user.id as string) : undefined;
                //Get cart
                const cart = await getMyCart();

                //Parse and validate the item
                const item = cartItemSchema.parse(data);
                //find product in database
                const product = await prisma.product.findFirst({
                    where: {id: item.productId},
                });
                if (!product) {
                    throw new Error('Product not found');
                }
                if (!cart) {
                    //Create a new cart if it doesn't exist
                    const newCart = insertCartSchema.parse({
                        userId: userId,
                        sessionCartId: sessionCartId,
                        items: [item],
                        ...calcPrice([item]),
                    });
                    //add the new cart to the database
                    await prisma.cart.create({
                        data: newCart,
                    });
                    revalidatePath(`/product/${product.slug}`);

                    return{
                        success: true,
                        message: `${product.name} added to cart successfully`,
                    };
                } else{
                    // check if item is already in the cart
                    const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId); 
                    //check if the item exists in the cart
                    if(existItem) {
                    if (product.stock < existItem.qty + 1) {
                        throw new Error('Not enough stock ');
                    }
                    //Increase the quantity
                    (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty + 1;
                    }else{
                        //if the item does not exist in the cart
                        //check stock
                        if (product.stock < 1) {
                            throw new Error('Not enough stock');
                        }
                        //Add the item to the cart
                        cart.items.push(item);
                    }
                    await prisma.cart.update({
                        where: { id: cart.id },
                        data: {
                            items: cart.items as Prisma.CartUpdateitemsInput[],     
                            ...calcPrice(cart.items as CartItem[])
                        }
                });
                revalidatePath(`/product/${product.slug}`);

                return {
                    success: true,
                    message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart `,
                };
                }
            
        }catch (error) {
            return {
                success: false,
                message: formatError(error)
            };
        }
        }
        export async function getMyCart () {
            const sessionCartId = (await cookies()).get('sessionCartId')?.value;
            
                if (!sessionCartId) {
                throw new Error('Session cart ID not found');
                }
                //Get session and user id
                const session = await auth();
                const userId = session?.user?.id ?(session.user.id as string) : undefined;
                //Get user cart from database
                        const cart = await prisma.cart.findFirst({
                            where:userId ? { userId: userId } : { sessionCartId: sessionCartId },
                            
                        });
                        if (!cart) return undefined;
                        //Cover decimals and return
                        return convertToPlainObject({
                            ...cart,
                            items:cart.items as CartItem[],
                            itemsPrice: cart.itemsPrice.toString(),
                            totalPrice: cart.totalPrice.toString(),
                            shippingPrice: cart.shippingPrice.toString(),
                            taxPrice: cart.taxPrice.toString(),
                        })
        }
    export async function removeItemFromCart(productId: string ) {
        try{
            const sessionCartId = (await cookies()).get('sessionCartId')?.value;
            
                if (!sessionCartId) {
                throw new Error('Session cart ID not found');
                }
                const product = await prisma.product.findFirst({
                    where: {id: productId}
                });
                if (!product) {
                    throw new Error('Product not found');
                }
                //Get user cart
                const cart = await getMyCart();
                if (!cart) {
                    throw new Error('Cart not found');
                }
                //check for item
                const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
                if (!exist) {
                    throw new Error('Item not found in cart');
                }
                //check if the item is the only item in the cart
                if (exist.qty === 1) {
                    cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
                }else {
                    //decrease the quantity
                    (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
                }

                //Update cart in database
                await prisma.cart.update({
                    where: { id: cart.id },
                    data: {
                        items: cart.items as Prisma.CartUpdateitemsInput[],
                        ...calcPrice(cart.items as CartItem[]),
                    }
                });
                revalidatePath(`/product/${product.slug}`);
                return {
                    success: true,
                    message: `${product.name} removed from cart successfully`,
                };

            }catch (error) {
                    return { success : false, message: formatError(error) };
                }
            }
        