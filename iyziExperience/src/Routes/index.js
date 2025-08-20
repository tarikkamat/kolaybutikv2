import React from 'react';
import {Route, Routes} from "react-router-dom";
import VerticalLayout from "../Layouts/index";
import {publicRoutes} from "./allRoutes";

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <VerticalLayout>
                                    {route.component}
                                </VerticalLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;