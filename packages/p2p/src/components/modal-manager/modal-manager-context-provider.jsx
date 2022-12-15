import React from 'react';
import { useStores } from 'Stores';
import { ModalManagerContext } from './modal-manager-context';
import { isDesktop } from '@deriv/shared';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState({});
    const [previous_modal, setPreviousModal] = React.useState({});
    // for mobile, modals are stacked and not shown alternatingly one by one
    const [stacked_modal, setStackedModal] = React.useState({});
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const { general_store } = useStores();

    const showModal = modal => {
        if (isDesktop()) {
            setPreviousModal(active_modal);
            setActiveModal(modal);
        } else if (Object.keys(active_modal).length === 0) {
            setActiveModal(modal);
        } else {
            setStackedModal(modal);
        }
        setIsModalOpen(true);
    };

    const hideModal = (should_save_form_history = false) => {
        if (isDesktop()) {
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
        } else if (Object.keys(stacked_modal).length !== 0) {
            setStackedModal({});
        } else {
            setActiveModal({});
            setIsModalOpen(false);
        }
    };

    const state = {
        hideModal,
        is_modal_open,
        modal: active_modal,
        stacked_modal,
        showModal,
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
