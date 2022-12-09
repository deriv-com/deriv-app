import React from 'react';
import { ModalManagerContext } from './modal-manager-context';
import { useStores } from 'Stores';
import { isDesktop } from '@deriv/shared';

const ModalManagerContextProvider = props => {
    const [active_modal, setActiveModal] = React.useState({});
    const [previous_modal, setPreviousModal] = React.useState({});
    // for mobile, modals are stacked and not shown alternatingly one by one
    const [stacked_modal, setStackedModal] = React.useState({});
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [modal_props, setModalProps] = React.useState(new Map());
    const { general_store } = useStores();

    const registerModalProps = modals => {
        if (Array.isArray(modals)) {
            modals.forEach(modal => setModalProps(modal_props.set(modal.key, modal.props)));
        } else {
            setModalProps(modal_props.set(modals.key, modals.props));
        }
    };

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

    const hideModal = () => {
        if (isDesktop()) {
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
        modal_props,
        registerModalProps,
        stacked_modal,
        showModal,
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
