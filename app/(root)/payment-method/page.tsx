import {Metadata} from "next";
import {auth} from "@/auth";
import{getUserById} from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
export const metadata: Metadata = {
    title: 'Select Payment Method',
}

const PaymentMethodPage = async() => {
    const session = await auth ();
    const userId = session?.user?.id;

    if(!userId) throw new Error('User not found ');

    const user = await getUserById(userId);
    return ( <>
    <CheckoutSteps/>
    <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
    
    </> );
}
 
export default PaymentMethodPage;