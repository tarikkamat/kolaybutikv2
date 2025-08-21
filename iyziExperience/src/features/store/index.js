import React, {useEffect, useState} from "react"
import {Container} from "reactstrap"
import BreadCrumb from "../../Components/Common/BreadCrumb"
import ToastAlert from "../../Components/Common/ToastAlert"
import Options from "./Options";
import Market from "./Market";
import {StandartProducts} from "./market_data";
import Subscription from "../subscription";
import { useGlobalTour } from "../../Components/Context/TourContext";

const Store = () => {
    const [products, setProducts] = useState(null)
    const [selectedView, setSelectedView] = useState(1)
    const { autoStartTour } = useGlobalTour();

    function findView(selectedView) {
        switch (selectedView) {
            case 1:
                return <Market products={products}/>
            case 2:
                return <Subscription/>
            case 3:
                return <>Marketplace</>
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProducts(StandartProducts)
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
        }

        fetchData()
            .then(() => ToastAlert("Başarılı, ürünler getirildi.", "success"))
            .catch((error) => ToastAlert(error, "error"))
    }, [])

    useEffect(() => {
        autoStartTour();
    }, [autoStartTour]);

    document.title = "Mağaza | iyzico"

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Mağaza" pageTitle="Demo"/>
                    <Options selectedView={selectedView} setSelectedView={setSelectedView}/>
                    {findView(selectedView)}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Store