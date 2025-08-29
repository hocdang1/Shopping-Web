"use client";

import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react"; 
import { createOrder } from "@/lib/actions/order.action";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await createOrder();
      console.log("Create order response:", res);

      if (res?.redirectTo) {
        router.push(res.redirectTo);
        return;
      }

      if (!res.success) {
        alert(res.message || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button disabled={isPending} className="w-full">
        {isPending ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}
        {" "}Place Order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;
