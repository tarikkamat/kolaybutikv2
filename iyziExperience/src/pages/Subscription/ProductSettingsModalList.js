import CreateProductModal from "./Modals/CreateProductModal";
import React from "react"

const ProductSettingsModalList = ({activeModal, setActiveModal}) => {

    const toggleModal = (modalName) => {
        setActiveModal(activeModal === modalName ? null : modalName);
    };

    return (
        <>
            <CreateProductModal
                isOpen={activeModal === 'createProduct'}
                toggle={() => toggleModal('createProduct')}
            />
        </>
    )
}

export default ProductSettingsModalList