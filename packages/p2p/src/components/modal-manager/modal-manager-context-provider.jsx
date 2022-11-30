import React from 'react';
import { ModalManagerContext } from './modal-manager-context';
import { useStores } from 'Stores';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState({});
    const [previous_modal, setPreviousModal] = React.useState({});
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const { general_store } = useStores();

    const showModal = modal => {
        setPreviousModal(active_modal);
        setActiveModal(modal);
        setIsModalOpen(true);
    };

    const hideModal = (should_save_form_history = true) => {
        if (should_save_form_history) {
            general_store.saveFormState();
        } else {
            general_store.setSavedFormState(null);
        }

        if (previous_modal) {
            setActiveModal(previous_modal);
            setPreviousModal(null);
        } else {
            setActiveModal({});
            setIsModalOpen(false);
        }
    };

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
