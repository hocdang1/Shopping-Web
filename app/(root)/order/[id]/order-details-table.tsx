    'use client';
    import { Order } from "@/types";
    import { formatCurrency, formatDateTime, formatID } from "@/lib/utils";
    import { Card, CardContent } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import Link from "next/link";
    import Image from "next/image";
    const OrderDetailsTable = ({order}:{order:Order;}) => {
        const {
            id,
            shippingAddress,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paymentMethod,
            isPaid,
            isDelivered,
            paidAt,
            deliveredAt,

        } = order;
        return (<>
        <h1 className="text-2xl font-bold mb-4">Order {formatID (id)} </h1>
        <div className="grid md:grid-cols-3 md:gap-5">
            <div className="col-span-2 space-y-4 overflow-x-auto">
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-lg font-semibold mb-2">Payment method</h2>
                        <p className="mb-2">{paymentMethod}</p>
                        {isPaid ? (
                            <Badge variant='secondary' className="mt-2">
                                Paid at {formatDateTime(paidAt!).dateTime}
                            </Badge>
                        ) : (
                            <Badge variant='destructive' className="mt-2">
                                Not paid
                            </Badge>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                        <p>{shippingAddress.fullName}</p>
                        <p>{shippingAddress.streetAddress},{shippingAddress.city}
                            {shippingAddress.postalCode},{shippingAddress.country}
                        </p>
                        {isDelivered ? (
                            <Badge variant='secondary' className="mt-2">
                                Paid on {formatDateTime(deliveredAt!).dateTime}
                            </Badge>
                        ) : (
                            <Badge variant='destructive' className="mt-2">
                                Not delivered
                            </Badge>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
                        <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {order.orderItems?.map((item) => (
                        <TableRow key={item.slug}>
                        <TableCell>
                            <Link href={`/product/${item.slug}`} className="flex items-center">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                            />
                            <span className="px-2">{item.name}</span>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <span className="px-2">{item.qty}</span>
                        </TableCell>
                        <TableCell className="text-right">
                                ${item.price}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Items</div>
                            <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                    </CardContent>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Tax</div>
                            <div>{formatCurrency(taxPrice)}</div>
                            </div>
                    </CardContent>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Shipping</div>
                            <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                    </CardContent>
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Total</div>
                            <div>{formatCurrency(totalPrice)}</div>
                            </div>
                            
                    </CardContent>
                </Card>
            </div>
        </div>
        </> 
        );
    }
    
    export default OrderDetailsTable;