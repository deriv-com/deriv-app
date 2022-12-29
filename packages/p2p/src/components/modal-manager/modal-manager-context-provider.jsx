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

    /**
     * Hides the current shown modal.
     * If a previous modal was present, by default the previous modal will be shown in-place of the current closed modal.
     * This option can be overriden by setting `hide_all_modals` to `true` in the `options` argument to close all modals instead.
     *
     * @param {Object} options - list of supported settings to tweak how modals should be hidden:
     * - **hide_all_modals**: `false` by default. If set to `true`, previous modal will not be shown and all modals are hidden.
     * - **save_form_history**: `false` by default. If set to `true`, form values in modals that has a form with `ModalForm` component
     * will be saved when the modal is hidden and restored when modal is shown again.
     */
    const hideModal = (options = {}) => {
        const { save_form_history = false, hide_all_modals = false } = options;
        if (isDesktop()) {
            if (save_form_history) {
                general_store.saveFormState();
            } else {
                general_store.setSavedFormState(null);
                general_store.setFormikRef(null);
            }

            if (hide_all_modals) {
                setPreviousModal({});
                setActiveModal({});
                setIsModalOpen(false);
            } else if (previous_modal) {
                setActiveModal(previous_modal);
                setPreviousModal({});
            } else {
                setActiveModal({});
                setIsModalOpen(false);
            }
        } else if (Object.keys(stacked_modal).length !== 0) {
            if (hide_all_modals) {
                setActiveModal({});
                setIsModalOpen(false);
            }
            setStackedModal({});
        } else {
            setActiveModal({});
            setIsModalOpen(false);
        }
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;
    general_store.modal = active_modal;

    const state = {
        hideModal,
        is_modal_open,
        modal: active_modal,
        previous_modal,
        stacked_modal,
        showModal,
    };

    general_store.showModal = showModal;
    general_store.hideModal = hideModal;

    return <ModalManagerContext.Provider value={state}>{props.children}</ModalManagerContext.Provider>;
};

export default ModalManagerContextProvider;
