export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern ecommerce platform built with Next.js";
export const SEVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
    email: "",
    password: "",
};
export const signUpDefaultValues = {
    email: "",
    name: "",
    confirmPassword: "",
    password: "",
};
export const shippingAddressDefaultValues = {
    fullName:'Huu Hoc',
    streetAddress:'130 thanh thuy',
    city:'Da Nang',
    postalCode:'50000',
    country:'Viet Nam',
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', '): ['PayPal','Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'Paypal';