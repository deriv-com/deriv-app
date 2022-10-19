import React from 'react';
import { ModalManagerContext } from './modal-manager-context';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState(null);
    const [is_modal_open, setIsModalOpen] = React.useState(false);

    const showModal = modal => {
        setActiveModal(modal);
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setActiveModal(null);
        setIsModalOpen(false);
    };

    const state = {
        hideModal,
        is_modal_open,
        modal: active_modal,
        showModal,
    };

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
