import {Metadata} from "next";
import { getOrderById } from "@/lib/actions/order.action";
import { notFound} from "next/navigation";
import { ShippingAddress } from "@/types";  
import OrderDetailsTable from "./order-details-table";
export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details",
};
const OrderDetailsPage =async (props: {
    params: Promise<{ id: string }>;
}) => {
    const {id} =await props.params;
    const order = await getOrderById(id);
    if (!order) {
      return notFound();
    }
    return ( <OrderDetailsTable order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress}}/> );
}
 
export default OrderDetailsPage;