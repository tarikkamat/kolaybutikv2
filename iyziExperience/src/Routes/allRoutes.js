import React from "react";
import {Navigate} from "react-router-dom";
import Store from "../features/store";
import Checkout from "../features/checkout";
import Links from "../features/links";
import PaymentCallback from "../features/checkout/components/PaymentCallback";

const publicRoutes = [
    {path: "/checkout", component: <Checkout/>},
    {path: "/checkout/callback", component: <PaymentCallback/>},
    {path: "/links", component: <Links/>},
    {path: "/store", component: <Store/>},
    {path: "/", exact: true, component: <Navigate to="/store"/>},
    {path: "*", component: <Navigate to="/store"/>},
];

export {publicRoutes};