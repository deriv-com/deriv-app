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
    const [modal_props, setModalProps] = React.useState(new Map());
    const { general_store } = useStores();

    /**
     * Sets the specified modals' props on mount or when the props passed to the hook has changed.
     *
     * Use this hook to declare the modals' props beforehand for cases when the props can't be passed/declared in stores.
     *
     * For instance, calling `showModal({key: ..., props: ... })` in a store action where the props can't be passed to the action, use this hook to pass the props beforehand
     * and simply call `showModal({key: ...})` without the need to specify the props, since its already passed using this hook to the modal manager.
     *
     * @param {Object|Object[]} modals - list of object modals to set props, each modal object must contain a 'key' attribute and 'props' attribute
     */
    const useRegisterModalProps = modals => {
        const registerModals = React.useCallback(() => {
            if (Array.isArray(modals)) {
                modals.forEach(modal => setModalProps(modal_props.set(modal.key, modal.props)));
            } else {
                setModalProps(modal_props.set(modals.key, modals.props));
            }
        }, [modals]);

        React.useEffect(registerModals, [modals]);
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
    const hideModal = (should_save_form_history = false) => {
        modal_props.delete(active_modal.key);
        if (isDesktop()) {
            if (should_save_form_history) {
                general_store.saveFormState();
            } else {
                general_store.setSavedFormState(null);
                general_store.setFormikRef(null);
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

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    const state = {
        hideModal,
        is_modal_open,
        modal: active_modal,
        modal_props,
        useRegisterModalProps,
        stacked_modal,
        showModal,
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
