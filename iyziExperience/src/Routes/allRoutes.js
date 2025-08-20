import React from "react";
import {Navigate} from "react-router-dom";
import Store from "../pages/Store";
import Checkout from "../pages/Checkout";
import Links from "../pages/Links";
import PaymentCallback from "../pages/Checkout/components/PaymentCallback";

const publicRoutes = [
    {path: "/checkout", component: <Checkout/>},
    {path: "/checkout/callback", component: <PaymentCallback/>},
    {path: "/links", component: <Links/>},
    {path: "/store", component: <Store/>},
    {path: "/", exact: true, component: <Navigate to="/store"/>},
    {path: "*", component: <Navigate to="/store"/>},
];

export {publicRoutes};