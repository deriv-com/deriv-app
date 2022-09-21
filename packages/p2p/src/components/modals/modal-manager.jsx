import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { when } from 'mobx';
import { useStores } from 'Stores';
import CancelAddPaymentMethodModal from 'Components/my-profile/payment-methods/add-payment-method/cancel-add-payment-method-modal';
import QuickAddModal from 'Components/my-ads/quick-add-modal';

const ModalManager = () => {
    const { general_store } = useStores();
    const [root, setRoot] = React.useState();
    const [current_modal, setCurrentModal] = React.useState('');
    const [previous_modal, setPreviousModal] = React.useState('');

    React.useEffect(() => {
        const modal_root = document.getElementById('modal_root');
        if (modal_root) setRoot(modal_root);

        // only the views can decide to show a modal by calling general_store.setShouldShowModal(true)
        const disposer = when(
            () => general_store.should_show_modal,
            () => {
                // allow the current modal to hide first, while playing its animation
                general_store.setIsModalOpen(false);
                if (general_store.modal_id.length === 0 && previous_modal) {
                    setPreviousModal('');
                } else if (current_modal && !previous_modal) {
                        setPreviousModal({
                            id: general_store.modal_id,
                            history: general_store.modal_history,
                        });
                        setTimeout(() => {
                            // then only switch modal after the current modal has fully hidden and finished its closing animation with a specified allowed max timeout
                            // general_store.setModalId(general_store.modal_id); // check if this works, when user calls general_store.openModal(id) it already calls setModalId(id)
                            setCurrentModal(general_store.modal_id);
                            general_store.setIsModalOpen(true);
                        }, general_store.MODAL_TRANSITION_DURATION);
                    } else {
                        setPreviousModal('');
                        // restore history
                        setTimeout(() => {
                            // then only switch modal after the current modal has fully hidden and finished its closing animation
                            general_store.setModalId(previous_modal.modal_id);
                            setCurrentModal(general_store.modal_id);
                            general_store.setIsModalOpen(true);
                        }, general_store.MODAL_TRANSITION_DURATION);

                        // TODO: Check and set history after modal has fully opened, and ensure that the history values are not overwritten in the opened modal
                        general_store.setModalHistory('');
                    }
            }
        );

        return disposer;
    }, []);

    switch (general_store.modal_id) {
        case 'CancelAddPaymentMethodModal':
            return ReactDOM.createPortal(<CancelAddPaymentMethodModal {...general_store.modal_props} />, root);
        case 'QuickAddModal':
            return ReactDOM.createPortal(<QuickAddModal {...general_store.modal_props} />, root);
        // if modal_id is unset, remove and clear all modals
        case '':
        default:
            return null;
    }
};

export default observer(ModalManager);
