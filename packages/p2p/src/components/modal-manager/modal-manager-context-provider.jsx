import React from 'react';
import { useStores } from 'Stores';
import { ModalManagerContext } from './modal-manager-context';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState({});
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const { general_store } = useStores();

    const showModal = modal => {
        setActiveModal(modal);
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setActiveModal({});
        setIsModalOpen(false);
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    const state = {
        hideModal,
        is_modal_open,
        modal: active_modal,
        showModal,
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
