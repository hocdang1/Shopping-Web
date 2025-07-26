import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { shippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.action";

export const metadata: Metadata = {
  title: "Shipping Address",
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect("/card");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID");
  const user = await getUserById(userId);
  return <>A</>;
};

export default ShippingAddressPage;
